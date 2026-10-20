# Defect Register & Bug Reports

This document tracks all defects discovered during the exploratory analysis and automated test execution of the **Login And Account Lockout** service.

Each defect is traced to its corresponding test case, business rule, and root-cause analysis file in the [`bugs/`](./bugs/) directory.

---

## Defect Summary Register

| Bug ID | Title | Component | Severity | Priority | Test Ref | Rule Ref | Detailed Report |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **BUG-01** | Account Lockout Bypassed by Entering Valid Credentials During Active Cooldown | Login Engine / Guard Precedence | Critical | P1 | TC04, TC06a, TC10 | R04, R06 | [View Report](./bugs/BUG-01.md) |
| **BUG-02** | Counter Not Resetting When Successful Login Is Applied After Failed Attempts Before User Gets Locked Out | State Management / Attempt Counter | Major | P1 | TC05, TC11, TC12 | R05, R07, R08 | [View Report](./bugs/BUG-02.md) |
| **BUG-03** | Account Remains Locked And Counter Fails To Reset Upon Clicking "Forgot Password" | Password Recovery / State Management | Major | P1 | TC07, TC12 | R07 | [View Report](./bugs/BUG-03.md) |
| **BUG-04** | Cooldown Timer Auto Unlock Failure | Cooldown Timer / State Management | Major | P1 | TC08, TC10, TC11 | R08 | [View Report](./bugs/BUG-04.md) |

---

## Severity & Priority Breakdown

### By Severity (Technical Impact)
- **Critical (1):** BUG-01 — Direct authentication security bypass allowing locked-out accounts to be accessed before cooldown expiration.
- **Major (3):** BUG-02, BUG-03, BUG-04 — Core state and recovery breakdown; failure of self-service recovery, cooldown timer expiry, and attempt counter state retention leading to premature lockouts.
- **Medium (0):** None.
- **Low (0):** None.

### By Priority (Business Urgency)
- **P1 - Immediate / Blocker (4):** All four defects severely compromise either authentication security controls (BUG-01) or user account accessibility/recovery paths (BUG-02, BUG-03, BUG-04).
- **P2 - High (0):** None.
- **P3 - Medium (0):** None.
- **P4 - Low (0):** None.