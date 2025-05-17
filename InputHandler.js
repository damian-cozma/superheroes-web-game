export class InputHandler {
    constructor() {
        this.keys = { right: { pressed: false }, left: { pressed: false } };

        addEventListener('keydown', (event) => this.handleKeyDown(event));
        addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowRight': this.keys.right.pressed = true; break;
            case 'ArrowLeft': this.keys.left.pressed = true; break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'ArrowRight': this.keys.right.pressed = false; break;
            case 'ArrowLeft': this.keys.left.pressed = false; break;
        }
    }
}