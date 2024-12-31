/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { PromptForm } from "@/components/prompt-form"
import { type FormValues, type ApiKeyValues } from "@/components/prompt-form"
import { generateSalesPrompt } from "@/lib/openai"
import { DemoLink } from "@/components/demo-link"
import { supabase } from "@/lib/supabase"

const STORAGE_KEY = "sales-prompt-result"

export function PromptContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const [demoId, setDemoId] = useState<string | null>(null)
  const [currentFormData, setCurrentFormData] = useState<(FormValues & ApiKeyValues) | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [formHeight, setFormHeight] = useState<number>(0)

  useEffect(() => {
    const updateHeight = () => {
      if (formRef.current) {
        setFormHeight(formRef.current.offsetHeight)
      }
    }
    
    // Initial update
    updateHeight()
    
    // Update after a short delay to ensure form is fully rendered
    const initialTimer = setTimeout(updateHeight, 100)
    
    // Update on window resize
    window.addEventListener('resize', updateHeight)
    
    // Create a mutation observer to watch for DOM changes
    const observer = new MutationObserver(updateHeight)
    if (formRef.current) {
      observer.observe(formRef.current, { 
        subtree: true, 
        childList: true,
        attributes: true 
      })
    }
    
    return () => {
      window.removeEventListener('resize', updateHeight)
      observer.disconnect()
      clearTimeout(initialTimer)
    }
  }, [])

  const handleSubmit = async (values: FormValues & ApiKeyValues) => {
    if (!values.vapiKey) {
      return false
    }
    setIsLoading(true)
    setCurrentFormData(values)
    try {
      const prompt = await generateSalesPrompt(values)

      // Save to Supabase
      const { data, error } = await supabase
        .from('voice_agent_configs')
        .insert({
          ai_representative_name: values.aiName,
          company_name: values.companyName,
          industry: values.industry,
          target_audience: values.targetAudience,
          product_service_description: values.product,
          challenges_solved: values.challenges,
          call_objective: values.objective,
          common_objections: values.objections,
          additional_context: values.additionalInfo || null,
          system_prompt: prompt,
          first_message: `Hi, this is ${values.aiName} from ${values.companyName}, is this the owner?`,
          model_name: values.model,
          vapi_key: values.vapiKey
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error saving to Supabase:', error)
        throw error
      }

      setDemoId(data.id)
      console.log('Saved to Supabase with ID:', data.id)
      
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex w-full gap-6">
      <div ref={formRef} className="w-1/2">
        <PromptForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          restoredFormData={currentFormData}
        />
      </div>
      <div className="w-1/2">
        <DemoLink
          demoId={demoId}
          isLoading={isLoading}
          currentFormData={currentFormData}
        />
      </div>
    </div>
  )
}
