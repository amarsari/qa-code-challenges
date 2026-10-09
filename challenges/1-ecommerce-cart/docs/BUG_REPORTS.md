# Defect Register & Bug Reports

This document tracks all defects discovered during the exploratory analysis and automated test execution of the **E-Commerce Shopping Cart Validation** service.

Each defect is traced to its corresponding test case, business rule, and root-cause analysis file in the [`bugs/`](./bugs/) directory.

---

## Defect Summary Register

| Bug ID | Title | Component | Severity | Priority | Test Ref | Rule Ref | Detailed Report |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **BUG-01** | Adding item without Product ID succeeds instead of throwing validation error | Item Management | Medium | P2 | `TC02` | `R02` | [View Report](./bugs/BUG-01.md) |
| **BUG-02** | Empty cart checkout completes successfully instead of being blocked | Checkout Processing | Major | P1 | `TC08` | `R08` | [View Report](./bugs/BUG-02.md) |
| **BUG-03** | `SAVE20` coupon applied when subtotal is below the $50 threshold | Discount Logic | Major | P1 | `TC12` | `R12` | [View Report](./bugs/BUG-03.md) |
| **BUG-04** | Cart total calculates negative values without flooring at $0.00 | Total Calculation | Major | P1 | `TC14` | `R14` | [View Report](./bugs/BUG-04.md) |

---

## Severity & Priority Breakdown

### By Severity (Technical Impact)
- **Critical (0):** No catastrophic crashes or blocking unhandled exceptions.
- **Major (3):** `BUG-02` (checkout gating failure), `BUG-03` (discount boundary breach), and `BUG-04` (financial calculation floor missing).
- **Medium (1):** `BUG-01` (input sanitation and presence validation missing).
- **Low (0):** None.

### By Priority (Business Urgency)
- **P1 - Immediate / Blocker (3):** Financial loss risk (`BUG-03`, `BUG-04`) and fraudulent / empty transaction processing (`BUG-02`).
- **P2 - High (1):** Data corruption in cart line items (`BUG-01`).