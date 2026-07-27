import type { InterestMethod, PayoffSimulationResult } from '../lib/types'
import { parseNumericInput, type NumericInputValue } from '../lib/numericInput'

interface PaymentScheduleSimulatorProps {
  interestMethod: InterestMethod
  planMonths: NumericInputValue
  onPlanMonthsChange: (value: NumericInputValue) => void
  payments: NumericInputValue[]
  onPaymentChange: (index: number, value: NumericInputValue) => void
  simulation: PayoffSimulationResult

  monthlyPaymentInput: NumericInputValue
  onMonthlyPaymentInputChange: (value: NumericInputValue) => void
  estimatedMonthsForPayment: number | null
  onApplyMonthlyPayment: () => void
  monthlyPaymentHorizonMonths: number
}

function formatRs(value: number) {
  return `Rs ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

export function PaymentScheduleSimulator({
  interestMethod,
  planMonths,
  onPlanMonthsChange,
  payments,
  onPaymentChange,
  simulation,
  monthlyPaymentInput,
  onMonthlyPaymentInputChange,
  estimatedMonthsForPayment,
  onApplyMonthlyPayment,
  monthlyPaymentHorizonMonths,
}: PaymentScheduleSimulatorProps) {
  const hasMonthlyPaymentInput = monthlyPaymentInput !== '' && monthlyPaymentInput > 0

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Payment schedule simulator</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Enter what you actually plan to pay each month — leave a row at 0 to simulate skipping
        that month. Interest is charged{' '}
        {interestMethod === 'flat'
          ? 'as a flat rate on the original amount received'
          : 'on the reducing outstanding balance'}{' '}
        and applied interest-first, matching how banks calculate pawning interest.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="plan-months" className="block text-sm font-medium mb-1">
            Months to plan
          </label>
          <input
            id="plan-months"
            type="number"
            min={1}
            max={120}
            value={planMonths}
            onChange={(e) => onPlanMonthsChange(parseNumericInput(e.target.value))}
            className="w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Fills the table below with this many rows to edit by hand.
          </p>
        </div>

        <div>
          <label htmlFor="monthly-payment-input" className="block text-sm font-medium mb-1">
            Or, what I can pay monthly (Rs)
          </label>
          <div className="flex gap-2">
            <input
              id="monthly-payment-input"
              type="number"
              min={0}
              value={monthlyPaymentInput}
              onChange={(e) => onMonthlyPaymentInputChange(parseNumericInput(e.target.value))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={onApplyMonthlyPayment}
              disabled={!hasMonthlyPaymentInput || estimatedMonthsForPayment === null}
              className="shrink-0 rounded-md bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-3 py-2 text-sm font-medium"
            >
              Apply
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {!hasMonthlyPaymentInput
              ? 'Enter an amount to see how many months it would take to pay off.'
              : estimatedMonthsForPayment !== null
                ? `≈ ${estimatedMonthsForPayment} month${estimatedMonthsForPayment === 1 ? '' : 's'} to pay off at this amount. Click Apply to fill the table below.`
                : `This amount won't clear the balance within ${monthlyPaymentHorizonMonths} months — try a higher payment.`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Month</th>
              <th className="px-3 py-2 text-left font-medium">Opening balance</th>
              <th className="px-3 py-2 text-left font-medium">Interest due</th>
              <th className="px-3 py-2 text-left font-medium">Payment</th>
              <th className="px-3 py-2 text-left font-medium">Closing balance</th>
              <th className="px-3 py-2 text-left font-medium">Renewal</th>
            </tr>
          </thead>
          <tbody>
            {simulation.rows.map((row, index) => (
              <tr
                key={row.month}
                className={`border-t border-gray-200 dark:border-gray-700 ${
                  row.renewalMissed ? 'bg-red-50 dark:bg-red-950/40' : ''
                }`}
              >
                <td className="px-3 py-1.5">{row.month}</td>
                <td className="px-3 py-1.5">{formatRs(row.openingBalance)}</td>
                <td className="px-3 py-1.5">{formatRs(row.interestAccrued)}</td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={payments[index] ?? 0}
                    onChange={(e) => onPaymentChange(index, parseNumericInput(e.target.value))}
                    className="w-28 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-1.5">{formatRs(row.closingBalance)}</td>
                <td className="px-3 py-1.5">
                  {row.renewalMissed ? (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Missed — {row.effectiveAnnualRatePercent.toFixed(2)}% penal rate applies
                    </span>
                  ) : row.renewalDue ? (
                    <span className="text-green-600 dark:text-green-400">Renewed</span>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Paid off by</div>
          <div className="text-base font-semibold">
            {simulation.fullyPaidOff ? `Month ${simulation.monthsToPayoff}` : 'Not within plan'}
          </div>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total interest paid</div>
          <div className="text-base font-semibold">{formatRs(simulation.totalInterestPaid)}</div>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total paid</div>
          <div className="text-base font-semibold">{formatRs(simulation.totalPaid)}</div>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Renewal missed?</div>
          <div className="text-base font-semibold">{simulation.anyRenewalMissed ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  )
}
