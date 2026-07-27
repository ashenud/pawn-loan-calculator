export type Karat = '24K' | '22K' | '21K' | '18K'

/**
 * 'reducing' (the Sri Lankan bank standard — see docs/pawning-in-sri-lanka.md):
 * interest each month is charged on the outstanding balance, so it shrinks
 * as principal is paid down. 'flat': interest each month is a constant
 * fraction of the *original* principal, regardless of how much has already
 * been repaid — offered here as a comparison, not because banks use it.
 */
export type InterestMethod = 'reducing' | 'flat'

export interface BankPreset {
  id: string
  bankName: string
  annualInterestRatePercent: number
  advancePerGram: Partial<Record<Karat, number>>
  maxTenureMonths: number
  penalInterestRatePercent: number
  asOf: string
  sourceNote: string
}

export interface QuickEstimateInput {
  principal: number
  annualInterestRatePercent: number
  loanPeriodMonths: number
}

export interface QuickEstimateRow {
  month: number
  interestAccrued: number
  cumulativeInterest: number
  totalDueIfSettled: number
}

export interface QuickEstimateResult {
  principal: number
  monthlyInterest: number
  totalInterest: number
  totalRepayable: number
  schedule: QuickEstimateRow[]
}

export interface PaymentScheduleRow {
  month: number
  openingBalance: number
  effectiveAnnualRatePercent: number
  interestAccrued: number
  payment: number
  interestPaid: number
  principalPaid: number
  unpaidInterest: number
  closingBalance: number
  renewalDue: boolean
  renewalMissed: boolean
}

export interface PayoffSimulationResult {
  rows: PaymentScheduleRow[]
  monthsToPayoff: number | null
  totalInterestPaid: number
  totalPaid: number
  fullyPaidOff: boolean
  anyRenewalMissed: boolean
}
