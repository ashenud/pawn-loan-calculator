import type { InterestMethod } from '../lib/types'

interface InterestMethodToggleProps {
  value: InterestMethod
  onChange: (value: InterestMethod) => void
}

export function InterestMethodToggle({ value, onChange }: InterestMethodToggleProps) {
  return (
    <div>
      <span className="block text-sm font-medium mb-1">Repayment interest method</span>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Applies to the planner and simulator below. Sri Lankan banks use reducing balance — the
        flat option is offered only for comparison.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('reducing')}
          className={`flex-1 rounded-md border px-3 py-2 text-sm ${
            value === 'reducing'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          Reducing balance (bank standard)
        </button>
        <button
          type="button"
          onClick={() => onChange('flat')}
          className={`flex-1 rounded-md border px-3 py-2 text-sm ${
            value === 'flat'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          Flat rate (comparison)
        </button>
      </div>
    </div>
  )
}
