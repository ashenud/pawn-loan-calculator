import { describe, expect, it } from 'vitest'
import {
  buildFlatPaymentSchedule,
  computeRequiredMonthlyPayment,
  simulatePayoffSchedule,
} from '../payoffPlanner'

describe('computeRequiredMonthlyPayment', () => {
  it('matches the standard annuity formula for a non-zero rate', () => {
    const principal = 100000
    const rate = 12
    const months = 12
    const payment = computeRequiredMonthlyPayment(principal, rate, months)

    const r = rate / 100 / 12
    const expected = (principal * r) / (1 - Math.pow(1 + r, -months))
    expect(payment).toBeCloseTo(expected)
  })

  it('divides evenly for a zero interest rate', () => {
    expect(computeRequiredMonthlyPayment(12000, 0, 12)).toBeCloseTo(1000)
  })

  it('returns 0 for a zero principal', () => {
    expect(computeRequiredMonthlyPayment(0, 12, 12)).toBe(0)
  })

  it('rejects a non-positive term', () => {
    expect(() => computeRequiredMonthlyPayment(1000, 10, 0)).toThrow(RangeError)
    expect(() => computeRequiredMonthlyPayment(1000, 10, -3)).toThrow(RangeError)
  })
})

describe('simulatePayoffSchedule', () => {
  it('pays off exactly on schedule when using the required flat payment', () => {
    const principal = 100000
    const rate = 12
    const months = 12
    const payment = computeRequiredMonthlyPayment(principal, rate, months)
    const schedule = buildFlatPaymentSchedule(payment, months)

    const result = simulatePayoffSchedule(principal, rate, schedule)

    expect(result.fullyPaidOff).toBe(true)
    expect(result.monthsToPayoff).toBe(months)
    expect(result.rows[months - 1].closingBalance).toBeCloseTo(0, 6)
    expect(result.anyRenewalMissed).toBe(false)
  })

  it('leaves the balance untouched on a skipped ($0) month and only accrues interest', () => {
    const principal = 100000
    const rate = 12
    const result = simulatePayoffSchedule(principal, rate, [0, 0, 0])

    for (const row of result.rows) {
      expect(row.principalPaid).toBe(0)
      expect(row.closingBalance).toBe(row.openingBalance)
    }
    // Interest accrues each month on the same untouched balance (~1000/month at 12% p.a.)
    expect(result.rows[0].interestAccrued).toBeCloseTo(1000)
    expect(result.rows[2].unpaidInterest).toBeCloseTo(3000)
    expect(result.fullyPaidOff).toBe(false)
    expect(result.monthsToPayoff).toBeNull()
  })

  it('does not compound unpaid interest into the principal', () => {
    const result = simulatePayoffSchedule(100000, 12, [0, 0])
    // Balance stays exactly at principal — unpaid interest is tracked as
    // arrears, never added to the balance that itself earns interest.
    expect(result.rows[0].closingBalance).toBe(100000)
    expect(result.rows[1].closingBalance).toBe(100000)
    expect(result.rows[1].openingBalance).toBe(100000)
  })

  it('flags a missed renewal at month 12 when interest arrears are unpaid, and applies the penal rate', () => {
    const principal = 100000
    const rate = 12
    const payments = buildFlatPaymentSchedule(0, 13)
    const result = simulatePayoffSchedule(principal, rate, payments, {
      penalRatePercent: 2,
      renewalIntervalMonths: 12,
    })

    expect(result.rows[11].renewalDue).toBe(true)
    expect(result.rows[11].renewalMissed).toBe(true)
    expect(result.anyRenewalMissed).toBe(true)
    // From month 13 onward, the effective rate includes the 2% penalty.
    expect(result.rows[12].effectiveAnnualRatePercent).toBeCloseTo(rate + 2)
  })

  it('does not flag a missed renewal when arrears are cleared by the checkpoint', () => {
    const principal = 100000
    const rate = 12
    // Pay exactly the monthly interest (~1000) every month for 12 months.
    const payments = buildFlatPaymentSchedule(1000, 12)
    const result = simulatePayoffSchedule(principal, rate, payments)

    expect(result.rows[11].renewalDue).toBe(true)
    expect(result.rows[11].renewalMissed).toBe(false)
    expect(result.anyRenewalMissed).toBe(false)
    // Interest-only payments never reduce the principal.
    expect(result.rows[11].closingBalance).toBeCloseTo(100000)
  })

  it('never reaches payoff with an all-zero payment schedule, and stays bounded by the schedule length', () => {
    const result = simulatePayoffSchedule(50000, 15, buildFlatPaymentSchedule(0, 24))

    expect(result.fullyPaidOff).toBe(false)
    expect(result.monthsToPayoff).toBeNull()
    expect(result.rows).toHaveLength(24)
    expect(result.totalPaid).toBe(0)
  })

  it('rejects negative inputs', () => {
    expect(() => simulatePayoffSchedule(-1, 10, [100])).toThrow(RangeError)
    expect(() => simulatePayoffSchedule(1000, -1, [100])).toThrow(RangeError)
    expect(() => simulatePayoffSchedule(1000, 10, [-100])).toThrow(RangeError)
  })
})
