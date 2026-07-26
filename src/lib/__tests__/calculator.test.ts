import { describe, expect, it } from 'vitest'
import { principalFromGoldWeight, quickEstimate } from '../calculator'

describe('principalFromGoldWeight', () => {
  it('multiplies weight by the per-gram advance rate', () => {
    expect(principalFromGoldWeight(8, 33375)).toBe(267000)
  })

  it('returns 0 for 0 grams', () => {
    expect(principalFromGoldWeight(0, 33375)).toBe(0)
  })

  it('throws for negative inputs', () => {
    expect(() => principalFromGoldWeight(-1, 100)).toThrow(RangeError)
    expect(() => principalFromGoldWeight(1, -100)).toThrow(RangeError)
  })
})

describe('quickEstimate', () => {
  it('computes simple interest over whole-month periods', () => {
    const result = quickEstimate({
      principal: 100000,
      annualInterestRatePercent: 12,
      loanPeriodMonths: 6,
    })

    // 12% p.a. => 1% per month => 1000/month on 100000
    expect(result.monthlyInterest).toBeCloseTo(1000)
    expect(result.totalInterest).toBeCloseTo(6000)
    expect(result.totalRepayable).toBeCloseTo(106000)
    expect(result.schedule).toHaveLength(6)
    expect(result.schedule[0].cumulativeInterest).toBeCloseTo(1000)
    expect(result.schedule[5].cumulativeInterest).toBeCloseTo(6000)
    expect(result.schedule[5].totalDueIfSettled).toBeCloseTo(106000)
  })

  it('handles a zero-month period with no interest', () => {
    const result = quickEstimate({
      principal: 50000,
      annualInterestRatePercent: 15,
      loanPeriodMonths: 0,
    })

    expect(result.totalInterest).toBe(0)
    expect(result.totalRepayable).toBe(50000)
    expect(result.schedule).toHaveLength(0)
  })

  it('handles a zero interest rate', () => {
    const result = quickEstimate({
      principal: 50000,
      annualInterestRatePercent: 0,
      loanPeriodMonths: 12,
    })

    expect(result.totalInterest).toBe(0)
    expect(result.totalRepayable).toBe(50000)
  })

  it('rejects a non-integer loan period', () => {
    expect(() =>
      quickEstimate({
        principal: 1000,
        annualInterestRatePercent: 10,
        loanPeriodMonths: 3.5,
      }),
    ).toThrow(RangeError)
  })

  it('derives principal from gold weight and feeds it into the estimate', () => {
    const principal = principalFromGoldWeight(10, 30000)
    const result = quickEstimate({
      principal,
      annualInterestRatePercent: 12,
      loanPeriodMonths: 3,
    })

    expect(result.principal).toBe(300000)
    expect(result.totalInterest).toBeCloseTo(9000)
  })
})
