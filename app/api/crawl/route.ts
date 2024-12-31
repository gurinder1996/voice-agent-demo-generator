import { NextResponse } from "next/server";
import FirecrawlApp from '@mendable/firecrawl-js';
import { supabase } from '@/lib/supabase';

interface CrawlStatusResponse {
  success: boolean;
  id: string;
  status?: string;
  data: Array<{
    markdown: string;
    metadata?: {
      url?: string;
    };
  }>;
  completed?: number;
  total?: number;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type FireCrawlResponse = CrawlStatusResponse | ErrorResponse;

function isCrawlStatusResponse(response: any): response is CrawlStatusResponse {
  return 'data' in response && Array.isArray(response.data);
}

export async function POST(req: Request) {
  try {
    const { url, id } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!process.env.FIRECRAWL_API_KEY) {
      return NextResponse.json(
        { error: "FIRECRAWL_API_KEY not found in environment variables" },
        { status: 500 }
      );
    }

    console.log('FIRECRAWL_API_KEY length:', process.env.FIRECRAWL_API_KEY.length);
    console.log('FIRECRAWL_API_KEY first 5 chars:', process.env.FIRECRAWL_API_KEY.substring(0, 5));

    const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
    console.log('Starting crawl for URL:', url);

    // Step 1: Start the crawl
    const crawlResponse = await app.crawlUrl(url, {
      limit: 100,
      scrapeOptions: {
        formats: ['markdown'],
      }
    });

    console.log('Initial crawl response:', crawlResponse);

    // Handle both immediate completion and async crawling
    let result: CrawlStatusResponse;

    if (!isCrawlStatusResponse(crawlResponse)) {
      throw new Error('Failed to start crawl: ' + JSON.stringify(crawlResponse));
    }

    result = crawlResponse;
    
    if (!result.status || result.status !== 'completed') {
      if (!result.success || !result.id) {
        throw new Error('Failed to start crawl: ' + JSON.stringify(result));
      }

      console.log('Crawl started with ID:', result.id);

      // Step 2: Poll for results
      let completed = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!completed && attempts < maxAttempts) {
        console.log(`Checking crawl status (attempt ${attempts + 1}/${maxAttempts})...`);
        
        try {
          const statusResponse = await app.checkCrawlStatus(result.id);
          
          if (!isCrawlStatusResponse(statusResponse)) {
            throw new Error('Invalid status response: ' + JSON.stringify(statusResponse));
          }

          result = statusResponse;
          console.log('Status:', result.status);
          console.log('Progress:', result.completed, '/', result.total, 'pages');
          
          if (result.status === 'completed') {
            completed = true;
            console.log('Crawl completed successfully!');
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 3000));
          attempts++;
        } catch (error) {
          console.error('Error checking status:', error);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      if (!completed) {
        throw new Error('Crawl did not complete after ' + maxAttempts + ' attempts');
      }
    } else {
      console.log('Crawl completed immediately!');
    }

    // Combine all markdown content into a single string
    const combinedContent = result.data
      .map(page => page.markdown)
      .filter(content => content && content.trim().length > 0)
      .join('\n\n');

    // Update the voice_agent_configs table with the website content
    if (id) {
      const { error: updateError } = await supabase
        .from('voice_agent_configs')
        .update({ 
          website_content: combinedContent,
          website_url: url
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating database:', updateError);
        throw new Error('Failed to update database: ' + updateError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Website crawled successfully",
      content: combinedContent
    });

  } catch (error) {
    console.error('Error during crawl:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}
