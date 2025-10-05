import { apiEndpoints, defaultHeaders } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(apiEndpoints.visualizeParallel, {
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
    console.error('Parallel visualization request failed:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to start parallel visualization',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
