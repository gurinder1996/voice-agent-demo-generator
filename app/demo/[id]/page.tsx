"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallState } from "@/lib/call-state"
import { Card } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { Voice, RealisticVoice, fetchVoices, fetchRealisticVoices, fallbackVoices } from "@/lib/voices"

interface DemoSettings {
  id: string
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
  model_name: string
  first_message: string
  vapi_key: string // This will be populated from vapiKey in Supabase
  // Voice settings (hardcoded for now)
  voice_provider: string
  voice_id: string
  voice_stability: number
  voice_similarity_boost: number
  voice_filler_injection_enabled: boolean
  voice_optimize_streaming_latency: number
}

export default function DemoPage() {
  const params = useParams()
  const demoId = params?.id as string
  const [settings, setSettings] = useState<DemoSettings | null>(null)
  const [voices, setVoices] = useState<Voice[]>(fallbackVoices)
  const [realisticVoices, setRealisticVoices] = useState<RealisticVoice[]>([])
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(fallbackVoices[0].id)
  const { initiateCall, endCall, state: callState } = useCallState()
  const isActiveCall = callState === 'active'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      if (!demoId) return

      try {
        // First check localStorage
        const cachedSettings = localStorage.getItem(`demo-${demoId}`)
        if (cachedSettings) {
          setSettings(JSON.parse(cachedSettings))
          setLoading(false)
          return
        }

        const tableName = process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME;
        if (!tableName) {
          throw new Error("NEXT_PUBLIC_SUPABASE_TABLE_NAME environment variable is not set");
        }

        // If not in cache, fetch from Supabase
        console.log("Fetching from Supabase with table:", tableName, "and demoId:", demoId);
        const { data, error: supabaseError } = await supabase
          .from(tableName)
          .select("id, ai_representative_name, company_name, industry, target_audience, product_service_description, challenges_solved, call_objective, common_objections, additional_context, system_prompt, model_name, first_message")
          .eq("id", demoId)
          .single()

        if (supabaseError) {
          console.error("Error fetching demo settings:", supabaseError)
          throw supabaseError
        }

        if (data) {
          console.log("Raw Supabase data:", data)
          console.log("First message from Supabase:", data.first_message)
          // Always use the same VAPI key for demo pages
          const settingsWithDefaults = {
            ...data,
            vapi_key: process.env.NEXT_PUBLIC_VAPI_API_KEY, // Use environment variable
            voice_provider: '11labs',
            voice_id: selectedVoiceId, // Use the selected voice ID
            voice_stability: 0.6,
            voice_similarity_boost: 0.75,
            voice_filler_injection_enabled: false,
            voice_optimize_streaming_latency: 4
          }
          setSettings(settingsWithDefaults as DemoSettings)
          // Store in localStorage for persistence
          localStorage.setItem(`demo-${demoId}`, JSON.stringify(settingsWithDefaults))
        } else {
          throw new Error("Demo not found")
        }
      } catch (err) {
        console.error("Error fetching demo settings:", err)
        setError("Failed to load demo settings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [demoId, selectedVoiceId])

  useEffect(() => {
    // Fetch voices from Supabase
    const loadVoices = async () => {
      const [voicesList, realisticVoicesList] = await Promise.all([
        fetchVoices(),
        fetchRealisticVoices()
      ]);
      setVoices(voicesList);
      setRealisticVoices(realisticVoicesList);
      if (voicesList.length > 0) {
        setSelectedVoiceId(voicesList[0].id);
      }
    };
    loadVoices();
  }, []);

  const handleCallButton = async () => {
    if (!settings || !demoId) return

    if (isActiveCall) {
      await endCall(demoId)
    } else {
      try {
        // Find the selected voice to get its provider
        const selectedVoice = voices.find(v => v.id === selectedVoiceId);
        if (!selectedVoice) {
          throw new Error("Selected voice not found");
        }

        console.log("Selected voice:", selectedVoice);
        
        // Use environment variable for VAPI key
        const DEMO_VAPI_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY
        if (!DEMO_VAPI_KEY) {
          throw new Error("NEXT_PUBLIC_VAPI_API_KEY environment variable is missing")
        }
        await initiateCall(
          demoId,
          DEMO_VAPI_KEY,
          settings.system_prompt,
          {
            assistantName: settings.ai_representative_name,
            companyName: settings.company_name,
            firstMessage: settings.first_message,
            voice: {
              voiceId: selectedVoiceId,
              provider: selectedVoice.provider,
              stability: 0.6,
              similarityBoost: 0.75,
              fillerInjectionEnabled: false,
              optimizeStreamingLatency: 4
            }
          }
        )
        console.log("Call initiated successfully with first message:", settings.first_message)
      } catch (err) {
        console.error("Failed to initiate call:", err)
        setError("Failed to start call. Please try again.")
      }
    }
  }

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading demo settings...</div>
      </div>
    )
  }

  if (error || !settings) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-6">
          <div className="text-lg text-red-500">{error || "Demo not found"}</div>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome! I'm {capitalizeFirstLetter(settings?.ai_representative_name) || 'Casey'},
        </h1>
        <h2 className="text-xl text-center mb-4">
          your AI Assistant from {settings?.company_name || 'Acme Computer Corp.'} 
        </h2>
        <p className="text-gray-600 text-center mb-6">
        Choose from 50+ AI voices below
        </p>
        <div className="flex flex-col gap-4">
          <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            onClick={handleCallButton}
            disabled={!settings || loading}
            variant={isActiveCall ? "destructive" : "default"}
          >
            <Phone className="mr-2 h-4 w-4" />
            {isActiveCall ? "End Call" : "Start Call"}
          </Button>
        </div>
      </Card>

      {realisticVoices.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
           💫 Popular Voices
            <p className="text-sm text-gray-600 font-normal mt-1">
              These voices are known for their natural and lifelike quality
            </p>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {realisticVoices.map((voice) => (
              <div key={voice.voice_id} className="p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors">
                {voice.voice_name}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
