const CORRECT_LOGIN = "correctlogin";
const CORRECT_PWD = "correctpwd";
const LOCK_DURATION_MS = 5 * 60 * 1000;

class AuthService {
  constructor() {
    this.attempts = 0;
    this.locked = false;
    this.lockUntil = null;
    this.loggedIn = false;
  }

  checkTimerExpiry() {
    if (this.locked && this.lockUntil !== null && Date.now() >= this.lockUntil) {
      this.locked = false;
      this.lockUntil = null;
    }
  }

  attemptLogin(login, pwd) {
    this.checkTimerExpiry();

    if (login === CORRECT_LOGIN && pwd === CORRECT_PWD) {
      this.loggedIn = true;
      return { status: "success", message: "Login Success" };
    }

    if (this.locked) {
      return { status: "locked", message: "Invalid Credentials, Account locked out" };
    }

    this.attempts++;
    if (this.attempts >= 3) {
      this.locked = true;
      this.lockUntil = Date.now() + LOCK_DURATION_MS;
      return { status: "locked_now", message: "Invalid Credentials. User Locked Out" };
    }
    return { status: "invalid", message: "Invalid Credentials" };
  }

  forgotPassword() {
    this.attempts = 0;
    return { status: "reset", message: "Password Resent" };
  }

  logout() {
    this.loggedIn = false;
    return { status: "loggedout", message: "Logged Out Successfully" };
  }
}

const auth = new AuthService();

function render() {
  document.getElementById("counter").textContent = auth.attempts;
  document.getElementById("status").textContent = auth.locked
    ? "Locked"
    : auth.loggedIn
    ? "LoggedIn"
    : "LoginScreen";
  document.getElementById("loggedInPanel").style.display = auth.loggedIn ? "block" : "none";
}

function setMessage(text) {
  document.getElementById("message").textContent = text;
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const login = document.getElementById("loginInput").value;
  const pwd = document.getElementById("pwdInput").value;
  const result = auth.attemptLogin(login, pwd);
  setMessage(result.message);
  render();
});

document.getElementById("forgotBtn").addEventListener("click", () => {
  const result = auth.forgotPassword();
  setMessage(result.message);
  render();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  const result = auth.logout();
  setMessage(result.message);
  render();
});

setInterval(() => {
  auth.checkTimerExpiry();
  render();
}, 1000);

render();
