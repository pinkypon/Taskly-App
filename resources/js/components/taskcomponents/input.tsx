import React from 'react';
import Field from './field'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  wrapperClassName?: string;
}

export default function FormInput({
  label,
  name,
  error,
  wrapperClassName = '',
  className = '',
  ...rest
}: FormInputProps) {
  const defaultClass =
    'w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400';

  return (
    // <div className={wrapperClassName}>
    //   <label
    //     htmlFor={name}
    //     className="block text-sm font-medium text-gray-700 mb-1"
    //   >
    //     {label}
    //   </label>
    //   <input
    //     id={name}
    //     name={name}
    //     className={`${defaultClass} ${className}`}
    //     {...rest}
    //   />
    //   {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    // </div>
    <Field label={label} name={name}>
      <input
      id={name}
      name={name}
      className={`${defaultClass} ${className}`}
      {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}  
    </Field>
  );
}
