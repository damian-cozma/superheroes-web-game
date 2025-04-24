import { collisions } from './level1.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 640;

const gravity = 1;
const blockSize = 32;

const bgImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
];

const groundBuildings = new Image();

bgImages[0].src = 'assets/level_1/bg1.png';
bgImages[1].src = 'assets/level_1/bg2.png';
bgImages[2].src = 'assets/level_1/bg3.png';
bgImages[3].src = 'assets/level_1/bg4.png';
bgImages[4].src = 'assets/level_1/bg5.png';
groundBuildings.src = 'assets/level_1/ground_buildings.png';

let layers = [];
let imagesLoaded = 0;
const totalImages = 6;

class CollisionBlock {
    constructor({ x, y }) {
        this.position = { x, y };
        this.width = blockSize;
        this.height = blockSize;
    }

    draw() {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const collisionBlocks = [];

for (let y = 0; y < collisions.length; y++) {
    for (let x = 0; x < collisions[y].length; x++) {
        if (collisions[y][x] === 1) {
            collisionBlocks.push(
                new CollisionBlock({
                    x: x * blockSize,
                    y: y * blockSize,
                })
            );
        }
    }
}

class Player {
    constructor() {
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 1 };
        this.width = 30;
        this.height = 30;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        this.velocity.y += gravity;

        // Coliziune cu marginea de jos a ecranului (fallback)
        if (this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height;
            this.velocity.y = 0;
        }
    }
}

class Layer {
    constructor(image, speedModifier) {
        this.image = image;
        this.speedModifier = speedModifier;
        this.x = 0;
        this.y = 0;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y);
        ctx.drawImage(this.image, this.x + this.image.width, this.y);
    }

    update(scrollOffset) {
        this.x = -scrollOffset * this.speedModifier % this.image.width;
    }
}

const player = new Player();
const keys = {
    right: { pressed: false },
    left: { pressed: false },
};

let scrollOffset = 0;

[...bgImages, groundBuildings].forEach(image => {
    image.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            layers = [
                new Layer(bgImages[0], 0.1),
                new Layer(bgImages[1], 0.2),
                new Layer(bgImages[2], 0.3),
                new Layer(bgImages[3], 0.4),
                new Layer(bgImages[4], 0.6),
                new Layer(groundBuildings, 1.0),
            ];
            animate();
        }
    };
});

function checkCollision(rect1, rect2) {
    return (
        rect1.position.x < rect2.position.x + rect2.width &&
        rect1.position.x + rect1.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height > rect2.position.y
    );
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(layer => {
        layer.update(scrollOffset);
        layer.draw();
    });

    collisionBlocks.forEach(block => block.draw());

    player.position.x += player.velocity.x;
    collisionBlocks.forEach(block => {
        if (checkCollision(player, block)) {
            if (player.velocity.x > 0) {
                player.position.x = block.position.x - player.width;
            } else if (player.velocity.x < 0) {
                player.position.x = block.position.x + block.width;
            }
            player.velocity.x = 0;
        }
    });

    player.velocity.y += gravity;
    player.position.y += player.velocity.y;
    collisionBlocks.forEach(block => {
        if (checkCollision(player, block)) {
            if (player.velocity.y > 0) {
                player.position.y = block.position.y - player.height;
                player.velocity.y = 0;
            } else if (player.velocity.y < 0) {
                player.position.y = block.position.y + block.height;
                player.velocity.y = 0;
            }
        }
    });

    player.draw();

    if (keys.right.pressed && player.position.x < canvas.width - player.width - 200) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed && scrollOffset < groundBuildings.width - canvas.width) {
            scrollOffset += 5;
            collisionBlocks.forEach(b => b.position.x -= 5);
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= 5;
            collisionBlocks.forEach(b => b.position.x += 5);
        }
    }

    if (scrollOffset > 2000) {
        cancelAnimationFrame(animate);
    }
}

addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        case 'ArrowLeft':
            keys.left.pressed = true;
            break;
        case ' ':
            player.velocity.y -= 20;
            break;
    }
});

addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;
    }
});
