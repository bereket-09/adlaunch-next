"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMsisdnRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/lookup");
    }, [router]);

    return null;
}
