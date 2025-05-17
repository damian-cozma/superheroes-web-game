import { Level } from './levels/Level.js';
import { Player } from './Player.js';
import { Layer } from './Layer.js';
import { checkCollision, config } from './utils.js';
import { levels } from './levelsConfig.js';
import { InputHandler } from './InputHandler.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;

const inputHandler = new InputHandler();

const playerSprites = {
    idleRight: new Image(),
    idleLeft: new Image(),
    runRight: new Image(),
    runLeft: new Image(),
    jump: new Image()
};
playerSprites.idleRight.src = 'assets/player/idleRight.png';
playerSprites.idleLeft.src = 'assets/player/idleLeft.png';
playerSprites.runRight.src = 'assets/player/runRight.png';
playerSprites.runLeft.src = 'assets/player/runLeft.png';
playerSprites.jump.src = 'assets/player/jump.png';

const player = new Player(config.gravity, config.canvasHeight, playerSprites);
let currentLevel = null;
let layers = [];
let animationId = null;

async function loadLevel(levelId) {
    if (animationId) cancelAnimationFrame(animationId);

    const levelConfig = levels[levelId];
    currentLevel = new Level(levelConfig);

    await Promise.all([
        ...currentLevel.bgImages.map(img =>
            new Promise(resolve => { img.onload = resolve; })
        ),
        new Promise(resolve => { currentLevel.groundImage.onload = resolve; }),
        new Promise(resolve => {
            let loaded = 0;
            const checkLoaded = () => { if (++loaded === 5) resolve(); };
            for (const key in playerSprites) {
                playerSprites[key].onload = checkLoaded;
                if (playerSprites[key].complete) checkLoaded();
            }
        })
    ]);

    player.position = { x: 100, y: 100 };
    layers = currentLevel.bgImages.map((img, index) =>
        new Layer(img, [0.1, 0.2, 0.3, 0.4, 0.6][index])
    ).concat(new Layer(currentLevel.groundImage, 1.0));

    animate();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(layer => {
        layer.update(currentLevel.scrollOffset);
        layer.draw(ctx);
    });

    currentLevel.collisionBlocks.forEach(block => {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(block.position.x, block.position.y, block.width, block.height);
    });

    player.position.x += player.velocity.x;
    currentLevel.collisionBlocks.forEach(block => {
        if (checkCollision(player, block)) {
            if (player.velocity.x > 0) {
                player.position.x = block.position.x - player.width;
            } else if (player.velocity.x < 0) {
                player.position.x = block.position.x + block.width;
            }
            player.velocity.x = 0;
        }
    });

    player.velocity.y += config.gravity;
    player.position.y += player.velocity.y;
    player.isGrounded = false;
    currentLevel.collisionBlocks.forEach(block => {
        if (checkCollision(player, block)) {
            if (player.velocity.y > 0) {
                player.position.y = block.position.y - player.height;
                player.velocity.y = 0;
                player.isGrounded = true;
            } else if (player.velocity.y < 0) {
                player.position.y = block.position.y + block.height;
                player.velocity.y = 0;
            }
        }
    });

    let targetAnimation;
    if (!player.isGrounded) {
        targetAnimation = 'jump';
    } else if (player.velocity.x !== 0) {
        targetAnimation = player.velocity.x > 0 ? 'runRight' : 'runLeft';
    } else {
        targetAnimation = `idle${player.facing.charAt(0).toUpperCase() + player.facing.slice(1)}`;
    }
    player.updateAnimation(Date.now());
    player.setAnimation(targetAnimation);

    player.draw(ctx, Date.now());

    if (inputHandler.keys.right.pressed && player.position.x < canvas.width - player.width - 200) {
        player.velocity.x = 5;
        player.facing = 'right';
    } else if (inputHandler.keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
        player.facing = 'left';
    } else {
        player.velocity.x = 0;
        if (inputHandler.keys.right.pressed && currentLevel.scrollOffset < currentLevel.groundImage.width - canvas.width) {
            currentLevel.scrollOffset += 5;
            currentLevel.collisionBlocks.forEach(b => b.position.x -= 5);
        } else if (inputHandler.keys.left.pressed && currentLevel.scrollOffset > 0) {
            currentLevel.scrollOffset -= 5;
            currentLevel.collisionBlocks.forEach(b => b.position.x += 5);
        }
    }

    if (currentLevel.scrollOffset > currentLevel.groundImage.width - canvas.width) {
        cancelAnimationFrame(animationId);
        console.log('Level completed!');
    }
}

addEventListener('keydown', (event) => {
    if (event.key === ' ' && player.isGrounded) {
        player.velocity.y -= 20;
        player.isGrounded = false;
    }
});

loadLevel(1);