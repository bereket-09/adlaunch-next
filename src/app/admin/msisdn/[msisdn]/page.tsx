"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
    params: Promise<{ msisdn: string }>;
}

export default function AdminMsisdnDetailRedirect({ params }: PageProps) {
    const { msisdn } = use(params);
    const router = useRouter();

    useEffect(() => {
        router.replace(`/admin/lookup/${msisdn}`);
    }, [router, msisdn]);

    return null;
}
