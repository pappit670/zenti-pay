export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  account_number: string;
  member_since: string;
  is_premium: boolean;
  business_name?: string;
  business_category?: 'restaurant' | 'retail' | 'service' | 'hospitality' | 'transport' | 'education' | 'other';
  verification_status?: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_type: string;
  currency: string;
  balance: number;
  account_number: string;
  card_last_four?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  user_id: string;
  type: 'send' | 'receive' | 'request' | 'add_funds';
  amount: number;
  currency: string;
  recipient_name?: string;
  sender_name?: string;
  description?: string;
  reference_number?: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_address: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
