"use server";

const BACKEND_URL = 'https://adplus-backend.onrender.com/api/v1';

// Bypass SSL certificate issues in development for server-side fetches
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function getVideoDetails(token: string, metaBase64: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/video/${token}`, {
            headers: {
                "Content-Type": "application/json",
                meta_base64: metaBase64,
            },
            cache: 'no-store'
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("getVideoDetails error:", error);
        return { status: false, error: "Failed to fetch video details" };
    }
}

export async function startTracking(token: string, meta: string, secureKey: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/track/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secure_key: secureKey,
                meta: meta,
                token: token,
            }),
            cache: 'no-store'
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("startTracking error:", error);
        return { status: false, error: "Failed to start tracking" };
    }
}

export async function completeTracking(token: string, meta: string, secureKey: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/track/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secure_key: secureKey,
                meta: meta,
                token: token,
            }),
            cache: 'no-store'
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("completeTracking error:", error);
        return { status: false, error: "Failed to complete tracking" };
    }
}
