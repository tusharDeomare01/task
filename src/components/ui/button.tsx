import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500': variant === 'default',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'destructive',
            'border-2 border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-500': variant === 'outline',
            'hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
          },
          {
            'h-11 px-6 py-2 text-base': size === 'default',
            'h-9 px-4 py-1 text-sm': size === 'sm',
            'h-12 px-8 py-3 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
