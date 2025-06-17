import { levels } from '../config/levels-config.js';
import { Level }  from '../entities/level.js';
import { Layer }  from '../entities/layer.js';
import { Player } from '../entities/player.js';
import { NPC }    from '../entities/npc.js';

export class ResourceLoader {
    constructor() {
        // Your 2-slice dialogue box asset
        this.dialogueImage = new Image();
        this.dialogueImage.src = 'assets/ui/dialogueImage.png';
    }

    async loadLevel(levelId) {
        // 1) Grab level config
        const cfg = levels[levelId];
        console.log('[RL] cfg.collisionBlocks (raw):', cfg.collisionBlocks);

        // 2) Build Level entity (handles collisions, background images)
        const level = new Level({
            id:               levelId,
            bgPaths:          cfg.bgImageSrc,
            groundImagePath:  cfg.groundImageSrc,
            collisionsData:   cfg.collisionBlocks
        });
        console.log('[RL] level.collisionBlocks (objects):', level.collisionBlocks);

        // 3) Wait for all level images to finish loading
        await Promise.all([
            ...level.bgImages.map(img => new Promise(r => img.onload = r)),
            new Promise(r => level.groundImage.onload = r)
        ]);

        // 4) Create parallax layers
        const layers = level.bgImages
            .map((img, i) => new Layer(img, cfg.parallaxSpeeds[i] ?? 1))
            .concat(new Layer(level.groundImage, 1.0));

        // 5) Preload player sprites
        const playerSprites = {};
        await Promise.all(
            Object.entries(cfg.playerSprites).map(([key, url]) => {
                const img = new Image();
                img.src   = url;
                playerSprites[key] = img;
                return new Promise(r => img.onload = r);
            })
        );

        // 6) Instantiate the player
        const player = new Player(
            cfg.gravity,
            cfg.canvasHeight,
            playerSprites
        );

        // 7) Instantiate NPCs (dialogueId ties them to dialogues in config)
        const npcs = (cfg.npcs || []).map(n => {
            const npc = new NPC(
                n.x,
                n.y,
                n.sprite,
                n.frameCount,
                n.animationSpeed
            );
            npc.dialogueId = n.id;
            return npc;
        });

        console.log(
            '[RL] returning collisionBlocks length =',
            level.collisionBlocks.length,
            'first =',
            level.collisionBlocks[0]
        );

        // 8) Return everything your game needs—including only dialogueImage
        return {
            player,
            npcs,
            layers,
            collisionBlocks: level.collisionBlocks,
            groundImage:     level.groundImage,
            dialogueImage:   this.dialogueImage
        };
    }
}
