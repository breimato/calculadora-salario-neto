import { type SelectHTMLAttributes, useId } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  hint?: string
  error?: string
  placeholder?: string
}

export function Select({
  label,
  options,
  hint,
  error,
  placeholder,
  id,
  className = '',
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const hintId = hint ? `${selectId}-hint` : undefined
  const errorId = error ? `${selectId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={selectId}>
        {label}
      </label>
      {hint && (
        <span id={hintId} className="form-hint">
          {hint}
        </span>
      )}
      <select
        id={selectId}
        className={`form-select ${error ? 'form-input--error' : ''} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
