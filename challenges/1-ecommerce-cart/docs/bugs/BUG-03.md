### BUG-03: Missing Subtotal Guard for SAVE20 Discount Code

- **Defect ID:** `BUG-03`
- **Traceability Ref:** Test Case `TC12` | Rule `R12`
- **Severity:** Major
- **Priority:** P1 (Immediate / High business impact)
- **Component:** Discount Engine (`checkout` handler in `cart.js`)
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`cart.html`)

#### Description
When subtotal is less than $50, attempting to add discount code SAVE20 goes through successfully instead of being blocked.

#### Preconditions
- Cart contains items with a known subtotal (productId: 1, qty: 1, price: 49.99 -> subtotal: 49.99); 
- No previous discount applied.
- Application loaded at `http://localhost:8000` (or local test server port).

#### Steps to Reproduce
1. Enter 'SAVE20' into the discount code input (#discountCode).
2. Click the **Apply Discount** button (`#applyDiscountBtn`).

#### Expected Result
- The applyDiscount action is blocked by the business logic guard.
- An error message is displayed: `'Invalid discount for subtotal amount'`.
- Subtotal remains $49.99.
- Discount remains  $0.00.
- Total remains $49.99.
- Active code remains null / empty.

#### Actual Result
- The system processes the discount even under the $50 threshold.
- The total amount is updated to $39.99.
- The UI status message displays: `'Applied SAVE20'`.

#### Automated Test Failure Trace
```text
 Timed out retrying after 4000ms
      + expected - actual

      -'39.99'
      +'49.99'
      
      at Context.eval (webpack://001-e-commerce-cart-validation-(cypress-edition)/./cypress/e2e/cart.cy.js:251:9)