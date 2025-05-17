export class Layer {
    constructor(image, speedModifier) {
        this.image = image;
        this.speedModifier = speedModifier;
        this.x = 0;
        this.y = 0;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
        ctx.drawImage(this.image, this.x + this.image.width, this.y);
    }

    update(scrollOffset) {
        this.x = -scrollOffset * this.speedModifier % this.image.width;
    }
}