import { apiEndpoints, defaultHeaders } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(apiEndpoints.visualizeAll, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('All visualizations request failed:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to connect to Harmony API',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
