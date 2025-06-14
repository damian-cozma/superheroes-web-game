// src/systems/main.js

import { ResourceLoader }  from './resource-loader.js';
import { InputSystem }     from './input-system.js';
import { PhysicsSystem }   from './physics-system.js';
import { DialogueSystem }  from './dialogue-system.js';
import { Renderer }        from './renderer.js';
import { config } from '../utils/utils.js';

export class Main {
    static async start(levelId) {


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


        // 1) instantiate all systems
        const input     = new InputSystem();
        const physics   = new PhysicsSystem();
        const dialogue  = new DialogueSystem(ctx);
        const renderer  = new Renderer(ctx);
        const loader    = new ResourceLoader();

        // 2) load level & entities
        const {
            player,
            npcs,
            layers,
            collisionBlocks,
            groundImage
        } = await loader.loadLevel(levelId);

        let scrollOffset = 0;
        let lastTime     = 0;

        // 3) the main loop
        function loop(timestamp) {
            const delta = timestamp - lastTime;
            lastTime    = timestamp;

            // 3a) input & dialogue
            input.update();
            dialogue.update(input.keys, player, npcs);

            // ▶️ Debugează înainte de update-ul fizic



            // 3b) physics & scrolling only when not in dialogue
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

               // 3b-plus) actualizare animație pe baza direcției și stării
                   let targetAnimation;
               if (!player.isGrounded) {
                       targetAnimation = 'jump';
                   } else if (player.velocity.x > 0) {
                       targetAnimation = 'runRight';
                   } else if (player.velocity.x < 0) {
                       targetAnimation = 'runLeft';
                   } else {
                       const cap = player.facing.charAt(0).toUpperCase()
                                       + player.facing.slice(1);
                       targetAnimation = `idle${cap}`;
                   }
               player.setAnimation(targetAnimation);



        // 3c) render everything
            renderer.clear();
            renderer.drawBackgrounds(layers, scrollOffset);
            renderer.drawCollisionDebug(collisionBlocks, camera);
            renderer.drawEntities([player, ...npcs], timestamp, scrollOffset);
            dialogue.draw(scrollOffset);

            // 3d) clamp scroll & player inside bounds
            scrollOffset = Math.min(
                Math.max(scrollOffset, 0),
                groundImage.width - canvas.width
            );

            // 3d) clamp scroll & player inside bounds
            scrollOffset = Math.min(
                Math.max(scrollOffset, 0),
                groundImage.width - canvas.width
            );

            // 3e) clamp player inside canvas so she can’t run off-screen
            player.position.x = Math.min(
                Math.max(player.position.x, 0),
                canvas.width - player.width
            );



            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }
}
