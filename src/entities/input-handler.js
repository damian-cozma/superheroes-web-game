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
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right.pressed = down;
                break;

            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left.pressed = down;
                break;

            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
            case 'Spacebar': 
                this.keys.jump.pressed = down;
                break;

            case 'e':
            case 'E':
            case 'Enter':
                this.keys.interact.pressed = down;
                break;

            default:
                break;
        }
    }
}
