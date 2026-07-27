/**
 * A numeric form field's value while being edited: a real number, or '' to
 * represent a genuinely empty field. Keeping '' distinct from 0 lets a user
 * clear a field completely — if we collapsed '' to 0 immediately, the input
 * would re-render showing "0" mid-edit, and the next digit typed would land
 * before that leftover zero (e.g. clearing "10" then typing "5" would show
 * "05" instead of "5").
 */
export type NumericInputValue = number | ''

export function parseNumericInput(raw: string): NumericInputValue {
  if (raw === '') return ''
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : ''
}

/** Coerces an in-progress field value to a real number for calculations — an empty field counts as 0. */
export function coerceNumeric(value: NumericInputValue): number {
  return value === '' ? 0 : value
}
