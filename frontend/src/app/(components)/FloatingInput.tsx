'use client';

type Props = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  error?: boolean;
  tabIndex?: number;
  disabled?: boolean;
};

export default function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  className = '',
  error = false,
  tabIndex = 0,
  disabled = false,
}: Props) {
  return (
    <div className={className === '' ? "relative w-full max-w-2xl mx-auto mb-6" : className}>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={tabIndex}
        disabled={disabled}
        className={`${disabled ? 'cursor-not-allowed bg-gray-100  ' : ''} peer block w-full appearance-none border ${!error ? "border-gray-300" : "border-red-800"} rounded px-4 pt-6 pb-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 select-none pointer-events-none
      ${value
            ? 'top-2 text-sm text-blue-600'
            : 'top-3 text-base text-gray-400'
          }
      peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
    `}
      >
        {label}
      </label>
    </div>

  );
}
