// app-init.js

import { levels } from './src/config/levels-config.js';
import { Main } from './src/systems/main.js';
import { loadTranslations, t } from './src/i18n/i18n.js';
import { initAuthUI, renderLoginForm } from './src/utils/auth-ui.js';
import { EndlessRunner } from './src/endless/endless-runner.js';
import { apiFetch } from './src/utils/api.js';
import {
    initTouchControls,
    showTouchControlsBar,
    setTouchControlsVisibility,
    isTouchDevice
} from './src/systems/touch-controls.js';

let lastFinishedLevel = 0;
const MAX_LEVEL = Object.keys(levels).length;

const menu = document.getElementById('main-menu');
const canvas = document.getElementById('canvas');
const music = document.getElementById('menu-music');

const soundToggle = document.getElementById('sound-toggle');
const muteSvg = document.getElementById('mute-svg');
const btnRO = document.getElementById('lang-ro');
const btnENG = document.getElementById('lang-eng');
const endScreen = document.getElementById('end-screen');
const endBtn = document.getElementById('btn-end-to-menu');
const lbScreen = document.getElementById('leaderboard-screen');
const lbList = document.getElementById('leaderboard-list');
const backBtn = document.getElementById('btn-back-to-menu');
const btnStory = document.getElementById('btn-story');
const btnEndless = document.getElementById('btn-endless');
const btnLeaderboard = document.getElementById('btn-leaderboard');
const userMenu = document.getElementById('user-menu');
const userBtn = document.getElementById('user-btn');
const userNameSpan = document.getElementById('user-name');
const userAction = document.getElementById('user-action-btn');
const authModal = document.getElementById('auth-modal');
const authClose = document.getElementById('auth-close');
const uiDropdownTrigger = document.getElementById('ui-dropdown-trigger');
const uiDropdown = document.getElementById('ui-dropdown');

endBtn.onclick = () => {
    endScreen.classList.remove('visible');
    menu.style.display = '';
    canvas.style.display = 'none';
    showTouchControlsBar(false);
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
    await Main.setLang(lang);
    btnStory.textContent = t('menu.continue');
    btnEndless.textContent = t('menu.endless');
    btnLeaderboard.textContent = t('menu.leaderboard');
    backBtn.textContent = t('story.back_to_menu');
    document.getElementById('leaderboard-title').textContent = t('menu.leaderboard_title');
    if (endScreen.classList.contains('visible')) {
        document.getElementById('end-title').textContent = t('story.completed');
        document.getElementById('btn-end-to-menu').textContent = t('story.back_to_menu');
    }
    window.dispatchEvent(new Event('lang-changed'));
}
btnRO.onclick = () => setLanguage('ro');
btnENG.onclick = () => setLanguage('eng');


btnStory.onclick = () => {
    const nextLevel = Math.min(lastFinishedLevel + 1, MAX_LEVEL);
    if (lastFinishedLevel >= MAX_LEVEL) {
        document.getElementById('end-title').textContent = t('story.completed');
        document.getElementById('btn-end-to-menu').textContent = t('story.back_to_menu');
        endScreen.classList.add('visible');
        return;
    }
    menu.style.display = 'none';
    canvas.style.display = '';
    showTouchControlsBar(isTouchDevice());
    const ctx = canvas.getContext('2d');
    ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    Main.start(nextLevel, Main._lang);
};
btnEndless.onclick = () => {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    showTouchControlsBar(isTouchDevice());
    setTimeout(() => {
        setTouchControlsVisibility({ joystick: false, jump: true, interact: false, choices: false });
        const actionButtons = document.getElementById('action-buttons');
        if (actionButtons) {
            actionButtons.style.marginLeft = 'auto';
            actionButtons.style.marginRight = '0';
        }
    }, 0);
    EndlessRunner.start();
};

