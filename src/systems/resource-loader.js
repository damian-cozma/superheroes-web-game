import { levels } from '../config/levels-config.js';
import { Level }  from '../entities/level.js';
import { Layer }  from '../entities/layer.js';
import { Player } from '../entities/player.js';
import { NPC }    from '../entities/npc.js';

export class ResourceLoader {
    constructor() {

        this.dialogueImage = new Image();
        this.dialogueImage.src = 'https://d1wlpmgdj7hm5h.cloudfront.net/ui/dialogueImage.webp';
    }

    async loadLevel(levelId) {

        const cfg = levels[levelId];
        console.log('[RL] cfg.collisionBlocks (raw):', cfg.collisionBlocks);

        const level = new Level({
            id:               levelId,
            bgPaths:          cfg.bgImageSrc,
            groundImagePath:  cfg.groundImageSrc,
            collisionsData:   cfg.collisionBlocks
        });
        console.log('[RL] level.collisionBlocks (objects):', level.collisionBlocks);

        await Promise.all([
            ...level.bgImages.map(img => new Promise(r => img.onload = r)),
            new Promise(r => level.groundImage.onload = r)
        ]);

        const layers = level.bgImages
            .map((img, i) => new Layer(img, cfg.parallaxSpeeds[i] ?? 1))
            .concat(new Layer(level.groundImage, 1.0));

        const playerSprites = {};
        await Promise.all(
            Object.entries(cfg.playerSprites).map(([key, url]) => {
                const img = new Image();
                img.src   = url;
                playerSprites[key] = img;
                return new Promise(r => img.onload = r);
            })
        );

        const player = new Player(
            cfg.gravity,
            cfg.canvasHeight,
            playerSprites
        );

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
