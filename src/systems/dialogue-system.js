// src/systems/dialogue-system.js

import { dialogues }   from '../config/dialogues-config.js';
import { DialogueBox } from './dialogue-box.js';

export class DialogueSystem {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLImageElement} dialogueImage
     * @param {number} fixedWidth
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     * @param {HTMLCanvasElement} canvasEl
     */
    constructor(ctx, dialogueImage, fixedWidth, canvasWidth, canvasHeight, canvasEl) {
        this.ctx    = ctx;
        this.canvas = canvasEl;
        this.box    = new DialogueBox(
            ctx, dialogueImage, fixedWidth, canvasWidth, canvasHeight
        );
        this.active = false;

        // listen for hover & click on choices
        canvasEl.addEventListener('mousemove', e => this._onMouseMove(e));
        canvasEl.addEventListener('click',     e => this._onMouseClick(e));
    }

    /**
     * Called each frame with current input state.
     */
    update(keys, player, npcs, delta) {
        this.box.update(delta);
        // 1) start dialog on interact
        if (!this.active && keys.interact.pressed) {
            const near = npcs.find(n => n.isPlayerNear(player.getHitbox()));
            if (near) {
                this.active = true;
                const key = near.dialogueId;   // e.g. "hero1"
                const cfg = dialogues[key];

                // start the intro lines; onFinish will show the questions
                this.box.start(key, () => {
                    if (Array.isArray(cfg.questions)) {
                        const labels = cfg.questions.map(q => q.label);
                        this.box.showChoices(labels);
                    } else {
                        this.active = false;
                    }
                });
            }
            keys.interact.pressed = false;
            return;
        }

        if (!this.active) return;

        // 2) if in choice mode, branch on number key
        if (this.box.isChoiceMode && keys.choice != null) {
            const parentKey = this.box.nodeKey;
            const question  = dialogues[parentKey].questions[keys.choice];
            const branchKey = question && question.branch;
            if (branchKey) {
                this.box.start(branchKey, () => {
                    this.active = false;
                });
            }
            keys.choice = null;
            return;
        }

        // 3) otherwise, advance a normal line
        if (!this.box.isChoiceMode && keys.interact.pressed) {
            this.box.advance();
            keys.interact.pressed = false;
        }
    }

    /**
     * Draw the dialogue box on top of the game world.
     */
    draw() {
        this.box.draw();
    }

    _onMouseMove(e) {
        if (!this.box.isChoiceMode) return;
        const r  = this.canvas.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;

        let found = null;
        for (const rect of this.box.choiceRects) {
            if (
                mx >= rect.x && mx <= rect.x + rect.w &&
                my >= rect.y && my <= rect.y + rect.h
            ) {
                found = rect.index;
                break;
            }
        }
        this.box.hoverIndex = found;
    }

    _onMouseClick(e) {
        if (!this.box.isChoiceMode || this.box.hoverIndex == null) return;
        const idx       = this.box.hoverIndex;
        const parentKey = this.box.nodeKey;
        const question  = dialogues[parentKey].questions[idx];
        const branchKey = question && question.branch;
        if (branchKey) {
            this.box.start(branchKey, () => {
                this.active = false;
            });
        }
    }
}
