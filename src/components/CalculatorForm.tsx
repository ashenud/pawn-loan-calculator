import type { Karat } from '../lib/types'
import { parseNumericInput, type NumericInputValue } from '../lib/numericInput'

const ALL_KARATS: Karat[] = ['24K', '22K', '21K', '18K']

interface CalculatorFormProps {
  entryMode: 'gold' | 'direct'
  onEntryModeChange: (mode: 'gold' | 'direct') => void

  goldWeightGrams: NumericInputValue
  onGoldWeightGramsChange: (value: NumericInputValue) => void

  karat: Karat
  onKaratChange: (value: Karat) => void
  availableKarats: Karat[]

  advanceRatePerGram: NumericInputValue
  onAdvanceRatePerGramChange: (value: NumericInputValue) => void

  directPrincipal: NumericInputValue
  onDirectPrincipalChange: (value: NumericInputValue) => void

  annualInterestRatePercent: NumericInputValue
  onAnnualInterestRatePercentChange: (value: NumericInputValue) => void

  loanPeriodMonths: NumericInputValue
  onLoanPeriodMonthsChange: (value: NumericInputValue) => void

  computedPrincipal: number
}

function numberInputProps(
  value: NumericInputValue,
  onChange: (v: NumericInputValue) => void,
) {
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseNumericInput(e.target.value))
    },
    className:
      'w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm',
    type: 'number' as const,
    min: 0,
  }
}

export function CalculatorForm(props: CalculatorFormProps) {
  const {
    entryMode,
    onEntryModeChange,
    goldWeightGrams,
    onGoldWeightGramsChange,
    karat,
    onKaratChange,
    availableKarats,
    advanceRatePerGram,
    onAdvanceRatePerGramChange,
    directPrincipal,
    onDirectPrincipalChange,
    annualInterestRatePercent,
    onAnnualInterestRatePercentChange,
    loanPeriodMonths,
    onLoanPeriodMonthsChange,
    computedPrincipal,
  } = props

  return (
    <div className="space-y-4">
      <div>
        <span className="block text-sm font-medium mb-1">How do you want to enter the loan amount?</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEntryModeChange('gold')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm ${
              entryMode === 'gold'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            From gold weight
          </button>
          <button
            type="button"
            onClick={() => onEntryModeChange('direct')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm ${
              entryMode === 'direct'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            Enter amount directly
          </button>
        </div>
      </div>

      {entryMode === 'gold' ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="gold-weight" className="block text-sm font-medium mb-1">
              Gold weight (grams)
            </label>
            <input id="gold-weight" {...numberInputProps(goldWeightGrams, onGoldWeightGramsChange)} />
          </div>
          <div>
            <label htmlFor="karat" className="block text-sm font-medium mb-1">
              Karat
            </label>
            <select
              id="karat"
              value={karat}
              onChange={(e) => onKaratChange(e.target.value as Karat)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            >
              {ALL_KARATS.map((k) => (
                <option key={k} value={k} disabled={!availableKarats.includes(k)}>
                  {k}
                  {!availableKarats.includes(k) ? ' (no preset)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="advance-rate" className="block text-sm font-medium mb-1">
              Advance value per gram (Rs)
            </label>
            <input
              id="advance-rate"
              {...numberInputProps(advanceRatePerGram, onAdvanceRatePerGramChange)}
            />
          </div>
          <div className="col-span-2 rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm">
            Amount received: <span className="font-semibold">Rs {computedPrincipal.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="direct-principal" className="block text-sm font-medium mb-1">
            Amount received from bank (Rs)
          </label>
          <input
            id="direct-principal"
            {...numberInputProps(directPrincipal, onDirectPrincipalChange)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="interest-rate" className="block text-sm font-medium mb-1">
            Interest rate (% per annum)
          </label>
          <input
            id="interest-rate"
            step="0.01"
            {...numberInputProps(annualInterestRatePercent, onAnnualInterestRatePercentChange)}
          />
        </div>
        <div>
          <label htmlFor="loan-period" className="block text-sm font-medium mb-1">
            Loan period (months)
          </label>
          <input
            id="loan-period"
            {...numberInputProps(loanPeriodMonths, onLoanPeriodMonthsChange)}
          />
        </div>
      </div>
    </div>
  )
}
