import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://adplus-backend.onrender.com/api/v1';

// const BACKEND_URL = 'http://localhost:3001/api/v1';

// Bypass SSL certificate issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

async function handleRequest(request: NextRequest, pathSegments: string[]) {
    const path = pathSegments.join('/');
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/${path}${queryString ? `?${queryString}` : ''}`;

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (!['host', 'origin', 'referer', 'accept-encoding', 'content-length', 'connection'].includes(lowerKey)) {
            headers[lowerKey] = value;
        }
    });

    // Force Authorization header extraction
    const authHeaderValue = request.headers.get('authorization') || request.headers.get('Authorization');
    if (authHeaderValue) {
        headers['authorization'] = authHeaderValue;
        console.log(`[Proxy] Forwarding token: ${authHeaderValue.substring(0, 15)}...`);
    } else {
        const allKeys = Array.from(request.headers.keys());
        console.warn(`[Proxy] No Auth found for ${path}. Keys: ${allKeys.join(', ')}`);
        // Check if it's hideously named
        const secretToken = request.headers.get('x-auth-token') || request.headers.get('token');
        if (secretToken) {
            headers['authorization'] = `Bearer ${secretToken}`;
            console.log(`[Proxy] Recovered token from x-auth-token/token`);
        }
    }

    const body = request.method !== 'GET' ? await request.arrayBuffer() : undefined;

    try {
        const response = await fetch(url, {
            method: request.method,
            headers,
            body,
            cache: 'no-store',
            redirect: 'manual', // Don't follow redirects, let the client do it
        });

        // If it's a redirect, just pass it through
        if (response.status >= 300 && response.status < 400) {
            const redirectUrl = response.headers.get('location');
            if (redirectUrl) {
                return NextResponse.redirect(redirectUrl, {
                    status: response.status as 301 | 302 | 303 | 307 | 308,
                });
            }
        }

        const responseData = await response.arrayBuffer();

        // Create new headers for the response
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
                responseHeaders.set(key, value);
            }
        });

        return new NextResponse(responseData, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
