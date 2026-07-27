import { useEffect, useMemo, useState } from 'react'
import { bankPresets, CUSTOM_PRESET_ID } from './data/bankPresets'
import { principalFromGoldWeight, quickEstimate } from './lib/calculator'
import {
  buildFlatPaymentSchedule,
  computeRequiredMonthlyPayment,
  simulatePayoffSchedule,
} from './lib/payoffPlanner'
import type { Karat } from './lib/types'
import { coerceNumeric, type NumericInputValue } from './lib/numericInput'
import { BankSelector } from './components/BankSelector'
import { CalculatorForm } from './components/CalculatorForm'
import { ResultsSummary } from './components/ResultsSummary'
import { PayoffPlanner } from './components/PayoffPlanner'
import { PaymentScheduleSimulator } from './components/PaymentScheduleSimulator'
import { Disclaimer } from './components/Disclaimer'

const ALL_KARATS: Karat[] = ['24K', '22K', '21K', '18K']

function App() {
  const [selectedBankId, setSelectedBankId] = useState(bankPresets[0].id)
  const isCustom = selectedBankId === CUSTOM_PRESET_ID
  const selectedPreset = bankPresets.find((p) => p.id === selectedBankId)

  const [entryMode, setEntryMode] = useState<'gold' | 'direct'>('gold')
  const [goldWeightGrams, setGoldWeightGrams] = useState<NumericInputValue>(10)
  const [karat, setKarat] = useState<Karat>('22K')
  const [advanceRatePerGram, setAdvanceRatePerGram] = useState<NumericInputValue>(30000)
  const [directPrincipal, setDirectPrincipal] = useState<NumericInputValue>(300000)
  const [annualInterestRatePercent, setAnnualInterestRatePercent] = useState<NumericInputValue>(13)
  const [loanPeriodMonths, setLoanPeriodMonths] = useState<NumericInputValue>(6)

  const availableKarats = useMemo<Karat[]>(
    () =>
      isCustom || !selectedPreset ? ALL_KARATS : (Object.keys(selectedPreset.advancePerGram) as Karat[]),
    [isCustom, selectedPreset],
  )

  // Pre-fill rate & advance value when a bank (and karat) is selected — still editable after.
  useEffect(() => {
    if (isCustom || !selectedPreset) return
    setAnnualInterestRatePercent(selectedPreset.annualInterestRatePercent)
    const presetRate = selectedPreset.advancePerGram[karat]
    if (presetRate != null) setAdvanceRatePerGram(presetRate)
  }, [selectedBankId, karat, isCustom, selectedPreset])

  const computedPrincipal =
    entryMode === 'gold'
      ? principalFromGoldWeight(coerceNumeric(goldWeightGrams), coerceNumeric(advanceRatePerGram))
      : coerceNumeric(directPrincipal)

  const quickResult = quickEstimate({
    principal: computedPrincipal,
    annualInterestRatePercent: coerceNumeric(annualInterestRatePercent),
    loanPeriodMonths: coerceNumeric(loanPeriodMonths),
  })

  // Payoff planner
  const [targetTermMonths, setTargetTermMonths] = useState<NumericInputValue>(12)
  const targetTermMonthsNumeric = coerceNumeric(targetTermMonths)
  const requiredMonthlyPayment =
    computedPrincipal > 0 && targetTermMonthsNumeric > 0
      ? computeRequiredMonthlyPayment(
          computedPrincipal,
          coerceNumeric(annualInterestRatePercent),
          targetTermMonthsNumeric,
        )
      : null

  // Payment schedule simulator
  const [planMonths, setPlanMonths] = useState<NumericInputValue>(12)
  const planMonthsNumeric = coerceNumeric(planMonths)
  const [payments, setPayments] = useState<NumericInputValue[]>(() => buildFlatPaymentSchedule(0, 12))

  useEffect(() => {
    setPayments((prev) => {
      if (prev.length === planMonthsNumeric) return prev
      const next = prev.slice(0, planMonthsNumeric)
      while (next.length < planMonthsNumeric) next.push(0)
      return next
    })
  }, [planMonthsNumeric])

  const handlePaymentChange = (index: number, value: NumericInputValue) => {
    setPayments((prev) => prev.map((p, i) => (i === index ? value : p)))
  }

  const handleLoadIntoSimulator = () => {
    if (requiredMonthlyPayment === null) return
    setPlanMonths(targetTermMonthsNumeric)
    setPayments(buildFlatPaymentSchedule(Math.round(requiredMonthlyPayment), targetTermMonthsNumeric))
  }

  const simulation = simulatePayoffSchedule(
    computedPrincipal,
    coerceNumeric(annualInterestRatePercent),
    payments.map(coerceNumeric),
    { penalRatePercent: selectedPreset?.penalInterestRatePercent ?? 2 },
  )

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Sri Lankan Pawn Loan Calculator</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Estimate what you'll receive and owe when pawning gold jewellery at a Sri Lankan
            bank — with realistic, pay-as-you-can repayment planning.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <BankSelector presets={bankPresets} selectedId={selectedBankId} onSelect={setSelectedBankId} />
            <CalculatorForm
              entryMode={entryMode}
              onEntryModeChange={setEntryMode}
              goldWeightGrams={goldWeightGrams}
              onGoldWeightGramsChange={setGoldWeightGrams}
              karat={karat}
              onKaratChange={setKarat}
              availableKarats={availableKarats}
              advanceRatePerGram={advanceRatePerGram}
              onAdvanceRatePerGramChange={setAdvanceRatePerGram}
              directPrincipal={directPrincipal}
              onDirectPrincipalChange={setDirectPrincipal}
              annualInterestRatePercent={annualInterestRatePercent}
              onAnnualInterestRatePercentChange={setAnnualInterestRatePercent}
              loanPeriodMonths={loanPeriodMonths}
              onLoanPeriodMonthsChange={setLoanPeriodMonths}
              computedPrincipal={computedPrincipal}
            />
          </section>

          <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <ResultsSummary result={quickResult} loanPeriodMonths={coerceNumeric(loanPeriodMonths)} />
          </section>
        </div>

        <div className="mt-8 space-y-8">
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <PayoffPlanner
              targetTermMonths={targetTermMonths}
              onTargetTermMonthsChange={setTargetTermMonths}
              requiredMonthlyPayment={requiredMonthlyPayment}
              onLoadIntoSimulator={handleLoadIntoSimulator}
            />
          </section>

          <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <PaymentScheduleSimulator
              planMonths={planMonths}
              onPlanMonthsChange={setPlanMonths}
              payments={payments}
              onPaymentChange={handlePaymentChange}
              simulation={simulation}
            />
          </section>
        </div>

        <Disclaimer />
      </div>
    </div>
  )
}

export default App
