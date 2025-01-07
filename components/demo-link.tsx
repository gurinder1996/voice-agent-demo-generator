"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Copy, RotateCcw, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormValues } from "./prompt-form"
import { useCallState } from "@/lib/call-state"

interface DemoHistoryItem {
  id: string
  timestamp: number
  formData: FormValues
}

interface DemoLinkProps {
  demoId: string | null
  isLoading: boolean
  currentFormData: FormValues | null
}

const HISTORY_STORAGE_KEY = "demo-history"

export function DemoLink({ demoId, isLoading, currentFormData }: DemoLinkProps) {
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<DemoHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<string>('current')
  const [mounted, setMounted] = useState(false)

  const { initiateCall, endCall, state: callState } = useCallState()

  useEffect(() => {
    setMounted(true)
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    if (demoId && currentFormData && mounted) {
      const existingItem = history.find(item => item.id === demoId + '-history')
      if (!existingItem) {
        const newHistoryItem: DemoHistoryItem = {
          id: demoId + '-history',
          timestamp: Date.now(),
          formData: {
            aiName: currentFormData.aiName,
            companyName: currentFormData.companyName,
            industry: currentFormData.industry,
            targetAudience: currentFormData.targetAudience,
            product: currentFormData.product,
            challenges: currentFormData.challenges,
            objective: currentFormData.objective,
            objections: currentFormData.objections,
            additionalInfo: currentFormData.additionalInfo,
            model: currentFormData.model
          }
        }

        const updatedHistory = [newHistoryItem, ...history].slice(0, 10)
        setHistory(updatedHistory)
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
      }
    }
  }, [demoId, currentFormData, mounted, history])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleCall = async (id: string, formData: FormValues, historyItem?: DemoHistoryItem) => {
    const vapiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY
    if (!vapiKey) {
      alert("Please configure the VAPI API key in .env.local")
      return
    }
    
    try {
      // Remove '-history' suffix if it exists
      const actualId = id.replace('-history', '')
      await initiateCall(
        actualId,
        vapiKey,
        `You are ${formData.aiName}, an AI sales representative for ${formData.companyName}, a company specializing in ${formData.industry}. You focus on helping ${formData.targetAudience} address their ${formData.challenges} through expert consultations. Your primary objective for each call is to ${formData.objective}.`,
        {
          assistantName: formData.aiName,
          companyName: formData.companyName
        }
      )
    } catch (error) {
      console.error('Failed to initiate call:', error)
      alert('Failed to start call. Please try again.')
    }
  }

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
  }

  const formatTimestamp = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(timestamp))
  }

  const renderDemoContent = (id: string, formData: FormValues, showTimestamp = false, historyItem?: DemoHistoryItem) => {
    const actualId = id.replace('-history', '')
    const demoUrl = `${window.location.origin}/demo/${actualId}`
    const isActiveCall = callState === 'active' || callState === 'connecting'

    return (
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2">
            <div className="font-medium">
              You are {formData.aiName}, an AI sales representative for {formData.companyName}...
            </div>
            {showTimestamp && (
              <div className="text-sm text-gray-500">
                {formatTimestamp(historyItem?.timestamp || Date.now())}
              </div>
            )}
          </div>
          <div className="mt-1 text-sm text-gray-500">{demoUrl}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isActiveCall ? endCall(actualId) : handleCall(actualId, formData, historyItem)}
            className={isActiveCall ? "text-red-500 hover:text-red-600" : ""}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(demoUrl)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          {historyItem && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="relative h-full">
      <Tabs defaultValue="current" className="h-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" className="p-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-lg text-gray-500">Generating demo link...</div>
            </div>
          ) : demoId && currentFormData ? (
            renderDemoContent(demoId, currentFormData)
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-lg text-gray-500">
                Fill out the form and click &quot;Generate Prompt&quot; to create a demo
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-2 overflow-auto p-4">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="border-b pb-2 last:border-b-0">
                {renderDemoContent(item.id, item.formData, true, item)}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No demo history yet</div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
