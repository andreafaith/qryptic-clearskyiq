import { apiEndpoints, defaultHeaders } from '@/lib/config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    
    const response = await fetch(apiEndpoints.visualizeStatus(jobId), {
      method: 'GET',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Job status request failed:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to get job status',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
