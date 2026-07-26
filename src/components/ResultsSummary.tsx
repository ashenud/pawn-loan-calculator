import type { QuickEstimateResult } from '../lib/types'

interface ResultsSummaryProps {
  result: QuickEstimateResult
  loanPeriodMonths: number
}

function formatRs(value: number) {
  return `Rs ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

export function ResultsSummary({ result, loanPeriodMonths }: ResultsSummaryProps) {
  const effectiveAnnualCost =
    result.principal > 0 && loanPeriodMonths > 0
      ? ((result.totalInterest / result.principal) * (12 / loanPeriodMonths)) * 100
      : 0

  const tiles = [
    { label: 'Amount received', value: formatRs(result.principal) },
    { label: 'Interest per month', value: formatRs(result.monthlyInterest) },
    { label: `Total interest (${loanPeriodMonths} mo.)`, value: formatRs(result.totalInterest) },
    { label: 'Total repayable', value: formatRs(result.totalRepayable) },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Quick estimate</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Assumes the loan is settled in one lump sum at the end of the term — a quick headline
        number. See the repayment planner below for the realistic pay-as-you-go model banks
        actually use.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">{tile.label}</div>
            <div className="text-base font-semibold">{tile.value}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Effective annualized cost: {effectiveAnnualCost.toFixed(2)}%
      </p>
    </div>
  )
}
