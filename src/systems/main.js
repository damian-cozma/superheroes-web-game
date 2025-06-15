// src/systems/main.js

import { ResourceLoader }  from './resource-loader.js';
import { InputSystem }     from './input-system.js';
import { PhysicsSystem }   from './physics-system.js';
import { DialogueSystem }  from './dialogue-system.js';
import { Renderer }        from './renderer.js';
import { config } from '../utils/utils.js';

export class Main {
    static _runningLoop = false;
    static _rafId = null;

    static async start(levelId) {
        if (Main._rafId) {
            Main._runningLoop = false;
            cancelAnimationFrame(Main._rafId);
            Main._rafId = null;
        }
        Main._runningLoop = true;

        const canvas = document.getElementById('canvas');
        const ctx    = canvas.getContext('2d');
        canvas.width  = config.canvasWidth;
        canvas.height = config.canvasHeight;

        const camera = {
            x: 0,
            y: 0,
            width: config.canvasWidth,
            height: config.canvasHeight
        };

        const input     = new InputSystem();
        const physics   = new PhysicsSystem();
        const dialogue  = new DialogueSystem(ctx);
        const renderer  = new Renderer(ctx);
        const loader    = new ResourceLoader();

        const {
            player,
            npcs,
            layers,
            collisionBlocks,
            groundImage
        } = await loader.loadLevel(levelId);

        let scrollOffset = 0;
        let lastTime     = 0;

        function loop(timestamp) {
            if (!Main._runningLoop) return;
            const delta = timestamp - lastTime;
            lastTime    = timestamp;

            input.update();
            dialogue.update(input.keys, player, npcs);

            if (!dialogue.active) {
                physics.update(delta, player, collisionBlocks);
                scrollOffset = input.handleScroll(
                    player,
                    scrollOffset,
                    groundImage.width,
                    canvas.width,
                    collisionBlocks
                );
            }

            let targetAnimation;
            if (!player.isGrounded) {
                if (player.velocity.x < 0 || player.facing === 'left') {
                    targetAnimation = 'jumpLeft';
                    player.facing = 'left';
                } else if (player.velocity.x > 0 || player.facing === 'right') {
                    targetAnimation = 'jumpRight';
                    player.facing = 'right';
                } else {
                    const cap = player.facing.charAt(0).toUpperCase() + player.facing.slice(1);
                    targetAnimation = `jump${cap}`;
                }
            } else if (player.velocity.x > 0) {
                targetAnimation = 'runRight';
                player.facing = 'right';
            } else if (player.velocity.x < 0) {
                targetAnimation = 'runLeft';
                player.facing = 'left';
            } else {
                const cap = player.facing.charAt(0).toUpperCase() + player.facing.slice(1);
                targetAnimation = `idle${cap}`;
            }
            player.setAnimation(targetAnimation);

            renderer.clear();
            renderer.drawBackgrounds(layers, scrollOffset);
            renderer.drawCollisionDebug(collisionBlocks, camera);
            renderer.drawEntities([player, ...npcs], timestamp, scrollOffset);
            dialogue.draw(scrollOffset);

            if (levelId === 1 && player.position.x >= canvas.width - player.width - 10) {
                player.position.x = canvas.width - player.width - 10;
                Main._runningLoop = false;
                setTimeout(() => Main.start(2), 100);
                return;
            }

            scrollOffset = Math.min(
                Math.max(scrollOffset, 0),
                groundImage.width - canvas.width
            );

            player.position.x = Math.min(
                Math.max(player.position.x, 0),
                canvas.width - player.width
            );

            Main._rafId = requestAnimationFrame(loop);
        }

        Main._rafId = requestAnimationFrame(loop);
    }
}
