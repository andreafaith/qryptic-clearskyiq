export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json(
      { 
        status: 'unhealthy',
        message: 'Failed to connect to Harmony API',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, 
      { status: 503 }
    );
  }
}
