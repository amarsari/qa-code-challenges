### BUG-03: Account Remains Locked And Counter Fails To Reset Upon Clicking "Forgot Password"

- **Defect ID:** `BUG-03`
- **Traceability Ref:** Test Cases TC07, TC12 | Rule R07
- **Severity:** Major (Functional recovery mechanism failure / user lockout block)
- **Priority:** P1 (High urgency — locked users cannot recover access via self-service password reset)
- **Component:** Password Recovery / State Management
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`login.html`)

#### Description
When an account enters the locked state after three consecutive failed authentication attempts, triggering the 'Forgot Password' action fails to unlock the account and also fails to reset the counter. The user remains in the locked state despite executing the authorized recovery flow.

#### Preconditions
- Application loaded at `http://localhost:8080/login.html`.
- Account is in the locked state (counter = 3, status = Locked).

#### Steps to Reproduce
1. Navigate to the login page (http://localhost:8080/login.html)
2. Enter invalid credentials three consecutive times to trigger account lockout.   
3. Confirm status displays Locked and failed attempts counter is 3.   
4. Click the Forgot Password button (#forgotBtn).

#### Expected Result
- Account state becomes unlocked. It transitions to Login Screen state.
- Counter resets to 0.
- Message displays 'Password Resent'.
- Active cooldown timer is cleared.

#### Actual Result
- Account remains in Locked state.
- Counter resets to 1.
- Message displays 'Invalid Credentials'.

#### Automated Test Failure Trace
```text
assertexpected <span#status> to have text LoginScreen, but the text was Locked
AssertionError Timed out retrying after 4000ms: expected '<span#status>' to have text 'LoginScreen', but the text was 'Locked'