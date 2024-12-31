"use client"

import { useEffect, useRef } from "react"

export function TabIndicator({ selectedTab }: { selectedTab: HTMLElement | null }) {
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedTab && indicatorRef.current) {
      const indicator = indicatorRef.current
      const { offsetLeft, offsetWidth } = selectedTab

      indicator.style.transform = `translateX(${offsetLeft}px)`
      indicator.style.width = `${offsetWidth}px`
    }
  }, [selectedTab])

  return (
    <div
      ref={indicatorRef}
      className="absolute left-0 top-[4px] h-[calc(100%-8px)] rounded-md bg-background transition-all duration-200"
      style={{ width: selectedTab?.offsetWidth }}
    />
  )
}
