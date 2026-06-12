import { useMemo, useRef, useState } from 'react'
import { calculateSalary } from '../lib/salary/calculateSalary.ts'
import { mapFormDataToSalaryCalculationInput } from '../lib/salary/mapFormDataToSalaryCalculationInput.ts'
import { SalaryCalculationError } from '../lib/errors/SalaryCalculationError.ts'
import {
  DEFAULT_SALARY_FORM_DATA,
  type SalaryFormData,
} from '../types/salary.ts'
import type { SalaryCalculationResult } from '../types/SalaryCalculationResult.ts'

export function useSalaryCalculator(
  initialSalaryFormData: SalaryFormData = DEFAULT_SALARY_FORM_DATA,
) {
  const [formData, setFormData] = useState<SalaryFormData>(initialSalaryFormData)
  const lastAutoIrpfRateRef = useRef(0)

  const updateFormData = (partialFormData: Partial<SalaryFormData>) => {
    setFormData((previousFormData) => {
      const nextFormData = {
        ...previousFormData,
        ...partialFormData,
      }

      if (
        partialFormData.irpfMode === 'manual' &&
        previousFormData.irpfMode === 'auto'
      ) {
        nextFormData.manualIrpfRate = lastAutoIrpfRateRef.current
      }

      return nextFormData
    })
  }

  const calculationState = useMemo((): {
    salaryCalculationResult: SalaryCalculationResult | null
    salaryCalculationError: SalaryCalculationError | null
  } => {
    try {
      const salaryCalculationInput = mapFormDataToSalaryCalculationInput(formData)
      const salaryCalculationResult = calculateSalary(salaryCalculationInput)

      if (formData.irpfMode === 'auto') {
        lastAutoIrpfRateRef.current = salaryCalculationResult.effectiveIrpfRate
      }

      return { salaryCalculationResult, salaryCalculationError: null }
    } catch (error) {
      if (error instanceof SalaryCalculationError) {
        return { salaryCalculationResult: null, salaryCalculationError: error }
      }

      throw error
    }
  }, [formData])

  return {
    formData,
    updateFormData,
    ...calculationState,
  }
}
