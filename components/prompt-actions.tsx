"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Trash2, RotateCcw, Phone, PhoneOff, Loader2 } from "lucide-react"
import { useState, useCallback } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCallState, type CallState } from "@/lib/call-state"
import { cn } from "@/lib/utils"

const baseButtonStyles = "h-8 w-8 p-0 rounded-full border shadow-sm bg-white"

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void
  className?: string
  children: React.ReactNode
  tooltipContent: string
}

function ActionButton({ onClick, className, children, tooltipContent }: ActionButtonProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`${baseButtonStyles} ${className}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface CopyButtonProps {
  text: string
  onCopy?: () => void
}

export function CopyButton({ text, onCopy }: CopyButtonProps) {
  const { toast } = useToast()

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Markdown prompt copied to clipboard",
    })
    onCopy?.()
  }, [text, toast, onCopy])

  return (
    <ActionButton
      onClick={handleCopy}
      className="text-muted-foreground hover:text-primary hover:border-primary/50"
      tooltipContent="Copy to clipboard"
    >
      <Copy className="h-4 w-4" />
      <span className="sr-only">Copy to clipboard</span>
    </ActionButton>
  )
}

interface DeleteButtonProps {
  onDelete: () => void
  confirmationMessage?: string
  deleteMessage?: string
}

export function DeleteButton({ 
  onDelete, 
  confirmationMessage = "Click again to confirm",
  deleteMessage = "Delete prompt"
}: DeleteButtonProps) {
  const [confirmation, setConfirmation] = useState(false)
  const { toast } = useToast()

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmation) {
      onDelete()
      setConfirmation(false)
      toast({
        title: "Deleted",
        description: "Prompt removed",
      })
    } else {
      setConfirmation(true)
      setTimeout(() => {
        setConfirmation(false)
      }, 3000)
    }
  }, [confirmation, onDelete, toast])

  return (
    <ActionButton
      onClick={handleDelete}
      className={confirmation 
        ? "bg-destructive text-white border-destructive hover:bg-destructive hover:text-white hover:border-destructive" 
        : "text-muted-foreground hover:text-destructive hover:border-destructive"}
      tooltipContent={confirmation ? confirmationMessage : deleteMessage}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">
        {confirmation ? confirmationMessage : deleteMessage}
      </span>
    </ActionButton>
  )
}

interface RestoreButtonProps {
  onRestore: () => void
}

export function RestoreButton({ onRestore }: RestoreButtonProps) {
  const { toast } = useToast()

  const handleRestore = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onRestore()
    toast({
      title: "Restored",
      description: "Previous form data has been restored",
    })
  }, [onRestore, toast])

  return (
    <ActionButton
      onClick={handleRestore}
      className="text-muted-foreground hover:text-emerald-600 hover:border-emerald-600/50"
      tooltipContent="Restore this prompt"
    >
      <RotateCcw className="h-4 w-4" />
      <span className="sr-only">Restore form data</span>
    </ActionButton>
  )
}

interface CallButtonProps {
  buttonId: string
  onCall?: () => Promise<{
    apiKey: string,
    systemPrompt: string,
    context: { assistantName: string; companyName: string }
  }>;
}

export function CallButton({ buttonId, onCall }: CallButtonProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const { toast } = useToast()

  const callState = useCallState(state => state.state)
  const activeButtonId = useCallState(state => state.activeButtonId)
  const initiateCall = useCallState(state => state.initiateCall)
  const endCall = useCallState(state => state.endCall)

  const isThisButtonActive = activeButtonId === buttonId
  const canInteract = callState === 'idle' || (callState === 'error' && isThisButtonActive) || (callState === 'active' && isThisButtonActive)

  const handleToggleCall = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    setTooltipOpen(false)  // Hide tooltip during state change
    
    try {
      if (callState === 'active' && isThisButtonActive) {
        await endCall(buttonId)
      } else if (canInteract && onCall) {
        const { apiKey, systemPrompt, context } = await onCall()
        await initiateCall(buttonId, apiKey, systemPrompt, context)
      } else if (!canInteract) {
        throw new Error('Another call is in progress')
      }
    } catch (error) {
      toast({
        title: "Call Error",
        description: error instanceof Error ? error.message : "Failed to manage call",
        variant: "destructive",
      })
    }
    
    // Show tooltip with new state after a brief delay
    setTimeout(() => setTooltipOpen(true), 100)
  }, [buttonId, callState, isThisButtonActive, canInteract, onCall, endCall, initiateCall, toast])

  const getButtonContent = () => {
    if (callState === 'connecting' && isThisButtonActive) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }

    switch (callState as CallState) {
      case 'active':
        return isThisButtonActive ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />
      case 'error':
        return isThisButtonActive ? <Phone className="h-4 w-4 text-destructive" /> : <Phone className="h-4 w-4" />
      default:
        return <Phone className="h-4 w-4" />
    }
  }

  const getButtonStyles = () => {
    if (callState === 'connecting') {
      return isThisButtonActive 
        ? "border-primary/50 pointer-events-none !cursor-not-allowed opacity-50" 
        : "pointer-events-none !cursor-not-allowed opacity-50"
    }

    switch (callState as CallState) {
      case 'active':
        return isThisButtonActive ? "border-primary/50" : ""
      case 'error':
        return isThisButtonActive ? "border-destructive/50" : ""
      default:
        return "hover:border-primary/50"
    }
  }

  const getTooltipContent = () => {
    if (callState === 'connecting') {
      return isThisButtonActive ? "Cancel connecting..." : "Call in progress"
    }

    switch (callState as CallState) {
      case 'active':
        return isThisButtonActive ? "End call" : "Call in progress"
      case 'error':
        return "Try calling again"
      default:
        return "Start call"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCall}
            className={cn(baseButtonStyles, getButtonStyles())}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            disabled={callState === 'connecting' || (callState !== 'idle' && !isThisButtonActive)}
          >
            {getButtonContent()}
            <span className="sr-only">{getTooltipContent()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
