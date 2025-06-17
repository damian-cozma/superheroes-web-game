// src/entities/npc.js

import { checkCollision } from '../utils/utils.js';

export class NPC {

    constructor(x, y, spriteSrc, frameCount, speed = 200) {
        this.position        = { x, y };
        this.image           = new Image();
        this.image.src       = spriteSrc;
        this.frameCount      = frameCount;
        this.frameIndex      = 0;
        this.animationSpeed  = speed;
        this.lastTime        = 0;
        this.loaded          = false;
        this.frameWidth      = 0;
        this.height          = 0;

        this.image.onload = () => {
            this.frameWidth = this.image.width / this.frameCount;
            this.height     = this.image.height;
            this.loaded     = true;

            console.log(`[NPC] Loaded ${spriteSrc}: fw=${this.frameWidth}, h=${this.height}`);
        };

    }

    static preload(spriteSrc) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = spriteSrc;
            img.onload = () => resolve(img);
        });
    }

    updateAnimation(time) {
        if (!this.loaded) return;
        if (time - this.lastTime > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
            this.lastTime   = time;
        }
    }

    draw(ctx, time, scrollOffset) {
        if (!this.loaded) {
            return;
        }
        this.updateAnimation(time);

        const scale = 2;
        ctx.drawImage(
            this.image,
            this.frameWidth * this.frameIndex, 0,
            this.frameWidth, this.height,
            this.position.x - scrollOffset,
            this.position.y,
            this.frameWidth * scale,
            this.height * scale
        );
    }

    isPlayerNear(playerHitbox, margin = 32) {

        if (!this.loaded || this.frameWidth === 0 || this.height === 0) {
            return false;
        }

        const expanded = {
            position: {
                x: playerHitbox.position.x - margin,
                y: playerHitbox.position.y - margin
            },
            width:  playerHitbox.width  + margin * 2,
            height: playerHitbox.height + margin * 2
        };

        const npcBox = {
            position: { x: this.position.x, y: this.position.y },
            width:    this.frameWidth,
            height:   this.height
        };

        return checkCollision(expanded, npcBox);
    }
}