btnLeaderboard.onclick = async () => {
    menu.style.display = 'none';
    canvas.style.display = 'none';
    lbScreen.style.display = '';


    lbList.replaceChildren(
        (() => {
            const li = document.createElement('li');
            li.textContent = 'Loading…';
            return li;
        })()
    );

    document.getElementById('leaderboard-title').textContent = t('menu.leaderboard_title');

    try {
        const res = await apiFetch('/api/leaderboard');
        if (!res.ok) throw new Error(res.status);
        const data = res.data;

        lbList.replaceChildren(
            ...data.map((u, i) => {
                const li = document.createElement('li');
                li.textContent = `${i + 1}. ${u.username} — ${u.best_score} m`;
                return li;
            })
        );
    } catch (e) {

        lbList.replaceChildren(
            (() => {
                const li = document.createElement('li');
                li.textContent = 'Nu am putut încărca clasamentul.';
                return li;
            })()
        );
    }
};


backBtn.onclick = () => {
    lbScreen.style.display = 'none';
    menu.style.display = '';
    showTouchControlsBar(false);
};

document.getElementById('btn-admin-back').onclick = () => {
    hideAllScreens();
    document.getElementById('main-menu').style.display = '';
    showTouchControlsBar(false);
};

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
        userAction.textContent = 'Log Out';
        userAction.style.display = '';
        userAction.onclick = () => {
            localStorage.removeItem('jwt');
            window.dispatchEvent(new Event('auth-changed'));
            userMenu.classList.remove('open');
            window.location.reload(); // refresh la delogare pentru a elimina butonul Admin
        };
        userMenu.classList.add('logged-in');
        if (!userMenu.contains(userAction)) {
            userMenu.appendChild(userAction);
        }
        userBtn.onclick = e => {
            e.stopPropagation();
            userMenu.classList.toggle('open');
        };
    } else {
        userNameSpan.textContent = 'User';
        userAction.style.display = 'none';
        userMenu.classList.remove('logged-in');
        userBtn.onclick = e => {
            e.stopPropagation();
            document.getElementById('auth-form').innerHTML = '';
            renderLoginForm();
            authModal.classList.add('visible');
            userMenu.classList.remove('open');
        };
    }
}

function hideAllScreens() {
    document.getElementById('main-menu').style.display          = 'none';
    document.getElementById('canvas').style.display             = 'none';
    document.getElementById('leaderboard-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display       = 'none';
    showTouchControlsBar(false);
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

        if (res.ok && res.data.is_admin) {
            const adminBtn = document.createElement('button');
            adminBtn.id = 'btn-admin';
            adminBtn.textContent = 'Admin';
            document.getElementById('main-menu').append(adminBtn);
            adminBtn.onclick = () => {
                 window.location.href = '/admin.html';
            };
        }
    } catch {
        lastFinishedLevel = 0;
        updateUserUI(null);
    }
}

window.addEventListener('auth-changed', () => {
    refreshProfile();
});

window.addEventListener('DOMContentLoaded', async () => {
    await setLanguage('ro');
    document.getElementById('btn-end-to-menu').textContent = t('story.back_to_menu');
    document.getElementById('end-title').textContent = t('story.completed');
    playMenuMusic();
    initAuthUI();
    initTouchControls();
    refreshProfile();
});

uiDropdownTrigger.onclick = e => {
    uiDropdown.classList.toggle('open');
    e.stopPropagation();
};
document.addEventListener('click', e => {
    if (!uiDropdown.contains(e.target) && e.target !== uiDropdownTrigger) {
        uiDropdown.classList.remove('open');
    }
});

window.addEventListener('back-to-menu', () => {
    endScreen.classList.remove('visible');
    menu.style.display = '';
    canvas.style.display = 'none';
    showTouchControlsBar(false);
    Main._runningLoop = false;
    if (Main._rafId) {
        cancelAnimationFrame(Main._rafId);
        Main._rafId = null;
    }
});

window.addEventListener('lang-changed', () => {
    if (endScreen.classList.contains('visible')) {
        document.getElementById('end-title').textContent = t('story.completed');
        document.getElementById('btn-end-to-menu').textContent = t('story.back_to_menu');
    }

    const authModal = document.getElementById('auth-modal');
    if (authModal && authModal.classList.contains('visible')) {
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            const h2 = authForm.querySelector('h2');
            if (h2 && h2.textContent === t('auth.signup_title')) {
                import('./src/utils/auth-ui.js').then(m => m.renderSignupForm());
            } else {
                import('./src/utils/auth-ui.js').then(m => m.renderLoginForm());
            }
        }
    }
});