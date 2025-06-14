// src/entities/input-handler.js

export class InputHandler {
    constructor() {
        this.keys = {
            right:    { pressed: false },
            left:     { pressed: false },
            jump:     { pressed: false },
            interact: { pressed: false },
            choice:   null
        };
        window.addEventListener('keydown', e => this._onKey(e, true));
        window.addEventListener('keyup',   e => this._onKey(e, false));
    }

    _onKey(event, down) {
        const key = event.key;

        switch (key) {
            // SĂGEȚI → și D
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right.pressed = down;
                break;

            // SĂGEȚI ← și A
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left.pressed = down;
                break;

            // SĂGEȚI SUS, W sau SPACE pentru săritură
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
            case 'Spacebar':  // pentru browsere mai vechi
                this.keys.jump.pressed = down;
                break;

            // Interacțiune / dialog (E sau ENTER)
            case 'e':
            case 'E':
            case 'Enter':
                this.keys.interact.pressed = down;
                break;

            default:
                // alte taste (nu ne pasă)
                break;
        }
    }
}
