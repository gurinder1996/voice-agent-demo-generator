'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Demo, DemoPreview } from '@/types/demo';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const baseButtonStyles = "h-8 w-8 p-0 rounded-full border shadow-sm bg-white";

function CopyButton({ text }: { text: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Demo URL copied to clipboard",
    });
  };

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`${baseButtonStyles} text-muted-foreground hover:text-primary hover:border-primary/50`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy demo URL</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function DemosListPage() {
  const [demos, setDemos] = useState<DemoPreview[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchDemos() {
      try {
        const { data, error } = await supabase
.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME || (() => { throw new Error("NEXT_PUBLIC_SUPABASE_TABLE_NAME is not defined"); })())
          .select(`
            id,
            created_at,
            company_name,
            ai_representative_name,
            industry
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDemos(data || []);
      } catch (error) {
        console.error('Error fetching demos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDemos();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Voice Agent Demos List</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>AI Representative</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Demo URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demos.map((demo) => {
              const demoUrl = `https://voice-agent-demos.myaicalls.info/demo/${demo.id}`;
              return (
                <TableRow key={demo.id}>
                  <TableCell className="font-medium">{demo.company_name}</TableCell>
                  <TableCell>{demo.ai_representative_name}</TableCell>
                  <TableCell>{demo.industry}</TableCell>
                  <TableCell>{format(new Date(demo.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <a 
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Demo
                    </a>
                    <CopyButton text={demoUrl} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
