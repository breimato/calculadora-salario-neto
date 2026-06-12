import { type InputHTMLAttributes, useId } from 'react'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export function Toggle({ label, description, id, checked, onChange, ...props }: ToggleProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = description ? `${inputId}-description` : undefined

  return (
    <label className="toggle" htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        className="toggle__input"
        checked={checked}
        onChange={onChange}
        aria-describedby={descriptionId}
        {...props}
      />
      <span className="toggle__track" aria-hidden="true" />
      <span>
        <span className="toggle__label">{label}</span>
        {description && (
          <span id={descriptionId} className="form-hint" style={{ display: 'block' }}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
