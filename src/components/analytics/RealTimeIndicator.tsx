"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface RealTimeIndicatorProps {
  label?: string;
}

const RealTimeIndicator = ({ label = "Live" }: RealTimeIndicatorProps) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
      <span className={`h-2 w-2 rounded-full bg-green-500 ${pulse ? 'animate-pulse' : ''}`} />
      <Activity className="h-3.5 w-3.5 text-green-600" />
      <span className="text-sm font-medium text-green-700">{label}</span>
    </div>
  );
};

export default RealTimeIndicator;
