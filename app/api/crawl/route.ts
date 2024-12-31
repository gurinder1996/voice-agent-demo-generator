import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

export async function POST(req: Request) {
  try {
    // 1. Input validation
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ 
        error: 'URL is required',
        details: 'Please provide a valid URL to crawl'
      }, { status: 400 });
    }

    // 2. API key validation
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not found in environment variables');
      return NextResponse.json({ 
        error: 'Configuration error',
        details: 'Firecrawl API key not configured. Please check your environment variables.'
      }, { status: 500 });
    }

    // 3. Initialize Firecrawl
    let app;
    try {
      app = new FirecrawlApp({ apiKey });
    } catch (error) {
      console.error('Error initializing Firecrawl:', error);
      return NextResponse.json({ 
        error: 'Initialization error',
        details: 'Failed to initialize Firecrawl client'
      }, { status: 500 });
    }

    // 4. Start the crawl
    console.log('Starting crawl for URL:', url);
    const crawlResponse = await app.crawlUrl(url, {
      limit: 10,
      scrapeOptions: {
        formats: ['markdown'],
      }
    });

    // 5. Process the response
    if (!crawlResponse || !crawlResponse.success) {
      console.error('Invalid crawl response:', crawlResponse);
      return NextResponse.json({ 
        error: 'Invalid response',
        details: 'Received invalid response from Firecrawl'
      }, { status: 500 });
    }

    // 6. Extract and format content
    const formattedData = crawlResponse.data
      .filter(page => page.markdown && page.markdown.trim().length > 0)
      .map(page => ({
        url: page.metadata?.url || '',
        content: page.markdown?.trim() ?? '',
        metadata: page.metadata
      }));

    if (formattedData.length === 0) {
      return NextResponse.json({
        error: 'No content',
        details: 'No text content could be extracted from the website'
      }, { status: 404 });
    }

    // 7. Return formatted data
    return NextResponse.json({
      success: true,
      message: 'Successfully crawled website',
      data: formattedData
    });

  } catch (error) {
    console.error('Unhandled error during crawl:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}
