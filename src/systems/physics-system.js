import { checkCollision, config } from '../utils/utils.js';

export class PhysicsSystem {
    update(delta, player, collisionBlocks) {
        player.position.x += player.velocity.x;
        this._resolveHorizontal(player, collisionBlocks);

        player.velocity.y += config.gravity;
        player.position.y += player.velocity.y;
        player.isGrounded = false;
        this._resolveVertical(player, collisionBlocks);

        if (Array.isArray(player.levelCollisions)) {
            const size = 32;
            const hitbox = player.getHitbox();
            const points = [
                { x: hitbox.position.x, y: hitbox.position.y },
                { x: hitbox.position.x + hitbox.width, y: hitbox.position.y },
                { x: hitbox.position.x, y: hitbox.position.y + hitbox.height },
                { x: hitbox.position.x + hitbox.width, y: hitbox.position.y + hitbox.height }
            ];

            let onFour = false;
            for (const pt of points) {
                const px = Math.floor(pt.x / size);
                const py = Math.floor(pt.y / size);
                const val = player.levelCollisions[py]?.[px];

                if (
                    val === 4 ||
                    py >= player.levelCollisions.length
                ) {
                    onFour = true;
                    break;
                }
            }
            if (onFour && player.levelId === 3) {
                player.position.x = 0;
                player.position.y = 0;
                player.velocity.x = 0;
                player.velocity.y = 0;
                if (typeof window !== 'undefined') {
                    window.scrollOffset = 0;
                }
                if (typeof window.Main !== 'undefined') {
                    window.Main._scrollOffset = 0;
                }
                if (typeof window.Main !== 'undefined' && typeof window.Main.setScrollOffset === 'function') {
                    window.Main.setScrollOffset(0);
                }
                if (typeof scrollOffset !== 'undefined') {
                    scrollOffset = 0;
                }
                if (typeof player.scrollOffset !== 'undefined') {
                    player.scrollOffset = 0;
                }
                if (typeof player.resetCamera === 'function') {
                    player.resetCamera();
                }
            }
        }
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
