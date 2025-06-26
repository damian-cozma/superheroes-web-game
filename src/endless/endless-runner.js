import { collisions as endlessCollisions } from '../../collisions/endless.js';
import { Player } from '../entities/player.js';
import { InputSystem } from '../systems/input-system.js';
import { PhysicsSystem } from '../systems/physics-system.js';
import { Renderer } from '../systems/renderer.js';
import { config } from '../utils/utils.js';
import { t } from '../i18n/i18n.js';

let bestScoreSent = false;
export const EndlessRunner = {
    _running: false,
    _rafId: null,
    start() {
        bestScoreSent = false;
        this._running = true;
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = config.canvasWidth;
        canvas.height = config.canvasHeight;

        let overlay = document.getElementById('endless-gameover-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'endless-gameover-overlay';
            overlay.style.position = 'fixed';
            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.display = 'none';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.background = 'rgba(0,0,0,0.7)';
            overlay.style.zIndex = '1000';
            overlay.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;gap:24px;">
                    <div id="endless-gameover-title" style="font:bold 48px Arial;color:#fff;"></div>
                    <div id="endless-gameover-distance" style="font:bold 32px Arial;color:#fff;"></div>
                    <button id="endless-back-to-menu" style="font:bold 26px Arial;padding:16px 48px;border-radius:16px;background:#ffe066;color:#222;border:3px solid #fff;cursor:pointer;"></button>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        const overlayTitle = overlay.querySelector('#endless-gameover-title');
        const overlayDistance = overlay.querySelector('#endless-gameover-distance');
        const overlayBtn = overlay.querySelector('#endless-back-to-menu');
        let lastDistance = 0;
        function updateOverlayLang() {
            overlayTitle.textContent = t('game_over') || 'Game Over';
            overlayBtn.textContent = t('story.back_to_menu') || 'Back to Menu';
            overlayDistance.textContent = `${t('distance') || 'Distance'}: ` + Math.floor(lastDistance) + ' m';
        }
        updateOverlayLang();
        window.addEventListener('lang-changed', updateOverlayLang);
        overlayBtn.onclick = () => {
            overlay.style.display = 'none';
            EndlessRunner._running = false;
            cancelAnimationFrame(EndlessRunner._rafId);
            document.getElementById('main-menu').style.display = '';
            canvas.style.display = 'none';
            window.removeEventListener('keydown', escHandler);
            window.removeEventListener('mousedown', handleEndlessReturn);
            window.removeEventListener('touchstart', handleEndlessReturn);
            config.gravity = originalGravity;
            config.jumpVelocity = originalJumpVelocity;
        };

        const groundImg = new Image();
        groundImg.src = 'https://d1wlpmgdj7hm5h.cloudfront.net/endless_run/ground.webp';
        groundImg.onload = () => runAfterGroundLoaded();

        const cdnBaseUrl = 'https://d1wlpmgdj7hm5h.cloudfront.net';
        const bgPaths = [1,2,3,4,5].map(i => `${cdnBaseUrl}/endless_run/bg${i}.webp`);
        const bgImages = bgPaths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
        const parallaxSpeeds = [0.1, 0.2, 0.3, 0.4, 0.6];

        const playerSprites = {
            idleRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleRight.webp',
            idleLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleLeft.webp',
            runRight:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/runRight.webp',
            runLeft:   'https://d1wlpmgdj7hm5h.cloudfront.net/player/runLeft.webp',
            jumpLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpLeft.webp',
            jumpRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpRight.webp'
        };
        const loadedSprites = {};
        let loadedCount = 0;
        const totalSprites = Object.keys(playerSprites).length;
        for (const [key, src] of Object.entries(playerSprites)) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
            };
            loadedSprites[key] = img;
        }

        const runAfterGroundLoaded = () => {
            if (
                Object.values(loadedSprites).some(img => !img.complete || img.naturalWidth === 0) ||
                bgImages.some(img => !img.complete || img.naturalWidth === 0)
            ) {
                setTimeout(runAfterGroundLoaded, 30);
                return;
            }
            runGame();
        };

        const runGame = () => {
            const player = new Player(1, canvas.height, loadedSprites);
            player.position = { x: 100, y: 0 };
            player.isGrounded = false;
            player.facing = 'right';

            const input = new InputSystem();
            const physics = new PhysicsSystem();
            const renderer = new Renderer(ctx);

            const groundWidth = groundImg.width;
            const groundHeight = groundImg.height;
            let scrollOffset = 0;
            let distance = 0;
            let lastTime = 0;
            let isGameOver = false;

            const blockSize = 32;
            const mapWidth = endlessCollisions[0].length * blockSize;
            function generateCollisionBlocks(offset) {
                const blocks = [];
                const tilesNeeded = Math.ceil((canvas.width + mapWidth * 2) / mapWidth);
                const firstTile = Math.floor(offset / mapWidth) - 1;
                for (let tile = 0; tile < tilesNeeded; tile++) {
                    const tileOffset = (firstTile + tile) * mapWidth - offset;
                    endlessCollisions.forEach((row, y) => {
                        row.forEach((cell, x) => {
                            if (cell === 1) {
                                blocks.push({
                                    position: { x: x * blockSize + tileOffset, y: y * blockSize },
                                    width: blockSize,
                                    height: blockSize,
                                    type: 'solid'
                                });
                            } else if (cell === 3) {
                                blocks.push({
                                    position: { x: x * blockSize + tileOffset, y: y * blockSize },
                                    width: blockSize,
                                    height: blockSize,
                                    type: 'platform'
                                });
                            }
                        });
                    });
                }
                return blocks;
            }

            function drawGround(ctx, offset) {
                if (!groundImg.complete || groundImg.naturalWidth === 0) return;
                for (let x = -offset % groundWidth - groundWidth; x < canvas.width; x += groundWidth) {
                    ctx.drawImage(groundImg, x, canvas.height - groundHeight);
                }
            }

            function drawBackgrounds(ctx, offset) {
                for (let i = 0; i < bgImages.length; i++) {
                    const img = bgImages[i];
                    const speed = parallaxSpeeds[i];
                    const bgW = img.width;
                    const bgH = img.height;
                    let x = -offset * speed % bgW;
                    if (x > 0) x -= bgW;
                    for (; x < canvas.width; x += bgW) {
                        ctx.drawImage(img, x, 0, bgW, canvas.height);
                    }
                }
            }

            function drawBlocks(ctx, blocks) {
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                blocks.forEach(block => {
                    ctx.fillRect(block.position.x, block.position.y, block.width, block.height);
                });
                ctx.restore();
            }

            function drawDistance(ctx, dist) {
                ctx.save();
                ctx.font = 'bold 28px Arial';
                ctx.fillStyle = '#ffe066';
                ctx.textAlign = 'left';
                ctx.fillText(Math.floor(dist) + ' m', 30, 40);
                ctx.restore();
            }

            function loop(ts) {
                if (!EndlessRunner._running) return;
                const delta = ts - lastTime;
                lastTime = ts;
                if (isGameOver) return drawGameOver();

                const baseSpeed = 6;
                const speedStep = 0.5;
                const scrollSpeed = baseSpeed + speedStep * Math.floor(distance / 300);
                scrollOffset += scrollSpeed;
                distance += scrollSpeed / 10;

                const collisionBlocks = generateCollisionBlocks(scrollOffset);

                input.update();
                if (input.keys.jump.pressed && player.isGrounded) {
                    player.velocity.y = config.jumpVelocity;
                    player.isGrounded = false;
                    input.keys.jump.pressed = false;
                }
                player.velocity.x = 0;
                physics.update(delta, player, collisionBlocks.filter(b => b.type === 'solid'));
                if (!player.isGrounded && player.velocity.y >= 0) {
                    for (const block of collisionBlocks) {
                        if (block.type !== 'platform') continue;
                        const px = player.position.x, py = player.position.y, pw = player.width, ph = player.height;
                        const bx = block.position.x, by = block.position.y, bw = block.width, bh = block.height;
                        const wasAbove = (py + ph - player.velocity.y) <= by;
                        const isOverlappingX = px + pw > bx + 2 && px < bx + bw - 2;
                        const isTouching = py + ph > by && py + ph < by + bh + 8;
                        if (wasAbove && isOverlappingX && isTouching) {
                            player.position.y = by - ph;
                            player.velocity.y = 0;
                            player.isGrounded = true;
                            break;
                        }
                    }
                }

                player.setAnimation('runRight');

                if (player.position.y > canvas.height) {
                    isGameOver = true;
                }

                renderer.clear();
                drawBackgrounds(ctx, scrollOffset);
                drawGround(ctx, scrollOffset);
                drawBlocks(ctx, collisionBlocks);
                renderer.drawEntities([player], ts, 0);
                drawDistance(ctx, distance);

                EndlessRunner._rafId = requestAnimationFrame(loop);
            }

            const originalGravity = config.gravity;
            const originalJumpVelocity = config.jumpVelocity;
            config.gravity = 1.5;
            config.jumpVelocity = -25;

            function drawGameOver() {
                lastDistance = distance;
                overlayDistance.textContent = `${t('distance') || 'Distance'}: ` + Math.floor(distance) + ' m';
                overlay.style.display = 'flex';
                config.gravity = originalGravity;
                config.jumpVelocity = originalJumpVelocity;

                if (!bestScoreSent) {
                    bestScoreSent = true;
                    const token = localStorage.getItem('jwt');
                    fetch('/api/user/best_score', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ score: Math.floor(distance) })
                    })
                    .then(res => {
                        if (!res.ok) return res.text().then(text => { throw new Error(text || res.status); });
                        return res.json();
                    })
                    .then(data => {
                        console.log('Best score update response:', data);
                    })
                    .catch(err => {
                        console.error('Failed to update best score:', err);
                    });
                }
            }

            function handleEndlessReturn(e) {
                if (!isGameOver) return;
                let x, y;
                if (e.type.startsWith('touch')) {
                    const touch = e.changedTouches[0];
                    const rect = canvas.getBoundingClientRect();
                    x = (touch.clientX - rect.left) * (canvas.width / rect.width);
                    y = (touch.clientY - rect.top) * (canvas.height / rect.height);
                } else {
                    const rect = canvas.getBoundingClientRect();
                    x = (e.clientX - rect.left) * (canvas.width / rect.width);
                    y = (e.clientY - rect.top) * (canvas.height / rect.height);
                }

                const btnWidth = 260, btnHeight = 56;
                const btnX = canvas.width/2 - btnWidth/2, btnY = canvas.height/2 + 50;
                if (
                    x >= btnX && x <= btnX + btnWidth &&
                    y >= btnY && y <= btnY + btnHeight
                ) {
                    EndlessRunner._running = false;
                    cancelAnimationFrame(EndlessRunner._rafId);
                    document.getElementById('main-menu').style.display = '';
                    canvas.style.display = 'none';
                    window.removeEventListener('keydown', escHandler);
                    window.removeEventListener('mousedown', handleEndlessReturn);
                    window.removeEventListener('touchstart', handleEndlessReturn);
                    config.gravity = originalGravity;
                    config.jumpVelocity = originalJumpVelocity;
                }
            }
            function escHandler(e) {

                if (isGameOver && e.key === 'Escape') {
                    EndlessRunner._running = false;
                    cancelAnimationFrame(EndlessRunner._rafId);
                    document.getElementById('main-menu').style.display = '';
                    canvas.style.display = 'none';
                    window.removeEventListener('keydown', escHandler);
                    window.removeEventListener('mousedown', handleEndlessReturn);
                    window.removeEventListener('touchstart', handleEndlessReturn);
                    config.gravity = originalGravity;
                    config.jumpVelocity = originalJumpVelocity;
                }
            }
            window.addEventListener('keydown', escHandler);
            window.addEventListener('mousedown', handleEndlessReturn);
            window.addEventListener('touchstart', handleEndlessReturn);

            EndlessRunner._rafId = requestAnimationFrame(loop);
        };
    }
};
