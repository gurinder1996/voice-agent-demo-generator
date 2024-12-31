import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useCallState } from "@/lib/call-state"

export function CallErrorToast() {
  const { toast } = useToast()
  const error = useCallState(state => state.error)
  const state = useCallState(state => state.state)

  useEffect(() => {
    if (error && state === 'error') {
      toast({
        title: "Call Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [error, state, toast])

  return null
}
