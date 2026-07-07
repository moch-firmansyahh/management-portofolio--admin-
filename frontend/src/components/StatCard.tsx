import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle: string;
}

export default function StatCard({ title, value, icon, subtitle }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center text-gray-500">
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <p className="text-3xl font-black mt-4 text-gray-950">{value}</p>
      <span className="text-[10px] text-gray-400 font-medium block mt-1">{subtitle}</span>
    </div>
  );
}
