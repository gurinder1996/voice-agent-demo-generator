import { useCallState } from "@/lib/call-state"
import { cn } from "@/lib/utils"

export function CallStatus({ className }: { className?: string }) {
  const state = useCallState(state => state.state)
  const error = useCallState(state => state.error)

  const getStatusText = () => {
    switch (state) {
      case 'connecting':
        return 'Connecting call...'
      case 'active':
        return 'Call in progress'
      case 'error':
        return `Call failed: ${error?.message || 'Unknown error'}`
      default:
        return 'Ready to call'
    }
  }

  const getStatusColor = () => {
    switch (state) {
      case 'connecting':
        return 'text-yellow-600'
      case 'active':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={cn("text-sm font-medium", getStatusColor(), className)}>
      {getStatusText()}
    </div>
  )
}
