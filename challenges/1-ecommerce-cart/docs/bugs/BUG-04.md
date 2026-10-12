### BUG-04: Cart Total Is Failing To Floor At $0.00 When Discount Exceeds Subtotal

- **Defect ID:** `BUG-04`
- **Traceability Ref:** Test Case `TC14` | Rule `R14`
- **Severity:** Major
- **Priority:** P1 (Immediate / High business impact)
- **Component:** Discount Engine
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`cart.html`)

#### Description
When the discount amount exceeds the cart subtotal (e.g., after removing items from a cart with an active discount), the system calculates a negative balance instead of flooring the total at `$0.00`.

#### Preconditions
- Application loaded at `http://localhost:8000` (or local test server port).
- Cart contains an item with `productId: 1`, `quantity: 1`, `price: 100.00` (subtotal: `$100.00`).
- Discount code `SAVE20` has been applied (discount amount: `$20.00`, total: `$80.00`).

#### Steps to Reproduce
1. Enter `1` into the **Product ID** input for item removal (`#removeProductId`).
2. Click the **Remove Item** button (`#removeBtn`).

#### Expected Result
- Item `1` is removed from the cart.
- Subtotal drops to `$0.00`.
- Cart total evaluates to `$0.00` (floored at 0, preventing negative totals).
- Status message displays: `'Removed 1'`.

#### Actual Result
- Item `1` is removed from the cart.
- Subtotal drops to `$0.00`, but total is calculated as subtotal minus discount (`$0.00 - $20.00`).
- Cart total evaluates to `-$20.00` (`-20`).
- Status message displays: `'Removed 1'`.

#### Automated Test Failure Trace
```text
   AssertionError: expected -20 to be at least 0
      at Context.eval (webpack://001-e-commerce-cart-validation-(cypress-edition)/./cypress/e2e/cart.cy.js:294:35)
      at getRet (http://localhost:8080/__cypress/runner/cypress_runner.js:121224:20)
      at tryCatcher (http://localhost:8080/__cypress/runner/cypress_runner.js:1780:23)
      at Promise.attempt.Promise.try (http://localhost:8080/__cypress/runner/cypress_runner.js:4288:29)
      at Context.thenFn (http://localhost:8080/__cypress/runner/cypress_runner.js:121235:66)
```