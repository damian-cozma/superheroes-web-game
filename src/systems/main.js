// src/systems/main.js

import { ResourceLoader } from './resource-loader.js';
import { InputSystem } from './input-system.js';
import { PhysicsSystem } from './physics-system.js';
import { DialogueSystem } from './dialogue-system.js';
import { Renderer } from './renderer.js';
import { config } from '../utils/utils.js';
import { Coin } from '../entities/coin.js';
import { QuizSystem } from './quiz-system.js';
import { loadTranslations, t } from '../i18n/i18n.js';
import { apiFetch } from '../utils/api.js';
import { levels } from '../config/levels-config.js';

const MAX_LEVEL = Object.keys(levels).length;

export class Main {
    static _runningLoop = false;
    static _rafId = null;
    static _coins = 0;
    static _lang = 'ro';
    static setCoins(val) { Main._coins = val; }
    static addCoin() { Main._coins++; }
    static setLang(lang) { Main._lang = lang; }

    static async start(levelId, lang = 'ro') {
        window.dispatchEvent(new CustomEvent('level-start'));
        Main._lang = lang;
        await loadTranslations(lang);
        if (Main._rafId) {
            Main._runningLoop = false;
            cancelAnimationFrame(Main._rafId);
            Main._rafId = null;
        }
        Main._runningLoop = true;

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = config.canvasWidth;
        canvas.height = config.canvasHeight;

        const camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };

        const input = new InputSystem();
        window.inputSystem = input;

        const physics = new PhysicsSystem();
        const renderer = new Renderer(ctx);
        const loader = new ResourceLoader();

        const { player, npcs, layers, collisionBlocks, groundImage, dialogueImage } =
            await loader.loadLevel(levelId);

        const cfgModule = await import('../config/levels-config.js');
        const cfg = cfgModule.levels[levelId];
        player.levelId = levelId;
        player.levelCollisions = cfg.levelCollisions || cfg.collisionBlocks;

        const dialogue = new DialogueSystem(ctx, dialogueImage, 256, canvas.width, canvas.height, canvas);

        let coins = [];
        let levelObj;
        if (typeof layers !== 'undefined' && typeof player !== 'undefined') {
            const LevelModule = await import('../entities/level.js');
            const Level = LevelModule.Level;
            const cfg2 = cfgModule.levels[levelId];
            levelObj = new Level({
                id: levelId,
                bgPaths: cfg2.bgImageSrc,
                groundImagePath: cfg2.groundImageSrc,
                collisionsData: cfg2.levelCollisions || cfg2.collisionBlocks
            });
            coins = levelObj.coinPositions.map(pos => new Coin(pos.x, pos.y));
        }

        const collisionBlocksForPhysics = levelObj ? levelObj.collisionBlocks : collisionBlocks;

        let scrollOffset = 0;
        let lastTime = 0;
        let triedAdvance = false;
        let edgePopupText = null;
        let edgePopupImage = null;

        const dialogueImg = new Image();
        dialogueImg.src = 'https://d1wlpmgdj7hm5h.cloudfront.net/ui/dialogueImage.png';
        dialogueImg.onload = () => { edgePopupImage = dialogueImg; };

