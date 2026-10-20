### BUG-04: Cooldown Timer Auto Unlock Failure

- **Defect ID:** `BUG-04`
- **Traceability Ref:** Test Cases `TC08`, `TC10`, `TC11` | Rule `R08`
- **Severity:** Major (Authentication recovery mechanism failure / permanent lockout condition)
- **Priority:** P1 (High urgency — denies legitimate users system access after lockout period)
- **Component:** Cooldown Timer / State Management
- **Environment:** Chrome / Cypress E2E Runner / Localhost (`login.html`)

#### Description
When the 5-minute cooldown timer expires the system remains in a Locked state, valid authentication gets rejected and counter is not reset properly.

#### Preconditions
- Application loaded at `http://localhost:8080/login.html`.
- Account is in the locked state (counter = 3, status = Locked).

#### Steps to Reproduce
1. Navigate to the login page (http://localhost:8080/login.html)
2. Enter invalid credentials three consecutive times to trigger account lockout.   
3. Confirm status displays Locked and failed attempts counter is 3.   
4. Wait 5-minute cooldown timer to elapse.
5. Trigger timer evaluation (e.g., attempt interaction or observe auto-refresh state).

#### Expected Result
- Account becomes unlocked automatically transitioning to 'LoginScreen'.
- Counter resets to 0.
- User can successfully authenticate using valid credentials.

#### Actual Result
- Account remains in the locked state past the 5-minute window.
- Failed attempts counter fails to reset to `0` (observed at `1` or unreset).
- Legitimate authentication attempts remain blocked.

#### Automated Test Failure Trace
```text
   assertexpected <span#counter> to contain '0'
AssertionError Timed out retrying after 4000ms: expected '<span#counter>' to contain '0'
```