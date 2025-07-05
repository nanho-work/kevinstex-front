'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={name}
          name={name}
          ref={ref}
          className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';