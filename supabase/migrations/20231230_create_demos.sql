-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create demos table
CREATE TABLE IF NOT EXISTS demos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ai_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    product TEXT NOT NULL,
    challenges TEXT NOT NULL,
    objective TEXT NOT NULL,
    objections TEXT NOT NULL,
    additional_info TEXT,
    system_prompt TEXT NOT NULL,
    vapi_key TEXT NOT NULL
);

-- Create RLS policies
ALTER TABLE demos ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads (since these are public demo pages)
CREATE POLICY "Allow anonymous read access" 
    ON demos FOR SELECT 
    TO anon
    USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS demos_created_at_idx ON demos(created_at DESC);
