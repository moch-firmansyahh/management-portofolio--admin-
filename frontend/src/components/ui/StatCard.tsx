import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle: string;
}

export default function StatCard({ title, value, icon, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition-all duration-150 hover:border-zinc-300">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-zinc-500 tracking-tight">{title}</span>
        <div className="h-8 w-8 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-700 border border-zinc-200/60">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
        <p className="text-[11px] text-zinc-500 font-normal mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
