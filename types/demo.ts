export interface Demo {
  id: string;
  created_at: string;
  updated_at?: string;
  ai_representative_name: string;
  company_name: string;
  industry: string;
  target_audience: string;
  product_service_description: string;
  challenges_solved: string;
  call_objective: string;
  common_objections: string;
  additional_context?: string;
  system_prompt: string;
  voice_provider: string;
  voice_id: string;
  voice_stability: number;
  voice_similarity_boost: number;
  voice_filler_injection_enabled: boolean;
  voice_optimize_streaming_latency: number;
  model_provider: string;
  model_name: string;
  transcriber_provider: string;
  transcriber_model: string;
  transcriber_language: string;
  first_message: string;
  is_active: boolean;
  version: number;
  vapi_key: string;
}

export type DemoPreview = Pick<
  Demo,
  'id' | 'created_at' | 'company_name' | 'ai_representative_name' | 'industry'
>;
