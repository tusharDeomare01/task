'use client';

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const showToast = React.useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-top-5",
              {
                'bg-green-50 border border-green-200': toast.type === 'success',
                'bg-red-50 border border-red-200': toast.type === 'error',
                'bg-blue-50 border border-blue-200': toast.type === 'info',
              }
            )}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            
            <p className={cn(
              "flex-1 text-sm font-medium",
              {
                'text-green-900': toast.type === 'success',
                'text-red-900': toast.type === 'error',
                'text-blue-900': toast.type === 'info',
              }
            )}>
              {toast.message}
            </p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
