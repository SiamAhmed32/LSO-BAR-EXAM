import React from 'react';

type FormInputProps = {
  id?: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const FormInput = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
}: FormInputProps) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`border border-borderBg rounded-none focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor px-4 py-3 w-full text-foreground hover:border-primaryColor transition-colors ${className}`}
    />
  );
};

export default FormInput;