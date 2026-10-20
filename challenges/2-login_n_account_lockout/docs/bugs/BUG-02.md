### BUG-02: Counter Not Resetting When Successful Login Is Applied After Failed Attempts Before User Gets Locked Out

- **Defect ID:** `BUG-02`
- **Traceability Ref:** Test Cases `TC05`, `TC11`, `TC12` | Rules `R05`, `R07`, `R08`
- **Severity:** Major (Business logic / state corruption defect)
- **Priority:** P1 (High user impact — triggers unintended account lockouts)
- **Component:** Login Engine / State Management
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`login.html`)

#### Description
When an account has prior failed login attempts (e.g., counter = 2) and the user subsequently authenticates with valid credentials, the system logs the user in successfully but fails to reset the failed-attempt counter to 0. As a result, subsequent single login mistakes immediately trigger account lockout.

#### Preconditions
- Application loaded at `http://localhost:8080/login.html`.
- Account is in an initial unlocked state (`failed-attempt counter = 2`).

#### Steps to Reproduce
1. Navigate to the login page (http://localhost:8080/login.html).
2. Enter valid username (correctlogin) and valid password (correctpwd).
3. Click Log In (#loginBtn).

#### Expected Result
- User gets logged in successfully.
- Message displays 'Login Success'.
- Counter is 0.

#### Actual Result
- User gets logged in successfully.
- Message displays 'Login Success'.
- Counter is 1.

#### Automated Test Failure Trace
```text
assertexpected <span#counter> to contain '0'
AssertionError Timed out retrying after 4000ms: expected '<span#counter>' to contain '0'
```