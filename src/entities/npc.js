// src/entities/npc.js

import { checkCollision } from '../utils/utils.js';

export class NPC {
    /**
     * @param {number} x           – world X
     * @param {number} y           – world Y
     * @param {string} spriteSrc   – path to your idle sprite-sheet
     * @param {number} frameCount  – how many frames in that sheet
     * @param {number} speed       – ms per frame
     */
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
        };
    }

    updateAnimation(time) {
        if (!this.loaded) return;
        if (time - this.lastTime > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
            this.lastTime   = time;
        }
    }

    /**
     * Draw the NPC, taking the world scroll into account.
     */
    draw(ctx, time, scrollOffset) {
        if (!this.loaded) return;
        this.updateAnimation(time);

        ctx.drawImage(
            this.image,
            this.frameWidth * this.frameIndex, 0,
            this.frameWidth, this.height,
            this.position.x - scrollOffset,
            this.position.y,
            this.frameWidth, this.height
        );
    }

    /**
     * Returns true if the player's hitbox (in world coords)
     * is within `margin` px of this NPC’s bounding box.
     * @param {{position:{x:number,y:number},width:number,height:number}} playerHitbox
     * @param {number} margin
     */
    isPlayerNear(playerHitbox, margin = 32) {
        // Expand the player's box by `margin` on all sides
        const expanded = {
            position: {
                x: playerHitbox.position.x - margin,
                y: playerHitbox.position.y - margin
            },
            width:  playerHitbox.width  + margin * 2,
            height: playerHitbox.height + margin * 2
        };

        // This NPC's world-space box
        const npcBox = {
            position: { x: this.position.x, y: this.position.y },
            width:    this.frameWidth,
            height:   this.height
        };

        return checkCollision(expanded, npcBox);
    }
}
