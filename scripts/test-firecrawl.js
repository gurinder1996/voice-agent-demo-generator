const FirecrawlApp = require('@mendable/firecrawl-js').default;

async function testFirecrawl() {
  const apiKey = 'fc-d2e0e4bb47d747bea3fa397c8ba6a0cd';
  // Removed API key logging

  try {
    const app = new FirecrawlApp({ apiKey });
    console.log('Successfully initialized Firecrawl\n');

    // Test with hightekcorp website
    const testUrl = 'https://www.hightekcorp.com/';
    console.log('\nStarting crawl for URL:', testUrl);

    // Step 1: Start the crawl
    const crawlResponse = await app.crawlUrl(testUrl, {
      limit: 100, // Crawl up to 100 pages
      scrapeOptions: {
        formats: ['markdown'],
      }
    });

    console.log('\nInitial crawl response:', crawlResponse);

    // Handle both immediate completion and async crawling
    let result = crawlResponse;
    if (!crawlResponse.status || crawlResponse.status !== 'completed') {
      if (!crawlResponse.success || !crawlResponse.id) {
        throw new Error('Failed to start crawl: ' + JSON.stringify(crawlResponse));
      }

      console.log('\nCrawl started with ID:', crawlResponse.id);

      // Step 2: Poll for results
      let completed = false;
      let attempts = 0;
      const maxAttempts = 30; // More attempts for crawling

      while (!completed && attempts < maxAttempts) {
        console.log(`\nChecking crawl status (attempt ${attempts + 1}/${maxAttempts})...`);
        
        try {
          result = await app.checkCrawlStatus(crawlResponse.id);
          console.log('Status:', result.status);
          console.log('Progress:', result.completed, '/', result.total, 'pages');
          
          if (result.status === 'completed') {
            completed = true;
            console.log('\nCrawl completed successfully!');
            break;
          }
          
          // Wait longer between checks for crawling
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
      console.log('\nCrawl completed immediately!');
    }

    // Format the response for better readability
    const formattedData = result.data.map(page => ({
      url: page.metadata?.url || '',
      content: page.markdown.substring(0, 200) + '...', // Show first 200 chars
      metadata: page.metadata
    }));

    console.log('\nProcessed content:', JSON.stringify(formattedData, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

testFirecrawl();
