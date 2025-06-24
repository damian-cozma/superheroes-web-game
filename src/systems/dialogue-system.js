import { dialogues }   from '../config/dialogues-config.js';
import { DialogueBox } from './dialogue-box.js';

export class DialogueSystem {

    constructor(ctx, dialogueImage, fixedWidth, canvasWidth, canvasHeight, canvasEl) {
        this.ctx    = ctx;
        this.canvas = canvasEl;
        this.box    = new DialogueBox(
            ctx, dialogueImage, fixedWidth, canvasWidth, canvasHeight
        );
        this.active = false;

        canvasEl.addEventListener('mousemove', e => this._onMouseMove(e));
        canvasEl.addEventListener('click',     e => this._onMouseClick(e));
    }


    update(keys, player, npcs, delta, scrollOffset = 0) {
        this.box.update(delta);

        if (!this.active && keys.interact.pressed) {
            const near = npcs.find(n => n.isPlayerNear(player.getHitbox(scrollOffset)));
            if (near) {
                this.active = true;
                const key = near.dialogueId;
                const cfg = dialogues[key];

                window.dispatchEvent(new Event('dialogue-active'));

                this.box.start(key, () => {
                    if (Array.isArray(cfg.questions)) {
                        window.dispatchEvent(new Event('dialogue-choices-show'));
                        const labels = cfg.questions.map(q => `npc.${key}.${q.label.replace(/^.*?_/, '')}`);
                        this.box.showChoices(labels);
                    } else {
                        this.active = false;
                        window.dispatchEvent(new Event('dialogue-inactive'));
                    }
                });
            }
            keys.interact.pressed = false;
            return;
        }

        if (!this.active) return;

        if (this.box.isChoiceMode && keys.choice != null) {
            window.dispatchEvent(new Event('dialogue-choices-hide'));
            const parentKey = this.box.nodeKey;
            const question  = dialogues[parentKey].questions[keys.choice];
            const branchKey = question && question.branch;
            if (branchKey) {
                this.box.start(branchKey, () => {
                    this.active = false;
                    window.dispatchEvent(new Event('dialogue-inactive'));
                });
            }
            keys.choice = null;
            return;
        }

        if (!this.box.isChoiceMode && keys.interact.pressed) {
            this.box.advance();
            keys.interact.pressed = false;
        }
    }

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
