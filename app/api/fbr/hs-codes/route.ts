import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for FBR HS Code lookup
 * GET /api/fbr/hs-codes
 * 
 * This proxies requests to FBR's item description code API
 * Keeps user tokens secure by making the request server-side
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header (passed from client)
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Call FBR API
    const fbrResponse = await fetch(
      'https://gw.fbr.gov.pk/pdi/v1/itemdesccode',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 seconds
      }
    );

    if (!fbrResponse.ok) {
      const errorText = await fbrResponse.text();
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch HS codes from FBR',
          details: errorText,
          status: fbrResponse.status
        },
        { status: fbrResponse.status }
      );
    }

    const data = await fbrResponse.json();

    // Return the FBR response
    return NextResponse.json(data, { status: 200 });

  } catch (error: unknown) {
    if (error && typeof error === 'object' && ('name' in error) && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
      return NextResponse.json(
        { 
          error: 'Request timeout',
          message: 'FBR API request timed out after 30 seconds'
        },
        { status: 504 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch HS codes';
    const errorType = error && typeof error === 'object' && 'constructor' in error && error.constructor ? error.constructor.name : 'Error';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorMessage,
        type: errorType
      },
      { status: 500 }
    );
  }
}
