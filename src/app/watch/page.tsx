import { Suspense } from "react";
import WatchClient from "./WatchClient";
import { getVideoDetails } from "./actions";
import { headers } from "next/headers";

export default async function SubscriberPortal({
    searchParams,
}: {
    searchParams: Promise<{ v?: string }>;
}) {
    const params = await searchParams;
    const token = params.v || "";

    // Construct a server-side meta for initial server fetch
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || "";
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || "127.0.0.1";

    const serverMeta = {
        msisdn: "251912345678", // placeholder or from session
        ip,
        userAgent,
        device: { type: 'server' },
        screen: { width: 0, height: 0, pixelRatio: 1 },
        location: { lat: 0, lon: 0, country: "ET" }
    };

    const serverMetaBase64 = Buffer.from(JSON.stringify(serverMeta)).toString('base64');

    let initialData = null;
    if (token) {
        try {
            initialData = await getVideoDetails(token, serverMetaBase64);
        } catch (e) {
            console.error("Server-side video fetch failed:", e);
        }
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Initializing...</p>
                </div>
            </div>
        }>
            <WatchClient token={token} initialData={initialData} />
        </Suspense>
    );
}
