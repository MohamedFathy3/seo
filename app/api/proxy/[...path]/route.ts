/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const baseUrl =
  process.env.TARGET_API || 'https://web-lec.com/api';

/* =========================
   🔥 CORE FETCH PROXY
========================= */
async function proxyRequest(
  method: string,
  endpoint: string,
  body?: Record<string, any>,
  cookies?: string
) {
  const url = `${baseUrl}/${endpoint}`;

  const headers: HeadersInit = {
    Accept: '*/*',
  };

  // 🔐 Extract token from cookies
  if (cookies) {
    const decodedCookies = decodeURIComponent(cookies);
    const tokenMatch = decodedCookies.match(/token=([^;]+)/);

    if (tokenMatch) {
      headers['Authorization'] = `Bearer ${tokenMatch[1]}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
    cache: 'no-store',
  };

  // send JSON body only when needed
  if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  console.log(`[Proxy] ${method} ${url}`);

  const response = await fetch(url, options);

  return response;
}

/* =========================
   🔥 HELPERS
========================= */
function getEndpointFromUrl(urlString: string): string {
  const url = new URL(urlString);

  const pathname = url.pathname.replace(/^\/api\/proxy\//, '');
  const search = url.searchParams.toString();

  return search ? `${pathname}?${search}` : pathname;
}

/* =========================
   🔥 GET
========================= */
export async function GET(request: NextRequest) {
  try {
    const endpoint = getEndpointFromUrl(request.url);
    const cookies = request.headers.get('cookie') || '';

    const response = await proxyRequest('GET', endpoint, undefined, cookies);

    const contentType = response.headers.get('content-type') || '';

    // 📄 FILE (PDF, image, etc.)
    if (!contentType.includes('application/json')) {
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition':
            response.headers.get('content-disposition') || '',
        },
      });
    }

    // 📦 JSON
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('[Proxy GET Error]', error);

    return NextResponse.json(
      { message: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

/* =========================
   🔥 POST
========================= */
export async function POST(request: NextRequest) {
  try {
    const endpoint = getEndpointFromUrl(request.url);
    const body = await request.json().catch(() => ({}));
    const cookies = request.headers.get('cookie') || '';

    const response = await proxyRequest('POST', endpoint, body, cookies);

    const contentType = response.headers.get('content-type') || '';

    // 📄 FILE
    if (!contentType.includes('application/json')) {
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      });
    }

    // 📦 JSON
    const data = await response.json();

    const res = NextResponse.json(data, {
      status: response.status,
    });

    // 🔐 Save token if login
    if (endpoint.startsWith('login') && data?.token) {
      res.cookies.set('token', data.token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return res;
  } catch (error) {
    console.error('[Proxy POST Error]', error);

    return NextResponse.json(
      { message: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

/* =========================
   🔥 PUT
========================= */
export async function PUT(request: NextRequest) {
  try {
    const endpoint = getEndpointFromUrl(request.url);
    const body = await request.json().catch(() => ({}));
    const cookies = request.headers.get('cookie') || '';

    const response = await proxyRequest('PUT', endpoint, body, cookies);

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      });
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

/* =========================
   🔥 PATCH
========================= */
export async function PATCH(request: NextRequest) {
  try {
    const endpoint = getEndpointFromUrl(request.url);
    const body = await request.json().catch(() => ({}));
    const cookies = request.headers.get('cookie') || '';

    const response = await proxyRequest('PATCH', endpoint, body, cookies);

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

/* =========================
   🔥 DELETE
========================= */
export async function DELETE(request: NextRequest) {
  try {
    const endpoint = getEndpointFromUrl(request.url);
    const cookies = request.headers.get('cookie') || '';

    let body;
    try {
      body = await request.json();
    } catch {
      body = undefined;
    }

    const response = await proxyRequest('DELETE', endpoint, body, cookies);

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

/* =========================
   🔥 OPTIONS (CORS)
========================= */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':
        'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}