/*
Challenge: Login & Account Lockout
The System Under Test

A login form with these rules:

A user has an account with a correct password.
Entering the correct password logs them in successfully.
Entering an incorrect password shows an error and increments a failed-attempt counter.
After 3 consecutive failed attempts, the account locks. While locked, even the correct password is rejected, with a "account locked" message.
A successful login resets the failed-attempt counter to 0.
The lock lasts 5 minutes, after which the counter resets and the account unlocks automatically.
There's a "Forgot Password" flow: submitting it while locked immediately unlocks the account and resets the counter, regardless of the 5-minute timer.
Logging out while logged in returns to the login screen with the counter untouched (still 0, since the last login was successful).

Setup notes
Credentials: username correctlogin, password correctpwd.
Element IDs: loginInput, pwdInput, loginBtn, forgotBtn, logoutBtn, counter, status, message, loggedInPanel.
#status reflects the current state name directly (LoginScreen / LoggedIn / Locked) — useful for asserting on state, not just messages.
*/

describe("Login & Account Lockout", () => {
  beforeEach(() => {
    cy.visit("/login.html");
  });

  it("TC0101 Rejects login with invalid password.", () => {
    //Input data
    cy.attemptLogin('wrongLogin', 'wrongPwd');
    
    //Assert state, counter and message
    cy.assertLoginState('LoginScreen', '1', 'Invalid Credentials');
  });

  it("TC0102 Rejects login with invalid credentials, empty login", () =>{
    cy.attemptLogin( undefined, 'wrongPwd');

    //Assert state, counter and message
    cy.assertLoginState('LoginScreen', '1', 'Invalid Credentials');
  });

  it("TC0103 Rejects login with invalid credentials, empty pwd", () => {
    //Input data
    cy.attemptLogin( 'wrongLogin', undefined);
    
    //Assert state, counter and message
    cy.assertLoginState('LoginScreen', '1', 'Invalid Credentials');
  });

  it("TC02 Successful Login", () => {
    cy.attemptLogin('correctlogin', 'correctpwd');

    cy.assertLoginState('LoggedIn', '0', 'Login Success');
  });

  it("TC0301 User types invalid credentials twice. System should not lock out user.", () =>{
    for (let i = 0; i < 2; i++) {
      cy.attemptLogin('correctLogin','wrongPwd');
    }

    cy.assertLoginState('LoginScreen', '2', 'Invalid Credentials');
  });

  it("TC0302 User gets locked out, no login is possible", () =>{
    for (let i = 0; i < 3; i++) cy.attemptLogin('wrongLogin', 'wrongPwd');

    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');
  });

  it("TC0401 User clicks on “Forgot Password”.", () =>{
    cy.get('[id="forgotBtn"]').click();

    cy.assertLoginState('LoginScreen', '0', 'Password Resent');
  });

  it("TC0402 Incorrect log in and password after counter resets", () => {
    for (let i = 0; i < 2; i++) cy.attemptLogin('wrongLogin', 'wrongPwd');

    cy.get('[id="forgotBtn"]').click();

    cy.attemptLogin('wrongLogin', 'wrongPwd');

    cy.assertLoginState('LoginScreen','1', 'Invalid Credentials');
  });

  it("TC05 Testing log out upon successful login", () => {
    cy.attemptLogin('correctlogin', 'correctpwd');

    cy.assertLoginState('LoggedIn', '0', 'Login Success');

    cy.get('[id="logoutBtn"]').click();

    cy.assertLoginState('LoginScreen', '0', 'Logged Out Successfully');
  });

  it("TC0601 Correct password gets rejected after user gets locked out", () =>{
    for (let i = 0; i < 3; i++) cy.attemptLogin('wrongLogin', 'wrongPwd');

    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');

    cy.attemptLogin('correctlogin', 'correctpwd');

    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');

    //Upon inputing valid credentials after user is locked out the system allows the login whereas it shouldn't.
    //Evidence is in last assertion where it should return message "Invalid Credentials. User Locked Out" instead of 
    // "Login Success"
  });

  it("TC0602 Incorrect password gets rejected after user gets locked out", () => {
    for (let i = 0; i < 3; i++) cy.attemptLogin('wrongLogin', 'wrongPwd');
    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');

    cy.attemptLogin('correctlogin', 'incorrectpwd');
    cy.assertLoginState('Locked', '3', 'Invalid Credentials, Account locked out');
  });

  it("TC07 Return to Login Screen once timer expires", () => {
    cy.clock();
    cy.reload();

    for (let i = 0; i < 3; i++) cy.attemptLogin('wrongLogin', 'wrongPwd');

    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');

    
    cy.tick(300000);

    cy.assertLoginState('LoginScreen', '0', undefined);

    //Counter remains at 3 instead of updating to 0
  });

  it("TC08 Test forgot password flow when user account is locked out", () => {
    for (let i = 0; i < 3; i++) cy.attemptLogin('wrongLogin', 'wrongPwd');

    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');

    cy.get('[id="forgotBtn"]').click();

    cy.assertLoginState('LoginScreen','0', 'Password Resent');

    //Status is not updating upon account lock out is lifted. It should be LoginScreen instead of Locked
  });
});