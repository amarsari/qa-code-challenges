
Cypress.Commands.add('attemptLogin', (login, pwd) => {
    if (login !== undefined) cy.get('[id="loginInput"]').clear().type(login);
    if (pwd !== undefined) cy.get('[id="pwdInput"]').clear().type(pwd);
    cy.get('[id="loginBtn"]').click();
});

Cypress.Commands.add('assertLoginState', (status, counter, message) => {
    cy.get('[id="status"]').should('have.text', status);
    cy.get('[id="counter"]').should('contain', counter);
    if( message !== undefined) cy.get('[id="message"]').should('be.visible').and('contain', message);
});