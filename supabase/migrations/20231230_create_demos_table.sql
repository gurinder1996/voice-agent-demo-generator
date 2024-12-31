-- Create demos table
CREATE TABLE IF NOT EXISTS demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  aiName TEXT NOT NULL,
  companyName TEXT NOT NULL,
  industry TEXT NOT NULL,
  targetAudience TEXT NOT NULL,
  product TEXT NOT NULL,
  challenges TEXT NOT NULL,
  objective TEXT NOT NULL,
  objections TEXT NOT NULL,
  additionalInfo TEXT,
  systemPrompt TEXT NOT NULL,
  vapiKey TEXT NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS demos_id_idx ON demos(id);
