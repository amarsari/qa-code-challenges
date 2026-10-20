# Challenge 02: Login & Account Lockout Validation

## Objective
Analyze the authentication and account lockout specifications, design a complete test suite covering all functional, boundary, and state-transition rules, and build an automated test suite to identify latent bugs in the implementation.

---

## System Under Test (SUT)

The application consists of an authentication module (`login.html` and `login.js`) supporting:
- User authentication with username and password.
- Failed attempt tracking with a visible attempt counter.
- Automatic account lockout enforcement upon consecutive failed attempts.
- Time-based automatic unlock via a 5-minute cooldown timer.
- Self-service account recovery via a "Forgot Password" flow.
- Session termination via logout.

---

## Business Rules

1. **Successful Authentication (`R01`)**:
   - Submitting valid credentials authenticates the user, transitions the system to the `LoggedIn` state, displays `'Login Success'`, and sets the counter to `0`.
2. **Failed Attempt Tracking (`R02`, `R03`)**:
   - Submitting incorrect credentials displays `'Invalid Credentials'` and increments the failed-attempt counter by 1.
3. **Account Lockout (`R04`)**:
   - Reaching 3 consecutive failed attempts immediately locks the account, initiates a 5-minute cooldown timer, and displays `'Invalid Credentials. User Locked Out'`.
4. **Counter Reset on Success (`R05`)**:
   - A successful login resets the failed-attempt counter to `0`.
5. **Lockout Enforcement (`R06`)**:
   - While locked, all login attempts (valid or invalid) must be rejected with `'Invalid Credentials, Account locked out'`.
6. **Recovery via Forgot Password (`R07`)**:
   - Submitting "Forgot Password" immediately unlocks the account, cancels the active timer, resets the counter to `0`, and displays `'Password Resent'`.
7. **Time-Based Auto-Unlock (`R08`)**:
   - After the 5-minute cooldown period expires, the account automatically returns to the unlocked `LoginScreen` state and resets the counter to `0`.
8. **Session Logout (`R09`)**:
   - Logging out terminates the session, returns the user to the `LoginScreen`, and leaves the counter untouched at `0`.

---

## Your Tasks
1. Model the authentication and lockout lifecycle using a state transition diagram.
2. Build decision tables covering unlocked authentication transitions, lockout gating, and recovery paths.
3. Write an IEEE 829-style test case specification (15 test cases).
4. Automate the test suite using Cypress E2E.
5. Identify, group by root cause, and document all latent bugs present in the codebase.

> **Ready to check your work?**  
> Explore the full analysis, test suite, and defect logs in [SOLUTION.md](./SOLUTION.md).