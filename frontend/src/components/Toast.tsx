import React from "react";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ToastProps {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | "info";
}

export default function Toast({ isOpen, message, type }: ToastProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-white border border-gray-200 px-5 py-3.5 rounded-2xl shadow-xl animate-fade-in-up">
      {type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
      {type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
      {type === "info" && <RefreshCw className="h-5 w-5 text-[#4f46e5] animate-spin" />}
      <span className="text-sm font-semibold text-gray-800">{message}</span>
    </div>
  );
}
