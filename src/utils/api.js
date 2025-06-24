const API_BASE = window.location.origin;

export async function apiFetch(path, opts = {}) {
    const token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        ...opts.headers,
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
    };

    const res = await fetch(`${API_BASE}${path}`, {
        ...opts,
        headers
    });

    if (res.status === 401) {
        if (token) {
            localStorage.removeItem('jwt');
            window.dispatchEvent(new Event('auth-changed'));
        }
        throw new Error('Unauthorized');
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
        res.data = await res.json();
    }

    return res;
}
