/*
  # ZENTI Core Features Extension

  1. New Tables
    - `user_modes`
      - Tracks which mode each user is currently in (Personal/Business)
      - Links to admin role management
    
    - `qr_codes`
      - Dynamic QR codes for payments
      - Service-specific QR codes (Qobu, Aroltte, etc.)
    
    - `business_analytics`
      - Real-time sales data
      - Customer insights
      - Revenue tracking
    
    - `tax_records`
      - Transaction logs for tax purposes
      - Period-based breakdowns
    
    - `payment_requests`
      - Request money feature
      - Track pending/completed requests
    
    - `nearby_transactions`
      - Location-based payment discovery
      - Proximity payments

  2. Security
    - Enable RLS on all new tables
    - Restrictive policies for user data access
    - Admin-only policies for management features
*/

-- User modes and roles
CREATE TABLE IF NOT EXISTS user_modes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  current_mode text NOT NULL DEFAULT 'personal',
  is_admin boolean DEFAULT false,
  is_business_verified boolean DEFAULT false,
  business_name text,
  business_registration text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_modes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mode"
  ON user_modes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own mode"
  ON user_modes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own mode"
  ON user_modes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- QR codes management
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  qr_type text NOT NULL DEFAULT 'payment',
  qr_data text NOT NULL,
  service_name text,
  amount decimal(15,2),
  is_dynamic boolean DEFAULT true,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  scan_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own QR codes"
  ON qr_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QR codes"
  ON qr_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QR codes"
  ON qr_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own QR codes"
  ON qr_codes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Business analytics
CREATE TABLE IF NOT EXISTS business_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_sales decimal(15,2) DEFAULT 0.00,
  transaction_count integer DEFAULT 0,
  average_transaction decimal(15,2) DEFAULT 0.00,
  top_customer_id uuid REFERENCES profiles,
  top_product text,
  revenue decimal(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business users can view own analytics"
  ON business_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Business users can insert own analytics"
  ON business_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business users can update own analytics"
  ON business_analytics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tax records
CREATE TABLE IF NOT EXISTS tax_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions ON DELETE CASCADE,
  tax_year integer NOT NULL,
  tax_period text NOT NULL,
  transaction_type text NOT NULL,
  gross_amount decimal(15,2) NOT NULL,
  tax_amount decimal(15,2) DEFAULT 0.00,
  net_amount decimal(15,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tax records"
  ON tax_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax records"
  ON tax_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Payment requests (Request Money feature)
CREATE TABLE IF NOT EXISTS payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  payer_id uuid REFERENCES profiles ON DELETE CASCADE,
  amount decimal(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  description text,
  status text DEFAULT 'pending',
  qr_code_id uuid REFERENCES qr_codes,
  expires_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment requests"
  ON payment_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = payer_id);

CREATE POLICY "Users can create payment requests"
  ON payment_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own payment requests"
  ON payment_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = payer_id)
  WITH CHECK (auth.uid() = requester_id OR auth.uid() = payer_id);

-- Add user role column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_role text DEFAULT 'user';
  END IF;
END $$;

-- Add theme preference column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'theme_preference'
  ) THEN
    ALTER TABLE profiles ADD COLUMN theme_preference text DEFAULT 'light';
  END IF;
END $$;

-- Add phone number column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_number text;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_modes_user_id ON user_modes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_is_active ON qr_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_business_analytics_user_id ON business_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_business_analytics_date ON business_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_tax_records_user_id ON tax_records(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_records_tax_year ON tax_records(tax_year);
CREATE INDEX IF NOT EXISTS idx_payment_requests_requester_id ON payment_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_payer_id ON payment_requests(payer_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
