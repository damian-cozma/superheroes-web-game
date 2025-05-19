// src/systems/resource-loader.js

import { levels } from '../config/levels-config.js';
import { Level }  from '../entities/level.js';
import { Layer }  from '../entities/layer.js';
import { Player } from '../entities/player.js';
import { NPC }    from '../entities/npc.js';

export class ResourceLoader {
    constructor() {
        // load your chat-bubble up front for DialogueSystem
        this.bubbleImage = new Image();
        this.bubbleImage.src = 'assets/ui/chatBubble.png';
    }

    async loadLevel(levelId) {
        const cfg = levels[levelId];
        // ▶️ Debugează matricea brută de coliziune
        console.log('[RL] cfg.collisionBlocks (raw):', cfg.collisionBlocks);

        //
        // 1) Build a Level instance (it will generate collisionBlocks)
        //
        const level = new Level({
            id:               levelId,
            bgPaths:          cfg.bgImageSrc,
            groundImagePath:  cfg.groundImageSrc,
            collisionsData:   cfg.collisionBlocks
        });

        // ▶️ Debugează blocurile construite de Level
        console.log('[RL] level.collisionBlocks (objects):', level.collisionBlocks);

        //
        // 2) Wait for all background + ground images to finish loading
        //
        await Promise.all([
            ...level.bgImages.map(img => new Promise(r => img.onload = r)),
            new Promise(r => level.groundImage.onload = r)
        ]);

        //
        // 3) Build Layer objects (for parallax) from those loaded images
        //
        const layers = level.bgImages
            .map((img, i) => new Layer(img, cfg.parallaxSpeeds[i] ?? 1))
            .concat(new Layer(level.groundImage, 1.0));

        //
        // 4) Load & instantiate the Player
        //
        // a) load each sprite into an Image
        const playerSprites = {};
        await Promise.all(
            Object.entries(cfg.playerSprites).map(([key, url]) => {
                const img = new Image();
                img.src   = url;
                playerSprites[key] = img;
                return new Promise(r => img.onload = r);
            })
        );

        // b) create the Player(gravity, canvasHeight, sprites)
        const player = new Player(
            cfg.gravity,
            cfg.canvasHeight,
            playerSprites
        );

        //
        // 5) Load & instantiate any NPCs
        //
        const npcs = (cfg.npcs || []).map(n => {
            const npc = new NPC(
                n.x,
                n.y,
                n.sprite,
                n.frameCount,
                n.animationSpeed
            );
            // ✨ tell the DialogueSystem which entry to use
            npc.dialogueId = n.id;
            return npc;
        });


        //
        // 6) Return exactly the bundle Main.loop() needs
        //
        // ▶️ Debugează ce returnezi spre Main
        console.log('[RL] returning collisionBlocks length =', level.collisionBlocks.length, 'first =', level.collisionBlocks[0]);
        return {
            player,
            npcs,
            layers,
            collisionBlocks: level.collisionBlocks,  // real {position,width,height} objects
            groundImage:     level.groundImage,
            bubbleImage:     this.bubbleImage       // so DialogueSystem can pick it up
        };
    }
}
