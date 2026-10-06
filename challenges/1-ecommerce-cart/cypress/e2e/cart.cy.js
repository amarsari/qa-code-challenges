/*
Challenge: E-Commerce Cart Validation (Cypress Edition)
The System Under Test

Rules:

Adding an item requires productId, quantity (positive integer), and price (positive number).
Max quantity per item is 10; attempts above that should be rejected.
Discount codes:
    SAVE10 = 10% off subtotal
    SAVE20 = 20% off subtotal, only if subtotal ≥ $50
Case-insensitive, only one active at a time
Removing a nonexistent item should show a clear error, not crash the page.
Cart total = sum(price × quantity) − discount, floored at $0.
Empty cart cannot be checked out.
Your task
Write a test plan — 15+ cases (happy path, edges, boundaries, errors) in a table: ID, description, steps/input, expected result.
Automate at least 8 of them in Cypress, driving the UI (typing into inputs, clicking buttons, asserting on rendered text/DOM state) — not calling the JS functions directly.
Include at least one intentionally failing test and diagnose why.

Stretch goals
Use cy.intercept() practice by converting this into a real API-backed app and stubbing network calls.
Add a custom Cypress command like cy.addItem(id, qty, price) to cut down repetition.
Add visual regression checks with cypress-image-snapshot.
*/

