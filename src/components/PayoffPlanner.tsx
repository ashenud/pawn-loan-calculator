import { coerceNumeric, parseNumericInput, type NumericInputValue } from '../lib/numericInput'

interface PayoffPlannerProps {
  targetTermMonths: NumericInputValue
  onTargetTermMonthsChange: (value: NumericInputValue) => void
  requiredMonthlyPayment: number | null
  onLoadIntoSimulator: () => void
}

function formatRs(value: number) {
  return `Rs ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

export function PayoffPlanner({
  targetTermMonths,
  onTargetTermMonthsChange,
  requiredMonthlyPayment,
  onLoadIntoSimulator,
}: PayoffPlannerProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Payoff planner</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Banks don't require a fixed monthly installment — you can pay what you can, or skip a
        month, and renew every 12 months by settling the interest due. This works out roughly
        how much you'd need to pay each month to be fully paid off within a target period.
      </p>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="target-term" className="block text-sm font-medium mb-1">
            Target payoff period (months)
          </label>
          <input
            id="target-term"
            type="number"
            min={1}
            value={targetTermMonths}
            onChange={(e) => onTargetTermMonthsChange(parseNumericInput(e.target.value))}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={onLoadIntoSimulator}
          disabled={requiredMonthlyPayment === null}
          className="rounded-md bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-3 py-2 text-sm font-medium"
        >
          Load into schedule
        </button>
      </div>
      {requiredMonthlyPayment !== null && (
        <p className="mt-3 rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm">
          Required average payment: <span className="font-semibold">{formatRs(requiredMonthlyPayment)}</span> /
          month for {coerceNumeric(targetTermMonths)} month{coerceNumeric(targetTermMonths) === 1 ? '' : 's'}{' '}
          (total ≈ {formatRs(requiredMonthlyPayment * coerceNumeric(targetTermMonths))})
        </p>
      )}
    </div>
  )
}
