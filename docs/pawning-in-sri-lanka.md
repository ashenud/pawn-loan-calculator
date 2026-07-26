# How Pawn Loans Work at Sri Lankan Banks

Research notes backing the assumptions and preset data used by this calculator. Bank rates and advance values move with the gold market and change often — treat the figures below as **illustrative, last-checked snapshots**, not live truth. The calculator's bank presets carry an `asOf` date and should be refreshed periodically against each bank's current published rates.

## 1. What a pawning advance is

A pawning (gold loan) advance is a short-term loan secured against gold jewellery/articles pledged at a bank branch. The bank appraises the gold (by weight and purity/karat), advances a percentage of its assessed value in cash, and holds the article as collateral until the loan is redeemed.

## 2. Interest rates

- Interest is quoted **per annum** by most banks, sometimes advertised as a monthly-equivalent rate (e.g. "0.79% per month").
- **Regulatory history**: On 27 April 2020, the Central Bank of Sri Lanka (CBSL) issued a Monetary Law Act order capping pawning-advance interest at **12% per annum (1%/month)** for advances with a tenure under one year, as COVID-19 relief. On 20 August 2020, banks were instructed to cut this further to **10% per annum** for new and renewing pawning facilities.
  - Source: [CBSL — Maximum Interest Rates on Pawning Advances of Licensed Banks](https://www.cbsl.gov.lk/en/node/7782), [Monetary Law Act Order No. 1 of 2020 (PDF)](https://www.cbsl.gov.lk/sites/default/files/cbslweb_documents/laws/cdg/bsd_monetary_law_act_order_1_of_2020_e.pdf)
- These caps were **time-bound relief measures**, not permanent policy. By 2026, advertised bank rates sit well above 10–12%, confirming the caps have lapsed — e.g. Sampath Bank quotes 15.00% p.a. (1–3 month pawning), 15.50% p.a. (6-month), and 16.00% p.a. for its "Randiriya" pawning product (effective 10 June 2026).
  - Source: [Sampath Bank — Interest Rates on New Loans and Advances (PDF)](https://www.sampath.lk/common/loan/interest-rates-loan-and-advances.pdf)
- **Typical current range: ~12%–18% per annum** across licensed banks, prior to the 2020 orders CBSL itself observed banks charging in the 12%–17.5% p.a. range, consistent with today's advertised rates.
- Subsidized exceptions exist for targeted sectors — e.g. Commercial Bank's **Agri Gold Loan** at 7.5% p.a. for jewellery pawned to fund agriculture-linked livelihoods.
  - Source: [Commercial Bank — Agri Gold Loans](https://www.combank.lk/news/news-events/combank-offers-lowest-interest-rate-in-the-country-for-agri-gold-loans)

## 3. Advance value (how much cash you get per gram)

Banks advance a **discounted rate per gram**, differentiated by gold purity (24K, 22K, 21K, 18K), well below the prevailing market gold price — this margin protects the bank if gold prices fall before redemption.

Example data points found (not necessarily current — gold-linked advance rates change frequently):

| Bank | Karat | Advance value | Approx. per gram |
|---|---|---|---|
| Commercial Bank | 24K | Rs 267,000 / 8g | ≈ Rs 33,375/g |
| Commercial Bank | 22K | Rs 246,000 / 8g | ≈ Rs 30,750/g |
| SDB Bank | 24K | Rs 255,000 / 8g | ≈ Rs 31,875/g |

Sources: [Commercial Bank — Gold Loans Pawning](https://www.combank.lk/personal-banking/loans/gold-loans), [SDB Bank — Gold Pawning Rates](https://www.sdb.lk/en/personal/pawning/pawning)

For reference, market gold price (24K, 99.9% purity) was quoted around **Rs 46,260/gram** as of July 2026 — bank advance values are a discount off this, not the full market value.

## 4. Repayment: no fixed EMI, reducing-balance interest

This is the most important mechanic for the calculator's amortization/payoff logic, and differs from a typical fixed-installment personal loan:

- **No mandatory fixed monthly installment.** Several banks (Commercial Bank, HNB Finance, SDB, LB Finance) explicitly state customers can settle the full amount plus interest at the end of the term, or make **partial payments at any time** — pay a lot one month, skip the next, pay extra another month.
  - Source: [Commercial Bank — Gold Loans Pawning](https://www.combank.lk/personal-banking/loans/gold-loans), [LB Finance — Gold Loan](https://www.lbfinance.com/gold-loan)
- **Interest is calculated on the reducing capital / outstanding-balance method.** Each month's interest is `outstandingBalance × monthlyRate`. When a payment is made, it is applied **interest first**, and any remainder reduces the principal — future interest is then charged only on that lower balance.
  - Source: Commercial Bank Key Facts Document — Pawning; consistent language from other banks' pawning disclosures.
- **Interest does not compound.** Unpaid/accrued interest is not added to the principal to itself start earning interest — it simply remains outstanding until paid, and (see below) becomes the trigger for penal interest if it's left unpaid past the renewal point.

## 5. The 12-month renewal cycle

- Pawning advances are typically structured in **~12-month terms**.
- At/around the 12-month mark, the customer can **renew** — pay off the interest accrued to date — and continue the facility for another term, rather than redeeming the gold outright. This can repeat indefinitely as long as interest is kept current.
- If the advance is **not redeemed or renewed** within 12 months (accrued interest left unpaid), a **2% penal interest** is added on top of the normal rate on the unredeemed balance, from the date of default until redemption.

## 6. Redemption and auction

- The pledged gold can be redeemed (loan fully repaid) at any time, without prior notice.
- If a pawning advance is left unredeemed and unrenewed for long enough, the bank may auction the pledged articles to recover the outstanding debt. Pawners retain the right to redeem their gold **up to and including the auction date**, before any bidding takes place.

## 7. Implications for this calculator

- The "quick estimate" mode (fixed principal, rate, and term, settled in one lump sum) is the correct degenerate case of the reducing-balance model when no partial payments are made until the end — both modes are mathematically consistent, not competing philosophies.
- The **Payment Schedule Simulator** models real repayment behavior: month-by-month reducing balance, interest-first payment allocation, support for skipped ($0) months, and flags for missing a 12-month renewal (triggering the 2% penal rate).
- The **Payoff Planner** answers "how much do I need to pay monthly to be done in N months/years?" using a standard reducing-balance annuity formula, then hands that flat payment to the simulator to show the resulting schedule.

## Sources

- [Central Bank of Sri Lanka — Maximum Interest Rates on Pawning Advances of Licensed Banks](https://www.cbsl.gov.lk/en/node/7782)
- [CBSL — Monetary Law Act Order No. 1 of 2020 (PDF)](https://www.cbsl.gov.lk/sites/default/files/cbslweb_documents/laws/cdg/bsd_monetary_law_act_order_1_of_2020_e.pdf)
- [People's Bank — Gold Loan / Pawning](https://www.peoplesbank.lk/gold-loan/)
- [Bank of Ceylon — Ran Surakum Gold Loan](https://www.boc.lk/personal-banking/ran-surekum-naya-sewa)
- [Commercial Bank — Gold Loans Pawning](https://www.combank.lk/personal-banking/loans/gold-loans)
- [Commercial Bank — Agri Gold Loans](https://www.combank.lk/news/news-events/combank-offers-lowest-interest-rate-in-the-country-for-agri-gold-loans)
- [Seylan Bank — Gold Loan / Pawning](https://www.seylan.lk/pawning/gold-loan)
- [Sampath Bank — Interest Rates on New Loans and Advances (PDF)](https://www.sampath.lk/common/loan/interest-rates-loan-and-advances.pdf)
- [SDB Bank — Gold Pawning Rates](https://www.sdb.lk/en/personal/pawning/pawning)
- [DFCC Bank — Ranwarama Pawning FAQs](https://www.dfcc.lk/ranwarama-pawning-faqs/)
- [LB Finance — Gold Loan](https://www.lbfinance.com/gold-loan)

*Last researched: July 2026. Rates and advance values should be re-verified against each bank's current published tariff before relying on the presets in this tool.*
