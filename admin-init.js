import { apiFetch } from './src/utils/api.js';

function showNotification(msg, type = 'success') {
    const note = document.getElementById('notification');
    note.textContent = msg;
    note.className = `notification ${type}`;
    note.style.display = 'block';
    console[type === 'success' ? 'log' : 'error'](msg);
    setTimeout(() => note.style.display = 'none', 3000);
}

(async function ensureAdmin() {
    try {
        const res = await apiFetch('/api/user/profile');
        if (!res.ok || !res.data.is_admin) {
            window.location.href = '/';
        }
    } catch {
        window.location.href = '/';
    }
})();

document.getElementById('btn-back').onclick = () => {
    window.location.href = '/';
};

document.getElementById('form-promote').onsubmit = async e => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    if (!username) {
        showNotification('Introdu un username.', 'error');
        return;
    }
    try {
        const res = await apiFetch('/api/admin/promote', {
            method: 'POST',
            body: JSON.stringify({ username })
        });
        if (res.ok) {
            showNotification(`Userul "${username}" a fost promovat la admin.`, 'success');
            e.target.reset();
        } else {
            showNotification(`Eroare: ${res.data?.error || res.status}`, 'error');
        }
    } catch (err) {
        showNotification(`Eroare network: ${err.message}`, 'error');
    }
};

document.getElementById('form-delete').onsubmit = async e => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    if (!username) {
        showNotification('Introdu un username.', 'error');
        return;
    }
    try {
        const res = await apiFetch('/api/admin/user', {
            method: 'DELETE',
            body: JSON.stringify({ username })
        });
        if (res.ok) {
            showNotification(`Userul "${username}" a fost șters.`, 'success');
            e.target.reset();
        } else {
            showNotification(`Eroare: ${res.data?.error || res.status}`, 'error');
        }
    } catch (err) {
        showNotification(`Eroare network: ${err.message}`, 'error');
    }
};
