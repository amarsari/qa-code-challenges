### BUG-02: Empty Cart Is Successfully Checked Out Instead of Being Blocked

- **Defect ID:** `BUG-02`
- **Traceability Ref:** Test Case `TC08` | Rule `R08`
- **Severity:** Major (Business logic / checkout gating bypass)
- **Priority:** P1 (Immediate / High business impact)
- **Component:** Checkout Processing (`checkout` handler in `cart.js`)
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`cart.html`)

#### Description
When attempting to check out with an empty cart, the system completes the transaction and displays a success confirmation for `$0.00` instead of rejecting the action and alerting the user that the cart contains no items.

#### Preconditions
- The shopping cart is empty (`items: []`, `subtotal: $0.00`).
- Application loaded at `http://localhost:8000` (or local test server port).

#### Steps to Reproduce
1. Navigate to the shopping cart interface.
2. Click the **Checkout** button (`#checkoutBtn`).

#### Expected Result
- The checkout action is blocked by the business logic guard.
- An error message is displayed: `'Empty cart cannot be checked out'`.
- The cart remains in its initial empty state.
- No successful order confirmation is produced.

#### Actual Result
- The system processes the transaction on an empty cart.
- The UI status message displays: `'Checkout success, total: $0.00'`.

#### Automated Test Failure Trace
```text
Timed out retrying after 4000ms
  + expected - actual

  -'Checkout success, total: $0.00'
  +'Empty cart cannot be checked out'
  
  at Context.eval (cypress/e2e/cart.cy.js:170:9)