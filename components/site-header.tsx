import { FaGithub } from "react-icons/fa"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SiteHeader() {
  return (
    <div className="relative space-y-2 text-center mb-4 bg-gray-50 p-8 rounded-lg">
      <h1 className="text-4xl font-bold tracking-tight inline-block">AI Voice Agent</h1>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-black hover:scale-125 transition-all ml-4"
            >
              <FaGithub className="w-6 h-6" />
              <span className="sr-only"></span>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="text-muted-foreground text-lg">
        
      </p>
    </div>
  )
}
