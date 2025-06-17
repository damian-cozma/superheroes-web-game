import { InputHandler } from '../entities/input-handler.js';
import { config }       from '../utils/utils.js';

export class InputSystem {
    constructor() {
        this.handler     = new InputHandler();
        this.keys        = this.handler.keys;
        this.playerSpeed = config.playerSpeed || 5;
    }

    update() {

    }


    handleScroll(player, scrollOffset, groundWidth, canvasWidth, collisionBlocks, coins) {
        const speed      = this.playerSpeed;
        const halfCanvas = canvasWidth * 0.5;

        if (this.keys.jump.pressed && player.isGrounded) {
            player.velocity.y      = -config.jumpVelocity;
            player.isGrounded      = false;
            this.keys.jump.pressed = false;
        }

        if (this.keys.right.pressed) {
            player.velocity.x = speed;
            player.facing     = 'right';

            const canScrollRight = scrollOffset + canvasWidth < groundWidth;
            if (player.position.x > halfCanvas && canScrollRight) {
                scrollOffset += speed;
                for (let block of collisionBlocks) {
                    block.position.x -= speed;
                }
                if (coins) {
                    for (let coin of coins) {
                        coin.x -= speed;
                    }
                }
                player.position.x = halfCanvas;
            }

        } else if (this.keys.left.pressed) {
            player.velocity.x = -speed;
            player.facing     = 'left';

            const canScrollLeft = scrollOffset > 0;
            if (player.position.x < halfCanvas && canScrollLeft) {
                scrollOffset -= speed;
                for (let block of collisionBlocks) {
                    block.position.x += speed;
                }
                if (coins) {
                    for (let coin of coins) {
                        coin.x += speed;
                    }
                }
                player.position.x = halfCanvas;
            }

        } else {
            player.velocity.x = 0;
        }

        return scrollOffset;
    }

}
