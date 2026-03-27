"use client";

import { useEffect, useState } from "react";

interface RealTimeIndicatorProps {
  label?: string;
}

export default function RealTimeIndicator({ label = "Live" }: RealTimeIndicatorProps) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200/60">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">{label}</span>
    </div>
  );
}
