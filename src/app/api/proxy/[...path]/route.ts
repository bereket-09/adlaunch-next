import { NextRequest, NextResponse } from 'next/server';

// const BACKEND_URL = 'https://adplus-backend.onrender.com/api/v1';

const BACKEND_URL = 'http://localhost:3001';

// Bypass SSL certificate issues in development
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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

    const headers = new Headers();
    request.headers.forEach((value, key) => {
        // Forward relevant headers, skip host/origin
        // Also skip accept-encoding to avoid compressed responses we might not handle well
        if (!['host', 'origin', 'referer', 'accept-encoding'].includes(key.toLowerCase())) {
            headers.set(key, value);
        }
    });

    const body = request.method !== 'GET' ? await request.arrayBuffer() : undefined;

    try {
        const response = await fetch(url, {
            method: request.method,
            headers,
            body,
        });

        const responseData = await response.arrayBuffer();

        // Create new headers for the response
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            // SKIP content-encoding and content-length as we are sending a fresh buffer
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
