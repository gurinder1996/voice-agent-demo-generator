import { createBrowserClient } from '@supabase/ssr';

export interface Voice {
  id: string;
  name: string;
  provider: string;
}

export interface RealisticVoice {
  voice_id: string;
  voice_name: string;
}

export async function fetchVoices() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('best_voices')
    .select('voice_id, voice_name, voice_provider')
    .order('voice_name');

  if (error) {
    console.error('Error fetching voices:', error);
    return fallbackVoices;
  }

  return data.map(voice => ({
    id: voice.voice_id,
    name: voice.voice_name,
    provider: voice.voice_provider
  })) as Voice[];
}

export async function fetchRealisticVoices() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('realistic_voices')
    .select('voice_id, voice_name')
    .order('voice_name');

  if (error) {
    console.error('Error fetching realistic voices:', error);
    return [];
  }

  return data as RealisticVoice[];
}

// Fallback voices in case of fetch failure
export const fallbackVoices: Voice[] = [
  { name: "Young Jamal", id: "6OzrBCQf8cjERkYgzSg8", provider: "11labs" }
] as const;
