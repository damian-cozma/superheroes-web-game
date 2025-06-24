// src/systems/touch-controls.js

function simulateKey(key, down) {
    if (window.inputSystem && window.inputSystem.keys) {
        if (key === 'ArrowLeft') window.inputSystem.keys.left.pressed = down;
        if (key === 'ArrowRight') window.inputSystem.keys.right.pressed = down;
        if (key === ' ' || key === 'Spacebar') window.inputSystem.keys.jump.pressed = down;
        if (key === 'e') window.inputSystem.keys.interact.pressed = down;
    }
    const event = new KeyboardEvent(down ? 'keydown' : 'keyup', { key, bubbles: true, cancelable: true });
    window.dispatchEvent(event);
}

function bindTouchControlsEvents() {
    const touchJump = document.getElementById('touch-jump');
    const touchInteract = document.getElementById('touch-interact');
    const touchChoice1 = document.getElementById('touch-choice-1');
    const touchChoice2 = document.getElementById('touch-choice-2');

    if (touchJump && !touchJump._touchBound) {
        const press = e => { e.preventDefault(); simulateKey(e.currentTarget.dataset.key, true); };
        const release = e => { e.preventDefault(); simulateKey(e.currentTarget.dataset.key, false); };

        touchJump.dataset.key = ' ';
        touchInteract.dataset.key = 'e';
        touchChoice1.dataset.key = '1';
        touchChoice2.dataset.key = '2';

        [touchJump, touchInteract, touchChoice1, touchChoice2].forEach(btn => {
            if (btn) {
                ['pointerdown', 'touchstart'].forEach(evt => btn.addEventListener(evt, press));
                ['pointerup', 'pointerleave', 'touchend', 'touchcancel'].forEach(evt => btn.addEventListener(evt, release));
                btn._touchBound = true;
            }
        });
    }

    const container = document.getElementById('joystick-container');
    const knob = document.getElementById('joystick-knob');
    if (!container || container._joystickBound) return;

    let isActive = false;
    let originX;
    const maxRadius = container.clientWidth / 4;
    const deadzone = 5;

    const startJoystick = (e) => {
        isActive = true;
        knob.style.transition = 'transform 0s';
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        originX = touch.clientX;
        e.preventDefault();
    };

    const moveJoystick = (e) => {
        if (!isActive) return;
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        let deltaX = touch.clientX - originX;
        let moveX = Math.max(-maxRadius, Math.min(maxRadius, deltaX));
        
        knob.style.transform = `translateX(${moveX}px)`;

        if (moveX < -deadzone) {
            simulateKey('ArrowRight', false);
            simulateKey('ArrowLeft', true);
        } else if (moveX > deadzone) {
            simulateKey('ArrowLeft', false);
            simulateKey('ArrowRight', true);
        } else {
            simulateKey('ArrowLeft', false);
            simulateKey('ArrowRight', false);
        }
        e.preventDefault();
    };

    const stopJoystick = () => {
        if (!isActive) return;
        isActive = false;
        knob.style.transition = 'transform 0.1s';
        knob.style.transform = 'translate(0, 0)';
        simulateKey('ArrowLeft', false);
        simulateKey('ArrowRight', false);
    };

    container.addEventListener('pointerdown', startJoystick);
    window.addEventListener('pointermove', moveJoystick);
    window.addEventListener('pointerup', stopJoystick);
    window.addEventListener('pointercancel', stopJoystick);
    container.addEventListener('touchstart', startJoystick, { passive: false });
    window.addEventListener('touchmove', moveJoystick, { passive: false });
    window.addEventListener('touchend', stopJoystick);
    window.addEventListener('touchcancel', stopJoystick);
    container._joystickBound = true;
}

