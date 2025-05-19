// src/systems/input-system.js
import { InputHandler } from '../entities/input-handler.js';
import { config }       from '../utils/utils.js';

export class InputSystem {
    constructor() {
        this.handler     = new InputHandler();
        this.keys        = this.handler.keys;
        this.playerSpeed = config.playerSpeed || 5;
    }

    update() {
        // Resetează eventualele flag-uri one-shot
        this.keys.choice = null;
    }

    /**
     * Actualizează player-ul și scroll-ul pe baza tastelor apăsate.
     * @param {Player} player
     * @param {number} scrollOffset
     * @param {number} groundWidth
     * @param {number} canvasWidth
     * @param {Array} collisionBlocks
     * @returns {number} scrollOffset nou
     */
    handleScroll(player, scrollOffset, groundWidth, canvasWidth, collisionBlocks) {
        const speed      = this.playerSpeed;
        const halfCanvas = canvasWidth * 0.5;

        // 1) Jump
        if (this.keys.jump.pressed && player.isGrounded) {
            player.velocity.y      = -config.jumpVelocity;
            player.isGrounded      = false;
            this.keys.jump.pressed = false;
        }

        // 2) Mișcare orizontală
        if (this.keys.right.pressed) {
            player.velocity.x = speed;
            player.facing     = 'right';

            // Scroll dreapta dacă player-ul a depășit jumătatea ecranului
            const canScrollRight = scrollOffset + canvasWidth < groundWidth;
            if (player.position.x > halfCanvas && canScrollRight) {
                scrollOffset += speed;
                for (let block of collisionBlocks) {
                    block.position.x -= speed;
                }
                // menține player-ul fix la mijloc pe ecran
                player.position.x = halfCanvas;
            }

        } else if (this.keys.left.pressed) {
            player.velocity.x = -speed;
            player.facing     = 'left';

            // Scroll stânga dacă există spațiu
            const canScrollLeft = scrollOffset > 0;
            if (player.position.x < halfCanvas && canScrollLeft) {
                scrollOffset -= speed;
                for (let block of collisionBlocks) {
                    block.position.x += speed;
                }
                // menține player-ul fix la mijloc pe ecran
                player.position.x = halfCanvas;
            }

        } else {
            player.velocity.x = 0;
        }

        return scrollOffset;
    }

}
