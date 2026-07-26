import type { BankPreset } from '../lib/types'

/**
 * Seed data only — Sri Lankan pawning rates and gold advance values move with
 * the gold market and change often. These are last-checked snapshots meant as
 * editable starting points, not guaranteed-current figures. See
 * docs/pawning-in-sri-lanka.md for sources and confidence notes.
 */
export const bankPresets: BankPreset[] = [
  {
    id: 'peoples-bank',
    bankName: "People's Bank",
    annualInterestRatePercent: 13.5,
    advancePerGram: { '24K': 30000, '22K': 27500 },
    maxTenureMonths: 12,
    penalInterestRatePercent: 2,
    asOf: '2026-07',
    sourceNote:
      'Approximate — publicly advertised rate range, not scraped directly from peoplesbank.lk. Verify with a branch.',
  },
  {
    id: 'bank-of-ceylon',
    bankName: 'Bank of Ceylon',
    annualInterestRatePercent: 13,
    advancePerGram: { '24K': 30500, '22K': 28000 },
    maxTenureMonths: 12,
    penalInterestRatePercent: 2,
    asOf: '2026-07',
    sourceNote:
      'Approximate — Ran Surakum gold loan scheme, not scraped directly from boc.lk. Verify with a branch.',
  },
  {
    id: 'commercial-bank',
    bankName: 'Commercial Bank',
    annualInterestRatePercent: 14,
    advancePerGram: { '24K': 33375, '22K': 30750 },
    maxTenureMonths: 12,
    penalInterestRatePercent: 2,
    asOf: '2026-07',
    sourceNote:
      'Advance-per-gram figures from combank.lk Gold Loans Pawning page (Rs 267,000/8g 24K, Rs 246,000/8g 22K). Commercial Bank also offers a 7.5% p.a. Agri Gold Loan for agriculture-linked borrowers — not reflected here. Verify current general rate with a branch.',
  },
  {
    id: 'seylan-bank',
    bankName: 'Seylan Bank',
    annualInterestRatePercent: 12.5,
    advancePerGram: { '24K': 30000, '22K': 27500 },
    maxTenureMonths: 12,
    penalInterestRatePercent: 2,
    asOf: '2026-07',
    sourceNote:
      'Approximate — Seylan has previously advertised rates as low as 0.79%/month; current rate not scraped directly from seylan.lk. Verify with a branch.',
  },
  {
    id: 'sampath-bank',
    bankName: 'Sampath Bank',
    annualInterestRatePercent: 15,
    advancePerGram: { '24K': 31000, '22K': 28500 },
    maxTenureMonths: 12,
    penalInterestRatePercent: 2,
    asOf: '2026-07',
    sourceNote:
      'Interest rate from Sampath Bank "Interest Rates on New Loans and Advances" PDF (15.00% p.a., 1-3 month pawning, effective 10 June 2026). Advance-per-gram figures are approximate.',
  },
  {
    id: 'sdb-bank',
    bankName: 'SDB Bank',
    annualInterestRatePercent: 15,
    advancePerGram: { '24K': 31875 },
    maxTenureMonths: 12,
    penalInterestRatePercent: 2,
    asOf: '2026-07',
    sourceNote:
      'Advance-per-gram figure from sdb.lk Gold Pawning Rates page (Rs 255,000/8g 24K, effective 22 April 2026). Interest rate is approximate.',
  },
]

export const CUSTOM_PRESET_ID = 'custom'
