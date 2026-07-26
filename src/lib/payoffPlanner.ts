import type { PaymentScheduleRow, PayoffSimulationResult } from './types'

const EPSILON = 1e-6

export interface PayoffPlannerOptions {
  /** Extra rate (percentage points) added to the base rate once a renewal is missed. Defaults to 2, per CBSL/bank penal-interest practice. */
  penalRatePercent?: number
  /** How often (in months) the advance must be renewed by settling accrued interest. Defaults to 12. */
  renewalIntervalMonths?: number
}

/**
 * Simulates a Sri Lankan bank pawning advance month by month using the
 * reducing-balance method banks actually use: interest accrues on the
 * outstanding balance only, each payment is applied interest-first (with
 * any remainder reducing principal), and unpaid interest is never
 * capitalized into the principal — it simply carries forward as arrears.
 *
 * At each renewal checkpoint (every `renewalIntervalMonths`), if interest
 * arrears haven't been cleared, the advance is treated as having missed its
 * renewal and a penal rate applies from that point until the arrears are
 * cleared (simplified: penal state lifts as soon as arrears reach zero,
 * rather than waiting for the next renewal checkpoint).
 *
 * The simulation horizon is exactly `payments.length` months — a payment of
 * 0 represents a skipped month. This keeps the function total (no
 * unbounded loop) even for a schedule that never pays off the balance.
 */
export function simulatePayoffSchedule(
  principal: number,
  annualInterestRatePercent: number,
  payments: number[],
  options: PayoffPlannerOptions = {},
): PayoffSimulationResult {
  if (principal < 0) throw new RangeError('principal must be non-negative')
  if (annualInterestRatePercent < 0) {
    throw new RangeError('annualInterestRatePercent must be non-negative')
  }
  if (payments.some((p) => p < 0)) {
    throw new RangeError('payments must be non-negative')
  }

  const penalRatePercent = options.penalRatePercent ?? 2
  const renewalIntervalMonths = options.renewalIntervalMonths ?? 12

  const rows: PaymentScheduleRow[] = []
  let openingBalance = principal
  let interestArrears = 0
  let inPenalState = false
  let monthsToPayoff: number | null = null
  let totalInterestPaid = 0
  let totalPaid = 0
  let anyRenewalMissed = false

  for (let i = 0; i < payments.length; i++) {
    const month = i + 1
    const effectiveAnnualRatePercent = inPenalState
      ? annualInterestRatePercent + penalRatePercent
      : annualInterestRatePercent

    const interestAccrued = (openingBalance * (effectiveAnnualRatePercent / 100)) / 12
    const totalInterestDue = interestArrears + interestAccrued

    const payment = payments[i]
    const interestPaid = Math.min(payment, totalInterestDue)
    const remainingPayment = payment - interestPaid
    const principalPaid = Math.min(remainingPayment, openingBalance)
    const unpaidInterest = Math.max(totalInterestDue - interestPaid, 0)
    const closingBalance = Math.max(openingBalance - principalPaid, 0)

    const renewalDue = month % renewalIntervalMonths === 0
    let renewalMissed = false

    if (renewalDue && closingBalance > EPSILON && unpaidInterest > EPSILON) {
      // Interest wasn't settled by the renewal checkpoint: penal rate kicks
      // in and stays in effect until the arrears are cleared.
      renewalMissed = true
      inPenalState = true
      anyRenewalMissed = true
    } else if (unpaidInterest <= EPSILON) {
      // Arrears cleared (whether at this checkpoint or mid-cycle): exit
      // penal state.
      inPenalState = false
    }

    rows.push({
      month,
      openingBalance,
      effectiveAnnualRatePercent,
      interestAccrued,
      payment,
      interestPaid,
      principalPaid,
      unpaidInterest,
      closingBalance,
      renewalDue,
      renewalMissed,
    })

    totalInterestPaid += interestPaid
    totalPaid += payment
    interestArrears = unpaidInterest
    openingBalance = closingBalance

    if (monthsToPayoff === null && closingBalance <= EPSILON && interestArrears <= EPSILON) {
      monthsToPayoff = month
    }
  }

  const fullyPaidOff = monthsToPayoff !== null

  return {
    rows,
    monthsToPayoff,
    totalInterestPaid,
    totalPaid,
    fullyPaidOff,
    anyRenewalMissed,
  }
}

/**
 * Solves for the level monthly payment that fully clears `principal` (plus
 * accruing reducing-balance interest) within `targetTermMonths`, using the
 * standard amortizing-loan annuity formula. Real pawning repayments are
 * irregular, so this is a reference figure — feed the result into
 * `simulatePayoffSchedule` as a flat payment array to see the matching
 * schedule.
 */
export function computeRequiredMonthlyPayment(
  principal: number,
  annualInterestRatePercent: number,
  targetTermMonths: number,
): number {
  if (principal < 0) throw new RangeError('principal must be non-negative')
  if (annualInterestRatePercent < 0) {
    throw new RangeError('annualInterestRatePercent must be non-negative')
  }
  if (targetTermMonths <= 0 || !Number.isInteger(targetTermMonths)) {
    throw new RangeError('targetTermMonths must be a positive integer')
  }

  if (principal === 0) return 0

  const monthlyRate = annualInterestRatePercent / 100 / 12
  if (monthlyRate === 0) return principal / targetTermMonths

  return (
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -targetTermMonths))
  )
}

export function buildFlatPaymentSchedule(payment: number, months: number): number[] {
  if (months < 0 || !Number.isInteger(months)) {
    throw new RangeError('months must be a non-negative integer')
  }
  return Array.from({ length: months }, () => payment)
}
