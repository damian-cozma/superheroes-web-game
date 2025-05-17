export class Player {
    constructor(gravity, canvasHeight, sprites) {
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 0 };
        this.width = 64;
        this.height = 64;
        this.isGrounded = false;
        this.gravity = gravity;
        this.canvasHeight = canvasHeight;
        this.sprites = sprites;
        this.currentAnimation = 'idleRight';
        this.frameIndex = 0;
        this.animationSpeed = 100;
        this.lastUpdateTime = 0;
        this.facing = 'right';
    }

    setAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;
            this.lastUpdateTime = 0;
        }
    }

    updateAnimation(time) {
        if (time - this.lastUpdateTime > this.animationSpeed) {
            this.frameIndex++;
            const frameCount = this.getFrameCount(this.currentAnimation);
            if (this.frameIndex >= frameCount) this.frameIndex = 0;
            this.lastUpdateTime = time;
        }
    }

    getFrameCount(animation) {
        switch(animation) {
            case 'jump': return 4;
            case 'idleRight': return 4;
            case 'idleLeft': return 4;
            case 'runRight': return 7;
            case 'runLeft': return 7;
            default: return 1;
        }
    }

    draw(ctx, time) {
        this.updateAnimation(time);
        const sprite = this.sprites[this.currentAnimation];
        const frameCount = this.getFrameCount(this.currentAnimation);
        const frameWidth = sprite.width / frameCount;
        const frameX = this.frameIndex * frameWidth;

        ctx.drawImage(
            sprite,
            frameX, 0,
            frameWidth, sprite.height,
            this.position.x, this.position.y,
            this.width, this.height
        );
    }
}