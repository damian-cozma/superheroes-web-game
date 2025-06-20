import { levels }              from './src/config/levels-config.js';
import { Main }                from './src/systems/main.js';
import { loadTranslations, t } from './src/i18n/i18n.js';
import { initAuthUI, renderLoginForm } from './src/utils/auth-ui.js';
import { apiFetch }            from './src/utils/api.js';

let lastFinishedLevel = 0;
const MAX_LEVEL       = Object.keys(levels).length;

const menu        = document.getElementById('main-menu');
const canvas      = document.getElementById('canvas');
const music       = document.getElementById('menu-music');
const soundToggle = document.getElementById('sound-toggle');
const muteSvg     = document.getElementById('mute-svg');
const btnRO       = document.getElementById('lang-ro');
const btnENG      = document.getElementById('lang-eng');

const endScreen = document.getElementById('end-screen');
const endBtn    = document.getElementById('btn-end-to-menu');

endBtn.onclick = () => {
    endScreen.classList.remove('visible');
    menu.style.display   = '';
    canvas.style.display = 'none';
};

window.addEventListener('story-complete', () => {
    document.getElementById('end-title').textContent = t('story.completed');
    document.getElementById('btn-end-to-menu').textContent = t('story.back_to_menu');
    endScreen.classList.add('visible');
});

let soundOn = false;
function playMenuMusic() {
    if (music.paused) {
        music.volume = 0.18;
        music.play().catch(() => {});
    }
}
function updateSoundIcon() {
    muteSvg.style.display = soundOn ? 'none' : 'block';
}
soundToggle.onclick = () => {
    soundOn ? music.pause() : playMenuMusic();
    soundOn = !soundOn;
    updateSoundIcon();
};

async function setLanguage(lang) {
    await loadTranslations(lang);
    document.getElementById('btn-story').textContent       = t('menu.continue');
    document.getElementById('btn-endless').textContent     = t('menu.endless');
    document.getElementById('btn-leaderboard').textContent = t('menu.leaderboard');

    if (endScreen.classList.contains('visible')) {
        document.getElementById('end-title').textContent = t('story.completed');
        document.getElementById('btn-end-to-menu').textContent = t('story.back_to_menu');
    }
    Main.setLang(lang);
}
btnRO.onclick  = () => setLanguage('ro');
btnENG.onclick = () => setLanguage('eng');

document.getElementById('btn-story').onclick = () => {
    const nextLevel = Math.min(lastFinishedLevel + 1, MAX_LEVEL);

    if (lastFinishedLevel >= MAX_LEVEL) {
        document.getElementById('end-title').textContent = t('story.completed');
        document.getElementById('btn-end-to-menu').textContent = t('story.back_to_menu');
        endScreen.classList.add('visible');
        return;
    }

    menu.style.display   = 'none';
    canvas.style.display = '';
    const ctx = canvas.getContext('2d');
    ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    Main.start(nextLevel, Main._lang);
};
document.getElementById('btn-endless').onclick     = playMenuMusic;
document.getElementById('btn-leaderboard').onclick = playMenuMusic;

const userMenu     = document.getElementById('user-menu');
const userBtn      = document.getElementById('user-btn');
const userNameSpan = document.getElementById('user-name');
const userAction   = document.getElementById('user-action-btn');
const authModal    = document.getElementById('auth-modal');
const authClose    = document.getElementById('auth-close');

userBtn.onclick = e => {
    e.stopPropagation();
    userMenu.classList.toggle('open');
};
document.addEventListener('click', e => {
    if (!userMenu.contains(e.target)) userMenu.classList.remove('open');
});
authClose.onclick = () => authModal.classList.remove('visible');

function updateUserUI(profile) {
    if (profile && profile.username) {
        userNameSpan.textContent = profile.username;
        userAction.textContent   = 'Log Out';
        userAction.onclick = () => {
            localStorage.removeItem('jwt');
            window.dispatchEvent(new Event('auth-changed'));
            userMenu.classList.remove('open');
        };
    } else {
        userNameSpan.textContent = 'User';
        userAction.textContent   = 'Log In';
        userAction.onclick = () => {
            document.getElementById('auth-form').innerHTML = '';
            renderLoginForm();
            authModal.classList.add('visible');
            userMenu.classList.remove('open');
        };
    }
}

async function refreshProfile() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        lastFinishedLevel = 0;
        updateUserUI(null);
        return;
    }
    try {
        const res = await apiFetch('/api/user/profile');
        if (res.ok && typeof res.data.levels_finished === 'number') {
            lastFinishedLevel = res.data.levels_finished;
        } else {
            lastFinishedLevel = 0;
        }
        updateUserUI(res.ok ? res.data : null);
    } catch {
        lastFinishedLevel = 0;
        updateUserUI(null);
    }
}

window.addEventListener('auth-changed', refreshProfile);

window.addEventListener('DOMContentLoaded', async () => {
    await setLanguage('ro');
    playMenuMusic();
    initAuthUI();
    refreshProfile();
});
