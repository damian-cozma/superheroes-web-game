import { ResourceLoader }  from './resource-loader.js';
import { InputSystem }     from './input-system.js';
import { PhysicsSystem }   from './physics-system.js';
import { DialogueSystem }  from './dialogue-system.js';
import { Renderer }        from './renderer.js';
import { config } from '../utils/utils.js';
import { Coin } from '../entities/coin.js';
import { QuizSystem } from './quiz-system.js';
import { loadTranslations, t } from '../i18n/i18n.js';

export class Main {
    static _runningLoop = false;
    static _rafId = null;
    static _coins = 0;
    static _lang = 'ro';
    static setCoins(val) {
        Main._coins = val;
    }
    static addCoin() {
        Main._coins++;
    }
    static setLang(lang) {
        Main._lang = lang;
    }

    static async start(levelId, lang = 'ro') {
        Main._lang = lang;
        await loadTranslations(lang);

        if (Main._rafId) {
            Main._runningLoop = false;
            cancelAnimationFrame(Main._rafId);
            Main._rafId = null;
        }
        Main._runningLoop = true;

        const canvas = document.getElementById('canvas');
        const ctx    = canvas.getContext('2d');
        canvas.width  = config.canvasWidth;
        canvas.height = config.canvasHeight;

        const camera = {
            x: 0,
            y: 0,
            width: config.canvasWidth,
            height: config.canvasHeight
        };

        const input     = new InputSystem();
        const physics   = new PhysicsSystem();
        const fixedWidth = 256;
        const renderer  = new Renderer(ctx);
        const loader    = new ResourceLoader();

        const {
            player,
            npcs,
            layers,
            collisionBlocks,
            groundImage,
            dialogueImage
        } = await loader.loadLevel(levelId);

        const cfgModule = await import('../config/levels-config.js');
        const cfg = cfgModule.levels[levelId];
        player.levelId = levelId;

        player.levelCollisions = cfg.levelCollisions || cfg.collisionBlocks;

        const dialogue = new DialogueSystem(
            ctx,
            dialogueImage,
            fixedWidth,
            canvas.width,
            canvas.height,
            canvas
        );

        let coins = [];
        let levelObj;
        if (typeof layers !== 'undefined' && typeof player !== 'undefined') {
            const LevelModule = await import('../entities/level.js');
            const Level = LevelModule.Level;
            const cfgModule = await import('../config/levels-config.js');
            const cfg = cfgModule.levels[levelId];
            levelObj = new Level({
                id: levelId,
                bgPaths: cfg.bgImageSrc,
                groundImagePath: cfg.groundImageSrc,
                collisionsData: cfg.levelCollisions || cfg.collisionBlocks
            });
            coins = levelObj.coinPositions.map(pos => new Coin(pos.x, pos.y));
        }

        const collisionBlocksForPhysics = levelObj ? levelObj.collisionBlocks : collisionBlocks;
        player.levelCollisions = cfg.levelCollisions || [];

        let scrollOffset = 0;
        let lastTime     = 0;
        let triedAdvance = false;
        let edgeAlertDiv = null;
        let edgePopupText = null;
        let edgePopupImage = null;
        let quizFailImage = null;

        const dialogueImg = new window.Image();
        dialogueImg.src = 'assets/ui/dialogueImage.png';
        dialogueImg.onload = () => { edgePopupImage = dialogueImg; };

        const quizFailImg = new window.Image();
        quizFailImg.src = 'assets/ui/quizFailImage.png';
        quizFailImg.onload = () => { quizFailImage = quizFailImg; };

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

        function showAlert(msg, showButton = true, btnText = t('quiz.ok'), onClose = null) {
            let alertDiv = document.createElement('div');
            alertDiv.className = 'quiz-popup';
            alertDiv.style.zIndex = 1000;
            alertDiv.style.position = 'fixed';
            alertDiv.style.left = '50%';
            alertDiv.style.top = '50%';
            alertDiv.style.transform = 'translate(-50%, -50%)';
            alertDiv.style.background = '#232e2b';
            alertDiv.style.color = '#fff';
            alertDiv.style.padding = '32px 48px';
            alertDiv.style.borderRadius = '16px';
            alertDiv.style.fontSize = '1.3rem';
            alertDiv.style.boxShadow = '0 4px 32px #000a';
            if (showButton) {
                alertDiv.innerHTML = `<div style='margin-bottom:18px;'>${msg}</div><button id='quiz-alert-btn'>${btnText}</button>`;
            } else {
                alertDiv.innerHTML = `<div style='margin-bottom:0;'>${msg}</div>`;
            }
            document.body.appendChild(alertDiv);
            if (showButton) {
                document.getElementById('quiz-alert-btn').onclick = () => {
                    alertDiv.remove();
                    if (onClose) onClose();
                };
            }
            return alertDiv;
        }

        let collectAudio = new window.Audio('assets/music/collect.mp3');
        collectAudio.volume = 0.7;

        function loop(timestamp) {
            if (!Main._runningLoop) return;
            const delta = timestamp - lastTime;
            lastTime    = timestamp;

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
            renderer.drawCollisionDebug(collisionBlocks, camera);
            renderer.drawEntities([player, ...npcs], timestamp, scrollOffset);
            for (const coin of coins) {
                coin.draw(ctx);
            }
            dialogue.draw();
            drawCoinCounter(ctx, Main._coins);
            if (edgePopupText && edgePopupImage) {
                drawImagePopup(ctx, edgePopupImage, edgePopupText, canvas);
            }
            for (const coin of coins) {
                if (coin.checkCollected(player)) {
                    Main.addCoin();
                    const collectAudio = new window.Audio('assets/music/collect.mp3');
                    collectAudio.volume = 0.35;
                    collectAudio.play();
                }
            }

            if (levelId === 1) {
                const atEdge = player.position.x >= canvas.width - player.width - 10;
                if (atEdge && !triedAdvance) {
                    player.position.x = canvas.width - player.width - 10;
                    Main._runningLoop = false;
                    triedAdvance = true;
                    if (Main._coins !== 9) {
                        edgePopupText = t('quiz.collect_all_coins');
                        Main._runningLoop = true;
                        Main._rafId = requestAnimationFrame(loop);
                        return;
                    }
                    edgePopupText = null;
                    const quiz = new QuizSystem(
                        () => setTimeout(() => Main.start(2, Main._lang), 300),
                        () => {
                            edgePopupImage = dialogueImg;
                            edgePopupText = lang === 'ro' ? 'Ai răspuns greșit! Încearcă din nou.' : 'Wrong answer! Try again.';
                            Main._runningLoop = true;
                            Main._rafId = requestAnimationFrame(loop);
                            setTimeout(() => {
                                edgePopupText = null;
                                edgePopupImage = null;
                            }, 1800);
                        }
                    );
                    quiz.start();
                    return;
                } else if (!atEdge) {
                    triedAdvance = false;
                    edgePopupText = null;
                }
            } else if (levelId === 2) {
                const atEdge = player.position.x >= canvas.width - player.width - 10;
                if (atEdge && !triedAdvance) {
                    player.position.x = canvas.width - player.width - 10;
                    Main._runningLoop = false;
                    triedAdvance = true;
                    setTimeout(() => Main.start(3, Main._lang), 300);
                    return;
                } else if (!atEdge) {
                    triedAdvance = false;
                }
            }

            scrollOffset = Math.min(
                Math.max(scrollOffset, 0),
                groundImage.width - canvas.width
            );

            player.position.x = Math.min(
                Math.max(player.position.x, 0),
                canvas.width - player.width
            );

            Main._rafId = requestAnimationFrame(loop);
        }

        Main._rafId = requestAnimationFrame(loop);
    }
}
