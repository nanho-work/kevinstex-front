/* components/ui/Button.tsx */
'use client'

import React from 'react'

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'primary'
}

export default function Button({ children, variant = 'default', className = '', ...props }: ButtonProps) {
  let baseStyle = 'px-4 py-2 text-lg rounded-lg font-semibold transition'

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-700 hover:bg-blue-200',
    primary: 'border border-blue-600 text-blue-600 hover:bg-blue-100'
  }

  return (
    <a {...props} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </a>
  )
}