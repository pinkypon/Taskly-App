import React from 'react';
import LabelLayout from './label-form';

interface FieldProps {
  label: string;
  name: string;
  children: React.ReactNode;
}

export default function Field({ label, children, name }: FieldProps) {
  return (
    <div>
      <LabelLayout name={name} label={label} />
      {children}
    </div>
  );
}
