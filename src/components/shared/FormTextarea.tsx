// components/FormTextarea.tsx
import React from 'react';

type FormTextareaProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

const FormTextarea = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  required = false,
  disabled = false,
}: FormTextareaProps) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      disabled={disabled}
      className={`border border-borderBg rounded-none focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button px-4 py-3 w-full text-foreground ${className}`}
    />
  );
};

export default FormTextarea;
