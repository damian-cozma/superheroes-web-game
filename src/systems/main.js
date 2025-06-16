// src/systems/main.js

import { ResourceLoader }  from './resource-loader.js';
import { InputSystem }     from './input-system.js';
import { PhysicsSystem }   from './physics-system.js';
import { DialogueSystem }  from './dialogue-system.js';
import { Renderer }        from './renderer.js';
import { config } from '../utils/utils.js';
import { Coin } from '../entities/coin.js';

export class Main {
    static _runningLoop = false;
    static _rafId = null;
    static _coins = 0;
    static setCoins(val) {
        Main._coins = val;
    }
    static addCoin() {
        Main._coins++;
    }

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
        const fixedWidth = 256;  // width of the fixed (portrait+name) slice
        const renderer  = new Renderer(ctx);
        const loader    = new ResourceLoader();

        const {
            player,
            npcs,
            layers,
            collisionBlocks,
            groundImage,
            dialogueImage
        } = await loader.loadLevel(levelId);

        const dialogue = new DialogueSystem(
            ctx,
            dialogueImage,
            fixedWidth,
            canvas.width,
            canvas.height,
            canvas
        );

        let coins = [];
        if (typeof layers !== 'undefined' && typeof player !== 'undefined') {
            const LevelModule = await import('../entities/level.js');
            const Level = LevelModule.Level;
            const cfgModule = await import('../config/levels-config.js');
            const cfg = cfgModule.levels[levelId];
            const levelObj = new Level({
                id: levelId,
                bgPaths: cfg.bgImageSrc,
                groundImagePath: cfg.groundImageSrc,
                collisionsData: cfg.collisionBlocks
            });
            coins = levelObj.coinPositions.map(pos => new Coin(pos.x, pos.y));
        }

        let scrollOffset = 0;
        let lastTime     = 0;

        function drawCoinCounter(ctx, coins) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(40, 44, 20, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffe066';
            ctx.strokeStyle = '#e6b800';
            ctx.lineWidth = 3;
            ctx.fill();
            ctx.stroke();
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#e6b800';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('¢', 40, 44);
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = '#ffe066';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#222';
            ctx.shadowBlur = 4;
            ctx.fillText(coins, 75, 44);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        function loop(timestamp) {
            if (!Main._runningLoop) return;
            const delta = timestamp - lastTime;
            lastTime    = timestamp;

            input.update();
            dialogue.update(input.keys, player, npcs, delta);

            if (!dialogue.active) {
                physics.update(delta, player, collisionBlocks);
                scrollOffset = input.handleScroll(
                    player,
                    scrollOffset,
                    groundImage.width,
                    canvas.width,
                    collisionBlocks,
                    coins
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
            for (const coin of coins) {
                coin.draw(ctx);
            }
            dialogue.draw();
            drawCoinCounter(ctx, Main._coins);
            for (const coin of coins) {
                if (coin.checkCollected(player)) {
                    Main.addCoin();
                }
            }

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
