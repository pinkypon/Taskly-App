import React from 'react';

interface LabelLayoutProps {
  name: string;
  label: string;
  className?: string;
}

export default function LabelLayout({
  name,
  label,
  className = '',
}: LabelLayoutProps) {
  const defaultClasses = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <label
      htmlFor={name}
      className={`${defaultClasses} ${className}`}
    >
      {label}
    </label>
  );
}
