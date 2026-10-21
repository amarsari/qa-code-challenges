### BUG-03: Missing Subtotal Guard for SAVE20 Discount Code

- **Defect ID:** `BUG-03`
- **Traceability Ref:** Test Case `TC12` | Rule `R12`
- **Severity:** Major (Business logic / financial rule violation)
- **Priority:** P1 (High business impact — unauthorized revenue loss / discount leakage)
- **Component:** Discount Management
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`cart.html`)

#### Description
When the cart subtotal is less than $50.00, attempting to apply discount code `SAVE20` succeeds instead of being blocked by the minimum threshold validation rule.

#### Preconditions
- Application is loaded at `http://localhost:8080/cart.html`.
- Cart contains an item with subtotal below $50.00 (`productId: 1`, `qty: 1`, `price: 49.99` -> subtotal: `$49.99`).
- No previous discount applied.

#### Steps to Reproduce
1. Navigate to `http://localhost:8080/cart.html`. 
2. Enter `SAVE20` into the discount code input field (`#discountCode`).
3. Click the **Apply Discount** button (`#applyDiscountBtn`).

#### Expected Result
- The action is blocked by the business logic guard.
- An error message is displayed: `'Invalid discount for subtotal amount'`.
- Subtotal remains `$49.99`.
- Discount remains `$0.00`.
- Total remains `$49.99`.
- Active discount code remains `null` / empty.

#### Actual Result
- The system processes the discount despite being below the $50.00 threshold.
- The UI status message displays: `'Applied SAVE20'`.
- The total amount incorrectly updates to `$39.99`.

#### Automated Test Failure Trace
```text
Timed out retrying after 4000ms
  + expected - actual

  -'39.99'
  +'49.99'
  
  at Context.eval (webpack://001-e-commerce-cart-validation-(cypress-edition)/./cypress/e2e/cart.cy.js:251:9)
```