function setupTouchControlsBar() {
    if (document.getElementById('touch-controls-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'touch-controls-bar';
    bar.style.cssText = `
        position: fixed; left: 0; right: 0; bottom: 10px; height: 120px;
        z-index: 3000; display: flex; justify-content: space-between;
        align-items: center; padding: 0 20px; pointer-events: none;
        transition: opacity 0.2s;
    `;
    bar.innerHTML = `
        <div id="joystick-container" style="position: relative; width: 100px; height: 100px; background: rgba(75, 106, 90, 0.4); border-radius: 50%; pointer-events: auto; user-select: none;">
            <div id="joystick-knob" style="position: absolute; width: 50px; height: 50px; background: rgba(182, 250, 255, 0.7); border-radius: 50%; top: 25px; left: 25px; pointer-events: none; transition: transform 0.1s;"></div>
        </div>
        <div id="action-buttons" style="display: flex; gap: 20px; pointer-events: auto; user-select: none;">
            <button id="touch-interact" style="width: 80px; height: 80px; border-radius: 50%; background: #31443d; color: #7be382; font-size: 2rem; border: 2px solid #4b6a5a; cursor: pointer;">E</button>
            <button id="touch-jump" style="width: 80px; height: 80px; border-radius: 50%; background: #232e2b; color: #ffe066; font-size: 2rem; border: 2px solid #4b6a5a; cursor: pointer;">⭡</button>
            <button id="touch-choice-1" style="width: 60px; height: 60px; border-radius: 50%; background: #2d3a4a; color: #fff; font-size: 1.5rem; border: 2px solid #4b6a5a; cursor: pointer; display: none;">1</button>
            <button id="touch-choice-2" style="width: 60px; height: 60px; border-radius: 50%; background: #2d3a4a; color: #fff; font-size: 1.5rem; border: 2px solid #4b6a5a; cursor: pointer; display: none;">2</button>
        </div>
    `;
    document.body.appendChild(bar);
    
    bindTouchControlsEvents();
}

export function isTouchDevice() {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
}

export function setTouchControlsVisibility(opts = {}) {
    const bar = document.getElementById('touch-controls-bar');
    if (!bar) return;

    const visibility = {
        '#joystick-container': opts.joystick,
        '#touch-jump': opts.jump,
        '#touch-interact': opts.interact,
        '#touch-choice-1': opts.choices,
        '#touch-choice-2': opts.choices,
    };

    for (const selector in visibility) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = visibility[selector] === false ? 'none' : '';
        }
    }

    const actionButtons = document.getElementById('action-buttons');
    if (actionButtons) {
        const isMinimal = opts.joystick === false && opts.jump === false && (opts.choices || opts.interact);
        actionButtons.style.marginLeft = isMinimal ? 'auto' : '';
        actionButtons.style.marginRight = isMinimal ? '0' : '';
    }
}

export function showTouchControlsBar(show) {
    if (show && !document.getElementById('touch-controls-bar')) {
        setupTouchControlsBar();
    }

    const bar = document.getElementById('touch-controls-bar');
    if (!bar) return;

    const menu = document.getElementById('main-menu');
    const menuVisible = menu && getComputedStyle(menu).display !== 'none';

    bar.style.display = (show && !menuVisible) ? 'flex' : 'none';

    if (show && !menuVisible) {
        setTouchControlsVisibility({ joystick: true, jump: true, interact: true, choices: false });
    }
}

export function initTouchControls() {
    window.addEventListener('dialogue-active', () => setTouchControlsVisibility({ joystick: false, jump: false, interact: true, choices: false }));
    window.addEventListener('dialogue-inactive', () => setTouchControlsVisibility({ joystick: true, jump: true, interact: true, choices: false }));
    window.addEventListener('dialogue-choices-show', () => setTouchControlsVisibility({ joystick: false, jump: false, interact: false, choices: true }));
    window.addEventListener('dialogue-choices-hide', () => setTouchControlsVisibility({ joystick: false, jump: false, interact: true, choices: false }));
    window.addEventListener('quiz-start', () => showTouchControlsBar(false));

    window.addEventListener('level-start', () => {
        if (isTouchDevice()) {
            showTouchControlsBar(true);
            setTouchControlsVisibility({ joystick: true, jump: true, interact: true, choices: false });
        }
    });
}