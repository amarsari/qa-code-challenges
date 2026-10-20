### BUG-01: Account Lockout Bypassed by Entering Valid Credentials During Active Cooldown

- **Defect ID:** `BUG-01`
- **Traceability Ref:** Test Cases `TC04`, `TC06a`, `TC10` | Rules `R04`, `R06`
- **Severity:** Critical
- **Priority:** P1
- **Component:** Login Engine 
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`login.html`)

#### Description
When account is unlocked, and counter equals 2, meaning there were 2 previous failed attempt to login, attemp to insert valid username and invalid password to trigger a third failed attempt in a row, thus locking the account properly, however when attempting to insert valid username and valid password before cooldown timer is up, counter resets and message displayed is 'Login Success' instead of 'Invalid Credentials. User Locked Out'.

#### Preconditions
- Application loaded at `http://localhost:8080/login.html`.
- Account is in an initial unlocked state (`failed-attempt counter = 0`).

#### Steps to Reproduce
1. Navigate to the login page (http://localhost:8080/login.html)
2. Enter valid username (correctlogin) and invalid password (wrongpwd) 3 consecutive times to trigger lockout.
3. Verify the account is locked with counter at 3.
4. Immediately (before the 5-minute cooldown timer expires), enter valid username (correctlogin) and valid password (correctpwd).   
5. Click Log In (#loginBtn).

#### Expected Result
- Login attempt is rejected.
- User remains unauthenticated on the login screen.
- Status message remains 'Invalid Credentials. User Locked Out' (or 'Account locked').
- Cooldown timer remains active.

#### Actual Result
- System bypasses the active lock state and authenticates the user.   
- UI displays 'Login Success'.
- User enters authenticated state before timer cooldown elapses.

#### Automated Test Failure Trace
```text
assertexpected <p#message> to contain Invalid Credentials. User Locked Out
AssertionError
Timed out retrying after 4000ms: expected '<p#message>' to contain 'Invalid Credentials. User Locked Out'
```