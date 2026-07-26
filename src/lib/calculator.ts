import type {
  Karat,
  QuickEstimateInput,
  QuickEstimateResult,
  QuickEstimateRow,
} from './types'

/**
 * Derives the loan amount a bank would advance for a given gold weight and
 * karat, using a per-gram advance rate (e.g. from a BankPreset).
 */
export function principalFromGoldWeight(
  weightGrams: number,
  advanceRatePerGram: number,
): number {
  if (weightGrams < 0 || advanceRatePerGram < 0) {
    throw new RangeError('weightGrams and advanceRatePerGram must be non-negative')
  }
  return weightGrams * advanceRatePerGram
}

/**
 * Quick "settle everything in one lump sum at the end" estimate using
 * simple interest on the original principal for the full term. This is the
 * degenerate case of the reducing-balance model (see payoffPlanner.ts) when
 * no partial payments are made until settlement.
 */
export function quickEstimate({
  principal,
  annualInterestRatePercent,
  loanPeriodMonths,
}: QuickEstimateInput): QuickEstimateResult {
  if (principal < 0) throw new RangeError('principal must be non-negative')
  if (annualInterestRatePercent < 0) {
    throw new RangeError('annualInterestRatePercent must be non-negative')
  }
  if (loanPeriodMonths < 0 || !Number.isInteger(loanPeriodMonths)) {
    throw new RangeError('loanPeriodMonths must be a non-negative integer')
  }

  const monthlyInterest = (principal * (annualInterestRatePercent / 100)) / 12

  const schedule: QuickEstimateRow[] = []
  for (let month = 1; month <= loanPeriodMonths; month++) {
    const cumulativeInterest = monthlyInterest * month
    schedule.push({
      month,
      interestAccrued: monthlyInterest,
      cumulativeInterest,
      totalDueIfSettled: principal + cumulativeInterest,
    })
  }

  const totalInterest = monthlyInterest * loanPeriodMonths

  return {
    principal,
    monthlyInterest,
    totalInterest,
    totalRepayable: principal + totalInterest,
    schedule,
  }
}

export type { Karat }