        function drawImagePopup(ctx, image, text, canvas) {
            if (!image) return;
            const boxWidth = 800;
            const boxHeight = 260;
            const x = (canvas.width - boxWidth) / 2;
            const y = (canvas.height - boxHeight) / 2 - 30;
            ctx.save();
            ctx.drawImage(image, x, y, boxWidth, boxHeight);
            ctx.font = '20px Consolas';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#222';
            ctx.shadowBlur = 4;
            ctx.fillText(text, canvas.width / 2, y + boxHeight / 2 + 20);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        function drawCoinCounter(ctx, coins) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(40, 44, 20, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffe066';
            ctx.strokeStyle = '#e6b800';
            ctx.lineWidth = 3;
            ctx.fill();
            ctx.stroke();
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#e6b800';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('¢', 40, 44);
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = '#ffe066';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#222';
            ctx.shadowBlur = 4;
            ctx.fillText(coins, 75, 44);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        let collectAudio = new Audio('https://d1wlpmgdj7hm5h.cloudfront.net/music/collect.mp3');
        collectAudio.volume = 0.7;

        function loop(timestamp) {
            if (!Main._runningLoop) return;
            const delta = timestamp - lastTime;
            lastTime = timestamp;

            input.update();
            dialogue.update(input.keys, player, npcs, delta, scrollOffset);

            if (!dialogue.active) {
                physics.update(delta, player, collisionBlocksForPhysics);
                scrollOffset = input.handleScroll(
                    player,
                    scrollOffset,
                    groundImage.width,
                    canvas.width,
                    collisionBlocksForPhysics,
                    coins
                );
            }

            let targetAnimation;
            if (!player.isGrounded) {
                if (player.velocity.x < 0 || player.facing === 'left') {
                    targetAnimation = 'jumpLeft';
                    player.facing = 'left';
                } else if (player.velocity.x > 0 || player.facing === 'right') {
                    targetAnimation = 'jumpRight';
                    player.facing = 'right';
                } else {
                    const cap = player.facing.charAt(0).toUpperCase() + player.facing.slice(1);
                    targetAnimation = `jump${cap}`;
                }
            } else if (player.velocity.x > 0) {
                targetAnimation = 'runRight';
                player.facing = 'right';
            } else if (player.velocity.x < 0) {
                targetAnimation = 'runLeft';
                player.facing = 'left';
            } else {
                const cap = player.facing.charAt(0).toUpperCase() + player.facing.slice(1);
                targetAnimation = `idle${cap}`;
            }
            player.setAnimation(targetAnimation);

            renderer.clear();
            renderer.drawBackgrounds(layers, scrollOffset);
            renderer.drawCollisionDebug(collisionBlocksForPhysics, camera);
            renderer.drawEntities([player, ...npcs], timestamp, scrollOffset);
            coins.forEach(c => c.draw(ctx));
            dialogue.draw();
            drawCoinCounter(ctx, Main._coins);
            if (edgePopupText && edgePopupImage) {
                drawImagePopup(ctx, edgePopupImage, edgePopupText, canvas);
            }
            coins.forEach(c => {
                if (c.checkCollected(player)) {
                    Main.addCoin();
                    const sfx = new Audio('https://d1wlpmgdj7hm5h.cloudfront.net/music/collect.mp3');
                    sfx.volume = 0.35;
                    sfx.play();
                }
            });

            const atEdge = player.position.x >= canvas.width - player.width - 10;

            if (atEdge && !triedAdvance) {
                triedAdvance = true;
                Main._runningLoop = false;

                const token = localStorage.getItem('jwt');
                if (token) {
                    (async () => {
                        try {
                            const res = await apiFetch('/api/user/profile', {
                                method: 'PUT',
                                body: JSON.stringify({ levels_finished: levelId })
                            });
                            if (!res.ok && res.status !== 401) {

                                console.warn('Could not save progress:', await res.json());
                            }
                        } catch (err) {

                            console.error('Save error:', err);
                        }
                    })();
                }


                const nextLevel = levelId + 1;
                const hasQuiz = !!levels[levelId].hasQuiz;

                if (hasQuiz) {
                    const quiz = new QuizSystem(
                        () => setTimeout(() => Main.start(nextLevel, Main._lang), 300),
                        () => {
                            edgePopupImage = dialogueImg;
                            edgePopupText = t('quiz.wrong_answer');
                            Main._runningLoop = true;
                            Main._rafId = requestAnimationFrame(loop);
                            setTimeout(() => { edgePopupText = null; }, 1800);
                        }
                    );

                    window.dispatchEvent(new CustomEvent('quiz-start'));
                    
                    quiz.start(); 
                } else {
                    if (nextLevel <= MAX_LEVEL) {
                        setTimeout(() => Main.start(nextLevel, Main._lang), 300);
                    } else {
                        window.dispatchEvent(new Event('story-complete'));
                    }

                }
                return;
            } else if (!atEdge) {
                triedAdvance = false;
                edgePopupText = null;
            }

            scrollOffset = Math.min(Math.max(scrollOffset, 0), groundImage.width - canvas.width);
            player.position.x = Math.min(Math.max(player.position.x, 0), canvas.width - player.width);

            Main._rafId = requestAnimationFrame(loop);
        }

        Main._rafId = requestAnimationFrame(loop);
    }
}