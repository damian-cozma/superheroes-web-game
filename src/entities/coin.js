// Coin entity for collectible coins in the level
export class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.collected = false;
    }

    draw(ctx) {
        if (this.collected) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffe066';
        ctx.strokeStyle = '#e6b800';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#e6b800';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('¢', this.x, this.y + 1);
        ctx.restore();
    }

    checkCollected(player) {
        if (this.collected) return false;
        // Coliziune precisă: folosește hitbox-ul playerului
        const hb = player.getHitbox();
        // Verifică dacă centrul monedei este în interiorul hitbox-ului
        if (
            this.x >= hb.position.x &&
            this.x <= hb.position.x + hb.width &&
            this.y >= hb.position.y &&
            this.y <= hb.position.y + hb.height
        ) {
            this.collected = true;
            return true;
        }
        return false;
    }
}
