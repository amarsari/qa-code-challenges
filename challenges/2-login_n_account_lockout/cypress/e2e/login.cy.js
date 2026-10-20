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

  it("TC01 - Successful Login With Correct Login and Correct Password", () => {
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.assertLoginState('LoggedIn', 0, 'Login Success');
  });

  it("TC02 - Failed Login With Correct Login and Incorrect Password", () => {
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.assertLoginState('LoginScreen', 1, 'Invalid Credentials');
  });

  it("TC03 - Consecutive Failed Login With Correct Login and Incorrect Password", () => {
    cy.attemptLogin('correctlogin','wrongpwd');
    cy.attemptLogin('correctlogin','wrongpwd');
    cy.assertLoginState('LoginScreen', 2, 'Invalid Credentials');
  });

  it("TC04 - 3 Consecutive Failed Login With Correct Login and Incorrect Password", () => {
    cy.clock(); //Freeze time at the start

    cy.attemptLogin('correctlogin','wrongpwd');
    cy.attemptLogin('correctlogin','wrongpwd');
    cy.attemptLogin('correctlogin','wrongpwd');
    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');

    //Prove cooldown is active: fast-forward time by 4m59s
    cy.tick(299000);
    cy.attemptLogin('correctlogin','correctpwd');
    cy.get('#message').should('contain', 'Invalid Credentials. User Locked Out');
    
  });

  it("TC05 - Successful Login With Correct Login and Correct Password After 2 Incorrect Attempts", () => {
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.assertLoginState('LoggedIn', 0, 'Login Success');
  });

  it("TC06a - Submitting Correct Password With Locked Account", () => {
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');
  });

  it("TC06b - Submitting Incorrect Password With Locked Account", () => {
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.assertLoginState('Locked', '4', 'Invalid Credentials. User Locked Out');
  });

  it("TC07 - Submitting Forgot Password", () => {
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.get('#forgotBtn').click();
    //Account becomes unlocked; Counter resets to 0; Message: 'Password Resent', Login Screen is displayed; Active cooldown timer is cleared
    cy.assertLoginState('LoginScreen', 0, 'Password Resent');
  });

  it("TC08 - Waiting 5 Minutes To Unlock Account", () => {
    cy.clock(); //Freeze time at the start
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    
    cy.tick(300000); //Fast-forward time by 5 minutes
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.assertLoginState('LoggedIn', 0, 'Login Success');
  });

  it("TC09 - Loggin Out While Logged In", () => {
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.get('#logoutBtn').click();
    cy.assertLoginState('LoginScreen', 0, 'Logged Out Successfully');
  });

  it("TC10 - Timer Boundary: Attempting Login Just Before 5 Minutes (e.g. 4m 59s)", () => {
    cy.clock(); //Freeze time at the start
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    cy.attemptLogin('correctlogin', 'wrongpwd');
    
    cy.tick(299000); //Fast-forward time by 4 minutes and 59 seconds
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.assertLoginState('Locked', '3', 'Invalid Credentials. User Locked Out');
  });

  it("TC11 - End-to-End Recovery Flow: Successful Login After 5-Minute Timer Expiry", () => {
    // Precondition: Account was locked; full 5 minutes have elapsed (account auto-unlocked, counter reset to 0).
    // Action Input: User submits valid username and valid password.

    cy.clock(); //Freeze time at the start
    cy.lockAccount(); //Lock the account with 3 failed attempts

    cy.tick(300000); //Fast-forward time by 5 minutes
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.assertLoginState('LoggedIn', 0, 'Login Success');
  });

  it("TC12 - End-to-End Recovery Flow: Successful Login After Forgot Password Flow", () => {
    // Precondition: Account was locked; user clicked ""Forgot Password"" (account unlocked, counter reset to 0).
    // Action Input: User enters valid credentials.

    cy.lockAccount();
    cy.get('#forgotBtn').click();
    cy.attemptLogin('correctlogin', 'correctpwd');
    cy.assertLoginState('LoggedIn', 0, 'Login Success');
  });

  it("TC13 - Input Validation / Error State: Empty Password Field", () => {
    // Precondition: Account unlocked, counter = 0.
    // Action Input: Valid username, empty password ("""")."

    cy.attemptLogin('correctlogin', '');
    cy.assertLoginState('LoginScreen', 1, 'Invalid Credentials');
  });

  it("TC14 - Input Validation / Error State: Empty Username / Non-Existent User", () => {
    // Precondition: On login screen. Account unlocked
    // Action Input: Empty username ("""") or unknown user, any password."

    cy.attemptLogin('', 'correctpwd');
    cy.assertLoginState('LoginScreen', 1, 'Invalid Credentials');
  });

  it("TC15 - Edge Case: Password Case Sensitivity", () => {
    // Precondition: Account unlocked, counter = 0 (known valid password e.g., SecretPass123).
    // Action Input: Valid username, wrong case password (e.g., secretpass123)."

    cy.attemptLogin('correctlogin', 'CorrectPWD');
    cy.assertLoginState('LoginScreen', 1, 'Invalid Credentials');
  });
});