describe("Shopping Cart Validation Tests", () => {
  beforeEach(() => {
    cy.visit("/cart.html");
  });

  it("TC01 - Add valid item to empty cart", () => {
    cy.get('[id="productId"]').type('p1');
    cy.get('[id="quantity"]').type('2');
    cy.get('[id="price"]').type('25');
    cy.get('[id="addBtn"]').click();

    cy.get('[id="itemList"]')
        .should('contain.text', 'p1: qty 2 @ $25');

    cy.get('[id="subtotal"]')
        .should('contain.text', '50.00');

    cy.get('[id="message"]')
        .should('be.visible')
        .and('contain', 'Added p1');
  });

  it.skip("TC02 - Add item to empty cart with invalid product Id", () => {
    cy.addProduct(undefined, '1', '10');

    //cy.get('[id="itemList"]').should('not.contain.text', 'qty 1 @ $10');
    cy.get('#itemList li').should('not.exist');

    cy.get('[id="subtotal"]')
        .should('contain.text', '$0');

    cy.get('[id="message"]')
        .should('be.visible')
        .and('contain.text', 'Missing product');
  });

  it("TC03a - Add valid item to empty cart with quantity as zero", () => {
    cy.get('[id="productId"]').type('p1');
    cy.get('[id="quantity"]').type('0');
    cy.get('[id="price"]').type('10');
    cy.get('[id="addBtn"]').click();

    cy.get('[id="itemList"]')
        .should('not.be.visible');
    
    cy.get('[id="subtotal"]')
        .should('contain.text', '0');

    cy.get('[id="message"]')
        .should('be.visible')
        .and('contain.text', 'Invalid quantity');

  });

  it("TC03b - Add valid item to empty card with negative quantity", () =>{
    cy.addProduct('p1', '-1', '10');

    cy.get('[id="itemList"]')
        .should('not.be.visible');
    
    cy.get('[id="subtotal"]')
        .should('contain.text', '0');

    cy.get('[id="message"]')
        .should('be.visible')
        .and('contain.text', 'Invalid quantity');
  });

  it("TC04 - Add valid product to empty cart with exceeding quantity limit", () => {
    cy.addProduct('p1', 11, 10);

    cy.get('#itemList li').should('not.exist');
    cy.get('#subtotal').should('contain.text', '0');
    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Invalid quantity');

    /*
    Observation / UX Improvement

    Observation: The application currently relies on a single generic message ('Invalid quantity') across multiple failure 
    modes: zero quantity, negative values, non-numeric inputs, and inputs exceeding the maximum quantity threshold.   
    
    Impact: Reduced usability and user feedback clarity. Users are not informed why their input was rejected (e.g., whether
     the field is required or if they surpassed a cart limit).
     
     Recommendation: Refactor input validation to provide granular, context-specific feedback such as 'Quantity exceeds maximum
      limit of 10' versus 'Quantity must be greater than 0'.
    */
  });

  it.skip("TC05a - Add valid product to empty cart with valid quantity and negative price", () => {
    cy.addProduct('p1', 5, -3);

    cy.get('#itemList li').should('not.exist');
    cy.get('#subtotal').should('contain.text', '0');
    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Invalid price');
  });

  it.skip("TC05b - Add valid product to empty cart with valid quantity and price as 0", () => {
    cy.addProduct('p1', 5, 0);

    cy.get('#itemList li').should('not.exist');
    cy.get('#subtotal').should('contain.text', '0');
    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Invalid price');
  });

  it("TC06 - Remove valid and existing product from cart", () => {
    //Precondition:
    cy.addProduct('1', 2, 10);

    //The test:
    cy.get('#removeId').type('1');
    cy.get('#removeBtn').click();

    cy.get('#itemList li').should('not.exist');
    cy.get('#subtotal').should('contain.text', '0');
    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Removed 1');
  });

  it.skip("TC07 - Remove invalid and non existing product from empty cart", () => {
    cy.get('#removeId').type('99');
    cy.get('#removeBtn').click();

    cy.get('#itemList li').should('not.exist');
    cy.get('#subtotal').should('contain.text', '0');
    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Item not found');
  });

  it.skip("TC08 - Checkout empty cart", () => {
    cy.get('#checkoutBtn').click();

    cy.get('#itemList li').should('not.exist');
    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Empty cart cannot be checked out');
  });

  it("TC09 - Apply valid uppercase discount code SAVE10", () => {
    //Precondition:
    cy.addProduct(1, 2, 50);

    //Adding the discount code
    cy.get('#discountCode').type('SAVE10');
    cy.get('#applyDiscountBtn').click();

    //Assertions
    cy.get('#subtotal')
        .should('contain.text', '100.00');

    cy.get('#total')
        .should('be.visible')
        .and('contain.text', '90.00');

    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Applied SAVE10');
  });

  it("TC10 - Apply valid lowercase discount code save10", () => {
    //Precondition:
    cy.addProduct(1, 2, 50);

    //Adding the discount code
    cy.get('#discountCode').type('save10');
    cy.get('#applyDiscountBtn').click();

    //Assertions
    cy.get('#subtotal')
        .should('contain.text', '100.00');

    cy.get('#total')
        .should('be.visible')
        .and('contain.text', '90.00');

    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Applied save10');
  });

  it("TC11 - Apply valid uppercase discount code SAVE20 with subtotal greater or equal to 50 with active previous discount code", () => {
    //Precondition:
    cy.addProduct(1, 2, 50);
    cy.get('#discountCode').type('save10');
    cy.get('#applyDiscountBtn').click();

    //Testing the new discount code
    cy.get('#discountCode').clear().type('SAVE20');
    cy.get('#applyDiscountBtn').click();

    //Assertions
    cy.get('#subtotal')
        .should('contain.text', '100.00');

    cy.get('#total')
        .should('be.visible')
        .and('contain.text', '80.00');

    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Applied SAVE20');
  });

  it.skip("TC12 - Attempt to apply SAVE20 when subtotal is below the $50 threshold", () => {
    //Precondition:
    cy.addProduct(1, 1, '49.99');

    cy.get('#discountCode').clear().type('SAVE20');
    cy.get('#applyDiscountBtn').click();

    //Assertions
    cy.get('#subtotal')
        .should('contain.text', '49.99');

    cy.get('#total')
        .should('be.visible')
        .and('contain.text', '49.99');

    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Invalid discount for subtotal amount');
  });


  it("TC13 - Apply invalid uppercase discount code WHATEVER with subtotal equals to 50", () => {
    //Precondition:
    cy.addProduct(1, 1, '50');

    cy.get('#discountCode').clear().type('WHATEVER');
    cy.get('#applyDiscountBtn').click();

    //Assertions
    cy.get('#subtotal')
        .should('contain.text', '50.00');

    cy.get('#total')
        .should('be.visible')
        .and('contain.text', '50.00');

    cy.get('#message')
        .should('be.visible')
        .and('contain.text', 'Invalid code');
  });

  it("TC14 - Verify cart total cannot be negative and floors at $0.00 when discount exceeds subtotal", () => {
    //Precondition:
    cy.addProduct(1, 1, '100');

    // Apply a $20 discount (20% of $100)
    cy.get('#discountCode').type('SAVE20');
    cy.get('#applyDiscountBtn').click();

    // Now remove the item — subtotal drops to $0, but discount stays at $20
    cy.get('#removeId').type('1');
    cy.get('#removeBtn').click();

    cy.get('#total').invoke('text').then(
        (text) => {
            const total = parseFloat(text);
            expect(total).to.be.at.least(0);
        }
    );
  });

  it.skip("TC15 - Verify checkout succeeds when cart is active", () => {
        // Precondition: Cart contains 1 item @ $10.00
        cy.addProduct(1, 1, '10');

        // Trigger checkout
        cy.get('#checkoutBtn').click();

        // Verify confirmation and total reported in message
        cy.get('#message')
            .should('be.visible')
            .and('contain.text', 'Checkout success')
            .and('contain.text', '$10.00');
        
        // Verify cart items are cleared
        cy.get('#itemList li').should('not.exist');

        // Verify subtotal/total reset to 0 (if cart.js resets summary display)
        cy.get('#subtotal').should('contain.text', '$0');
    });

  it("blocks checkout on an empty cart (should catch a bug)", () => {
    //Assert the cart is empty first.
    cy.get('#itemList').children().should('have.length', 0);

    cy.get('[id="checkoutBtn"]').click();

    cy.get('[id="message"]')
        .should('be.visible')
        .and('contain', /empty/i);
  });

  it("Discount not recalculated when subtotal grows", () => {
    /*
    Add item ($30,
        doesn't qualify for
        SAVE20 — use
        SAVE10 instead), then
        add another item
        pushing subtotal ≥
        $50
    */
    cy.get('[id="productId"]').type('1');
    cy.get('[id="quantity"]').type('1');
    cy.get('[id="price"]').type('30');
    cy.get('[id="addBtn"]').click();

    cy.get('[id="discountCode"]').type('SAVE10');
    cy.get('[id="applyDiscountBtn"]').click();

    cy.get('[id="message"]')
        .should('be.visible')
        .and('contain.text', 'Applied SAVE10');
    
    cy.get('[id="subtotal"]').should('contain.text', '30.00');
    cy.get('[id="total"]').should('contain.text', '27.00');

    // Item 2: pushes subtotal to $55
    cy.get('[id="productId"]').clear().type('2');
    cy.get('[id="quantity"]').clear().type('1');
    cy.get('[id="price"]').clear().type('25');
    cy.get('[id="addBtn"]').click();

    cy.get('[id="message"]')
        .should('be.visible')
        .and('contain.text', 'Added 2');
    cy.get('[id="subtotal"]').should('contain.text', '55.00'); // subtotal DOES update correctly
    
    cy.get('[id="total"]').invoke('text').then(
    (text) => {
        const total = parseFloat(text);
        expect(total).to.equal(49.50);
    }
    );
  });
});