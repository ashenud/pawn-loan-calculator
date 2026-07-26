import type { BankPreset } from '../lib/types'
import { CUSTOM_PRESET_ID } from '../data/bankPresets'

interface BankSelectorProps {
  presets: BankPreset[]
  selectedId: string
  onSelect: (id: string) => void
}

export function BankSelector({ presets, selectedId, onSelect }: BankSelectorProps) {
  const selectedPreset = presets.find((p) => p.id === selectedId)

  return (
    <div>
      <label htmlFor="bank-select" className="block text-sm font-medium mb-1">
        Bank
      </label>
      <select
        id="bank-select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
      >
        {presets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.bankName}
          </option>
        ))}
        <option value={CUSTOM_PRESET_ID}>Custom / Manual entry</option>
      </select>
      {selectedPreset && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {selectedPreset.sourceNote} (as of {selectedPreset.asOf})
        </p>
      )}
    </div>
  )
}
