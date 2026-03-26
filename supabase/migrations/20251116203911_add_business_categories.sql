/*
  # Add Business Categories

  1. Changes
    - Add `business_name` to profiles table
    - Add `business_category` to profiles table (restaurant, retail, service, hospitality, transport, education, other)
    - Add `verification_status` to profiles table

  2. Notes
    - This allows businesses to be categorized
    - Split bill features will only be available to restaurant category
    - POS and tipping features available to all verified businesses
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN business_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'business_category'
  ) THEN
    ALTER TABLE profiles ADD COLUMN business_category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN verification_status text DEFAULT 'pending';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_business_category ON profiles(business_category);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);
