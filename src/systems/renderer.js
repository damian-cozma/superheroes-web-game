export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawBackgrounds(layers, scrollOffset) {
        layers.forEach(layer => {
            layer.update(scrollOffset);
            layer.draw(this.ctx);
        });
    }

    drawCollisionDebug(blocks, camera) {
        this.ctx.fillStyle = 'rgba(186,156,186,0)';
        blocks.forEach(b => {
            this.ctx.fillRect(
                b.position.x - camera.x,
                b.position.y - camera.y,
                b.width,
                b.height
            );
        });
    }

    drawEntities(entities, time, scrollOffset) {
        entities.forEach(ent => {
            ent.draw(this.ctx, time, scrollOffset);
        });
    }
}
