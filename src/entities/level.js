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
        this.coinPositions = [];

        this.initCollisionBlocksAndCoins();
    }

    initCollisionBlocksAndCoins() {
        this.collisionBlocks = [];
        this.coinPositions = [];
        const size = this.blockSize;
        this.collisions.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    this.collisionBlocks.push({
                        position: {
                            x: x * size,
                            y: y * size,
                        },
                        width:  size,
                        height: size,
                        type: 'solid'
                    });
                } else if (cell === 2) {
                    this.coinPositions.push({
                        x: x * size + size/2,
                        y: y * size + size/2
                    });
                } else if (cell === 3) {
                    this.collisionBlocks.push({
                        position: {
                            x: x * size,
                            y: y * size,
                        },
                        width:  size,
                        height: size,
                        type: 'platform'
                    });
                }
            });
        });
    }




}