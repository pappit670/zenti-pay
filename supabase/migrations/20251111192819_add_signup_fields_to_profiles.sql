/*
  # Add signup fields to profiles table

  1. Changes
    - Add `phone_number` column to store user phone numbers
    - Add `national_id` column to store national ID for personal accounts
    - Add `business_name` column to store business names
    - Add `business_type` column to store business types (Retail, Restaurant, etc.)
    - Add `business_id` column to store business registration numbers
  
  2. Notes
    - All fields are optional to support both personal and business accounts
    - Existing records will have NULL values for these new fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'national_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN national_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN business_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'business_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN business_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'business_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN business_id text;
  END IF;
END $$;