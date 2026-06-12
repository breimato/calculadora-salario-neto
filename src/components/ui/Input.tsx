import { type InputHTMLAttributes, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={inputId}>
        {label}
      </label>
      {hint && (
        <span id={hintId} className="form-hint">
          {hint}
        </span>
      )}
      <input
        id={inputId}
        className={`form-input ${error ? 'form-input--error' : ''} ${props.readOnly ? 'form-input--readonly' : ''} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {error && (
        <span id={errorId} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
