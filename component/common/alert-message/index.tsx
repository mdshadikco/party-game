// components/CustomAlert.tsx
"use client";
import { XCircle } from "lucide-react";
import { useEffect } from "react";

interface CustomAlertProps {
  message: string;
  onClose: () => void;
  gradientColor: string;
}

export default function CustomAlert({ message, onClose, gradientColor }: CustomAlertProps) {
    console.log({gradientColor})
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto-close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`flex items-center gap-3 px-6 py-4 text-white rounded-xl shadow-lg animate-slide-in ${gradientColor}`}>
        <XCircle className="w-5 h-5 text-white" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
