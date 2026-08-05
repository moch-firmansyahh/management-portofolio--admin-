import React from "react";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface ToastProps {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | "info";
}

export default function Toast({ isOpen, message, type }: ToastProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 bg-zinc-900 text-white border border-zinc-800 px-4 py-3 rounded-lg shadow-2xl animate-dialog-show">
      {type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
      {type === "error" && <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />}
      {type === "info" && <RefreshCw className="h-4 w-4 text-sky-400 animate-spin shrink-0" />}
      <span className="text-xs font-medium tracking-tight">{message}</span>
    </div>
  );
}
