import { apiFetch } from './api.js';

export async function initProfileUI() {
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;


    function renderGreeting(username) {
        let span = document.getElementById('user-greeting');
        if (!span) {
            span = document.createElement('span');
            span.id = 'user-greeting';
            span.style.color = '#fff';
            span.style.marginLeft = '1rem';

            loginBtn.insertAdjacentElement('afterend', span);
        }
        span.textContent = `Hi, ${username}`;
    }

    try {
        const res = await apiFetch('/api/user/profile');
        if (res.ok && res.data && res.data.username) {
            renderGreeting(res.data.username);
        }
    } catch (err) {
        console.warn('Could not load user profile:', err);
    }

    window.addEventListener('auth-changed', async () => {
        try {
            const r2 = await apiFetch('/api/user/profile');
            if (r2.ok && r2.data && r2.data.username) {
                renderGreeting(r2.data.username);
            } else {
                const old = document.getElementById('user-greeting');
                if (old) old.remove();
            }
        } catch (_) {}
    });
}
