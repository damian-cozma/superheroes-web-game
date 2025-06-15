// src/systems/physics-system.js

import { checkCollision, config } from '../utils/utils.js';

export class PhysicsSystem {
    update(delta, player, collisionBlocks) {
        player.position.x += player.velocity.x;
        this._resolveHorizontal(player, collisionBlocks);

        player.velocity.y += config.gravity;
        player.position.y += player.velocity.y;
        player.isGrounded = false;
        this._resolveVertical(player, collisionBlocks);
    }

    _resolveHorizontal(player, blocks) {
        const hb = player.getHitbox();

        for (const block of blocks) {
            if (block.type === 'platform') continue;
            if (!checkCollision(hb, block)) continue;

            if (player.velocity.x > 0) {
                player.position.x = block.position.x
                    - player.hitbox.offsetX
                    - hb.width;
            } else {
                player.position.x = block.position.x
                    - player.hitbox.offsetX
                    + block.width;
            }

            player.velocity.x = 0;
            break;
        }
    }


    _resolveVertical(player, blocks) {
        const hb = player.getHitbox();
        for (const block of blocks) {
            if (!checkCollision(hb, block)) continue;

            if (block.type === 'platform') {
                const playerBottom = player.position.y + player.height;
                const blockTop = block.position.y;
                if (
                    player.velocity.y > 0 &&
                    playerBottom - player.velocity.y <= blockTop &&
                    playerBottom > blockTop
                ) {
                    player.position.y = blockTop - player.height;
                    player.velocity.y = 0;
                    player.isGrounded = true;
                    break;
                } else {
                    continue;
                }
            }

            if (player.velocity.y > 0) {
                player.position.y = block.position.y
                    - player.hitbox.offsetY
                    - hb.height;
                player.velocity.y = 0;
                player.isGrounded  = true;
            } else if (player.velocity.y < 0) {
                player.position.y = block.position.y
                    + block.height
                    - player.hitbox.offsetY;
                player.velocity.y = 0;
            }

            break;
        }
    }


}
