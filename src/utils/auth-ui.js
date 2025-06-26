import { apiFetch } from './api.js';
import { t } from '../i18n/i18n.js';

export function renderLoginForm() {
    const authForm = document.getElementById('auth-form');
    if (!authForm) return;
    authForm.setAttribute('data-auth-mode', 'login');
    authForm.innerHTML = `
      <h2>${t('auth.login_title')}</h2>
      <label>${t('auth.username')}<br><input name="username" type="text" required></label>
      <label>${t('auth.password')}<br><input name="password" type="password" required></label>
      <button type="submit">${t('auth.login_btn')}</button>
      <p>${t('auth.signup_link')}</p>
    `;
    authForm.querySelector('#show-signup').onclick = e => {
        e.preventDefault();
        renderSignupForm();
    };
}

function renderSignupForm() {
    const authForm = document.getElementById('auth-form');
    if (!authForm) return;
    authForm.setAttribute('data-auth-mode', 'signup');
    authForm.innerHTML = `
      <h2>${t('auth.signup_title')}</h2>
      <label>${t('auth.username')}<br><input name="username" type="text" required></label>
      <label>${t('auth.email')}<br><input name="email" type="email" required></label>
      <label>${t('auth.password')}<br><input name="password" type="password" required></label>
      <button type="submit">${t('auth.signup_btn')}</button>
      <p>${t('auth.login_link')}</p>
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
        const mode = authForm.getAttribute('data-auth-mode');
        const url = mode === 'login' ? '/api/user/login' : '/api/user/register';

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
