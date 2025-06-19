import { apiFetch } from './api.js';

export function renderLoginForm() {
    const authForm = document.getElementById('auth-form');
    if (!authForm) return;
    authForm.innerHTML = `
      <h2>Log In</h2>
      <label>Username<br><input name="username" type="text" required></label>
      <label>Password<br><input name="password" type="password" required></label>
      <button type="submit">Log In</button>
      <p>Don't have an account? <a href="#" id="show-signup">Sign up</a></p>
    `;
    authForm.querySelector('#show-signup').onclick = e => {
        e.preventDefault();
        renderSignupForm();
    };
}

function renderSignupForm() {
    const authForm = document.getElementById('auth-form');
    if (!authForm) return;
    authForm.innerHTML = `
      <h2>Sign Up</h2>
      <label>Username<br><input name="username" type="text" required></label>
      <label>Email<br><input name="email" type="email" required></label>
      <label>Password<br><input name="password" type="password" required></label>
      <button type="submit">Create Account</button>
      <p>Already have an account? <a href="#" id="show-login">Log in</a></p>
    `;
    authForm.querySelector('#show-login').onclick = e => {
        e.preventDefault();
        renderLoginForm();
    };
}

function handleLogout() {
    localStorage.removeItem('jwt');
    window.dispatchEvent(new Event('auth-changed'));
}

export function initAuthUI() {
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-close');
    const authForm  = document.getElementById('auth-form');

    authForm.onsubmit = async event => {
        event.preventDefault();
        const data   = Object.fromEntries(new FormData(authForm).entries());
        const isLog  = authForm.querySelector('h2').textContent === 'Log In';
        const url    = isLog ? '/api/user/login' : '/api/user/register';

        try {
            const res    = await apiFetch(url, {
                method: 'POST',
                body:   JSON.stringify(data)
            });
            const result = res.data;
            if (!res.ok) throw new Error(result.error || 'Request failed');

            localStorage.setItem('jwt', result.token);
            window.dispatchEvent(new Event('auth-changed'));

            authModal.classList.remove('visible');
            authForm.innerHTML = '';
        } catch (err) {
            alert(err.message);
        }
    };

    authClose.onclick = () => {
        authModal.classList.remove('visible');
        authForm.innerHTML = '';
    };

    window.addEventListener('storage', e => {
        if (e.key === 'jwt' && !e.newValue) {
            handleLogout();
        }
    });

    (async function restoreSession() {
        const token = localStorage.getItem('jwt');
        if (!token) return;
        try {
            const res = await apiFetch('/api/user/profile');
            if (!res.ok) {
                handleLogout();
            }
        } catch {
            handleLogout();
        }
    })();
}
