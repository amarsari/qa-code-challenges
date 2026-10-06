# Challenge 01: E-Commerce Shopping Cart Validation

## Objective
Analyze the shopping cart specifications, design a complete test suite covering all functional and boundary rules, and build an automated test suite to identify latent bugs in the implementation.

---

## System Under Test (SUT)

The application consists of a shopping cart (`cart.html` and `cart.js`) supporting:
- Adding items (`productId`, `quantity`, `price`).
- Removing items by `productId`.
- Applying coupon codes (`SAVE10`, `SAVE20`).
- Calculating subtotals, discounts, and total costs.
- Checkout processing.

---

## Business Rules

1. **Items**:
   - `productId` must be non-empty.
   - `quantity` must be an integer between 1 and 10 (inclusive).
   - `price` must be a positive number ($> 0$).
2. **Removal**:
   - Removing an item deletes it from the cart and updates totals.
   - Removing an invalid `productId` must display an error without crashing.
3. **Discounts**:
   - `SAVE10`: 10% off subtotal.
   - `SAVE20`: 20% off subtotal, **only valid if subtotal is $\ge \$50$**.
   - Coupon codes are case-insensitive.
   - Only one coupon can be active at a time (coupons do not stack; applying a new valid coupon replaces the current one).
4. **Calculations**:
   - Cart Total = $\text{subtotal} - \text{discount}$, floored at $\$0.00$.
5. **Checkout**:
   - Checkout is only permitted if the cart contains at least one item.
   - An empty cart cannot be checked out and must display an error.

---

## Your Tasks
1. Model cart state transitions using a state diagram.
2. Build decision tables covering item input validation and discount/checkout logic.
3. Write an IEEE 829-style test case specification (15 test cases).
4. Automate the test suite using Cypress.
5. Identify and report all latent bugs present in the codebase.

> **Ready to check your work?**  
> Explore the full analysis, test suite, and defect logs in [SOLUTION.md](./SOLUTION.md).