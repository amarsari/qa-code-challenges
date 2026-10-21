### BUG-01: Adding Item Without Product ID Succeeds Instead of Displaying Validation Error

- **Defect ID:** `BUG-01`
- **Traceability Ref:** Test Case `TC02` | Rule `R02`
- **Severity:** Medium (Functional input validation defect)
- **Priority:** P2 (Medium — data corruption in cart line items)
- **Component:** Item Management / Input Validation
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`cart.html`)

#### Description
When attempting to add an item to the cart without supplying a `productId` (leaving the input blank or containing only whitespace), the system bypasses validation. Instead of rejecting the submission and alerting the user, the item is appended to the cart list as an unnamed entry, the subtotal is calculated, and an incomplete success message is displayed.

#### Preconditions
- Application loaded at `http://localhost:8080/cart.html` (or local test server port).
- The shopping cart is empty (`items: []`, `subtotal: $0.00`).

#### Steps to Reproduce
1. Navigate to `http://localhost:8080/cart.html`.
2. Leave the **Product ID** input (`#productId`) completely blank.
3. Enter `1` into the **Quantity** input (`#quantity`).
4. Enter `10` into the **Price** input (`#price`).
5. Click the **Add Item** button (`#addBtn`).

#### Expected Result
- The submission is rejected by the input validation layer.
- Error message displays: `'Missing product'`.
- Cart item list (`#itemList`) remains empty (no `li` elements rendered).
- Subtotal (`#subtotal`) remains unchanged at `$0.00`.

#### Actual Result
- The system accepts the empty product identifier.
- The UI status message displays: `'Added '`.
- A blank item is appended to the cart list (`qty 1 @ $10`).
- The subtotal incorrectly updates from `$0.00` to `$10.00`.

#### Automated Test Failure Trace
```text
CypressError: Timed out retrying after 4000ms: 
expected '<div#message>' to contain text 'Missing product', but the text was 'Added '

  at Context.eval (cypress/e2e/cart.cy.js:56:9)
```

