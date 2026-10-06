"use client";

import React, { useEffect, useState } from "react";
import { ActivityCalendar, Activity } from "react-activity-calendar";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

interface Props {
  username: string;
}

export default function GitHubContributionCalendar({ username }: Props) {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContributions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Gagal mengambil data aktivitas");
      }
    } catch (err: any) {
      console.warn("GitHub calendar error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        <span className="text-xs font-medium">Mengambil grafik kontribusi GitHub...</span>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-zinc-500 text-center">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-xs">
          Grafik kontribusi GitHub untuk <span className="font-semibold text-zinc-700">@{username}</span> belum dapat dimuat saat ini.
        </p>
        <button
          onClick={fetchContributions}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center overflow-x-auto py-2">
      <ActivityCalendar
        data={data}
        theme={{
          light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }}
        colorScheme="light"
        blockSize={12}
        blockMargin={4}
        fontSize={12}
        labels={{
          totalCount: "{{count}} aktivitas kontribusi setahun terakhir",
        }}
      />
    </div>
  );
}
