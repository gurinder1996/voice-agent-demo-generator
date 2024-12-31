import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for our voice agent configuration
export type VoiceAgentConfig = {
  id?: string
  ai_representative_name: string
  company_name: string
  industry: string
  target_audience: string
  product_service_description: string
  challenges_solved: string
  call_objective: string
  common_objections: string
  additional_context?: string | null
  system_prompt: string
  voice_provider?: string
  voice_id?: string
  voice_stability?: number
  voice_similarity_boost?: number
  voice_filler_injection_enabled?: boolean
  voice_optimize_streaming_latency?: number
  model_provider?: string
  model_name: string
  transcriber_provider?: string
  transcriber_model?: string
  transcriber_language?: string
  first_message: string
  is_active?: boolean
  version?: number
}
