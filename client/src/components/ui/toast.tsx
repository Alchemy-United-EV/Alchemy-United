import * as React from "react"

export interface ToastProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive"
}

export interface ToastActionElement {
  altText?: string
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Toast({ 
  open = true, 
  onOpenChange, 
  variant = "default", 
  children,
  ...props 
}: ToastProps & { children?: React.ReactNode }) {
  if (!open) return null
  
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-bottom-2 ${
        variant === 'destructive' 
          ? 'bg-red-600 text-white' 
          : 'bg-white border border-gray-200 text-gray-900'
      }`}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {children}
        </div>
        {onOpenChange && (
          <button
            onClick={() => onOpenChange(false)}
            className="ml-2 text-sm opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export function ToastTitle({ children, ...props }: { children: React.ReactNode }) {
  return <div className="font-medium" {...props}>{children}</div>
}

export function ToastDescription({ children, ...props }: { children: React.ReactNode }) {
  return <div className="text-sm opacity-90 mt-1" {...props}>{children}</div>
}

export function ToastAction({ children, ...props }: { children: React.ReactNode }) {
  return <div {...props}>{children}</div>
}

export function Toaster() {
  return null // The existing hook handles rendering
}