import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
}

export function Button({ variant = 'default', className, ...props }: ButtonProps) {
  const base =
    'px-4 py-2 rounded text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:
      'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
  }

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...props}
    />
  )
}