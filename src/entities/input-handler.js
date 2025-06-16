// src/entities/input-handler.js

export class InputHandler {
    constructor() {
        this.keys = {
            right:    { pressed: false },
            left:     { pressed: false },
            jump:     { pressed: false },
            interact: { pressed: false },
            choice:   null    // will hold 0–8 when the player presses 1–9
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

            // ─── Capture numeric choices ────────────────────────────────────
            // '1' → choice = 0, '2' → 1, … '9' → 8
            case '1': case '2': case '3':
            case '4': case '5': case '6':
            case '7': case '8': case '9':
                // capture any top-row or numpad 1–9
                if (down && /^[1-9]$/.test(event.key)) {
                    this.keys.choice = parseInt(event.key, 10) - 1;
                } else if (!down && /^[1-9]$/.test(event.key)) {
                    this.keys.choice = null;
                }

                break;
            // ───────────────────────────────────────────────────────────────

            default:
                break;
        }
    }
}
