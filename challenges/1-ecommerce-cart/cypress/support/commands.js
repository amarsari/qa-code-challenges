Cypress.Commands.add('addProduct', (productId, quantity, price) =>{
    if(productId !== undefined ) cy.get('[id="productId"]').type(`${productId}`);
    if (quantity !== undefined) cy.get('[id="quantity"]').type(`${quantity}`);
    if (price !== undefined) cy.get('[id="price"]').type(`${price}`);
    cy.get('[id="addBtn"]').click();
} );