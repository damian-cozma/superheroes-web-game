export class Level {
    constructor({ id, bgPaths, groundImagePath, collisionsData }) {
        this.id = id;
        this.bgImages = bgPaths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
        this.groundImage = new Image();
        this.groundImage.src = groundImagePath;
        this.collisions = collisionsData;
        this.blockSize = 32;
        this.scrollOffset = 0;
        this.collisionBlocks = [];

        this.initCollisionBlocks();
    }

    initCollisionBlocks() {
        for (let y = 0; y < this.collisions.length; y++) {
            for (let x = 0; x < this.collisions[y].length; x++) {
                if (this.collisions[y][x] === 1) {
                    this.collisionBlocks.push({
                        position: {
                            x: x * this.blockSize,
                            y: y * this.blockSize
                        },
                        width: this.blockSize,
                        height: this.blockSize
                    });
                }
            }
        }
    }
}