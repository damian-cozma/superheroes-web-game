import { drawTwoSlice } from '../utils/ui-utils.js';
import { dialogues }    from '../config/dialogues-config.js';
import { t } from '../i18n/i18n.js';

export class DialogueBox {

    constructor(ctx, dialogueImage, fixedWidth, canvasWidth, canvasHeight) {
        this.ctx          = ctx;
        this.img          = dialogueImage;
        this.fixedWidth   = fixedWidth;
        this.canvasWidth  = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.visible      = false;
        this.nodeKey      = null;
        this.lineIndex    = 0;
        this.onFinish     = () => {};


        this.isChoiceMode = false;
        this.choices      = [];
        this.choiceRects  = [];
        this.hoverIndex   = null;

        this.fullText    = '';
        this.currentText = '';
        this.charSpeed   = 30;
        this.charTimer   = 0;
        this.overrideName = null;

    }

    start(nodeKey, onFinish = () => {}) {
        this.nodeKey      = nodeKey;
        this.lineIndex    = 0;
        this.visible      = true;

        const line = t(dialogues[this.nodeKey].lines[this.lineIndex].text);
        this.fullText    = line;
        this.currentText = '';
        this.charTimer   = 0;


        this.onFinish     = onFinish;
        this.isChoiceMode = false;
        this.choices      = [];
        this.choiceRects  = [];
        this.hoverIndex   = null;
        this.overrideName = null;
    }

    showChoices(choiceLabels) {
        console.log("showChoices()", choiceLabels);
        this.visible      = true;
        this.isChoiceMode = true;
        this.choices      = choiceLabels.map(label => t(label));
        this.choiceRects  = [];
        this.hoverIndex   = null;
        this.overrideName = "Player";
    }

    advance() {
        if (this.isChoiceMode) return;
        const lines = dialogues[this.nodeKey].lines;
        if (this.lineIndex < lines.length - 1) {
            this.lineIndex++;
            const line = t(dialogues[this.nodeKey].lines[this.lineIndex].text);
            this.fullText    = line;
            this.currentText = '';
            this.charTimer   = 0;

        } else {
            this.visible = false;
            console.log("🛎️ DialogueBox.advance(): invoking onFinish()");
            this.onFinish();
        }
    }

    draw() {
        if (!this.visible) return;

        const { ctx, img, fixedWidth, canvasWidth, canvasHeight } = this;

        const boxH = 600;
        const boxW = Math.min(canvasWidth - 40, 1000);
        const x    = 20;
        const y    = canvasHeight - boxH + 150;

        drawTwoSlice(ctx, img, x, y, boxW, boxH, fixedWidth);

        const PAD_TOP    = boxH * 0.50;
        const PAD_BOTTOM = boxH * 0.10;


        ctx.font      = 'bold 18px Consolas';
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'top';
        ctx.fillText(
            this.overrideName || dialogues[this.nodeKey].name,
            x + fixedWidth -200,
            y + PAD_TOP - 36
        );

        if (this.isChoiceMode) {
            ctx.font         = '18px Consolas';
            ctx.textBaseline = 'top';
            this.choiceRects = [];

            for (let i = 0; i < this.choices.length; i++) {
                const label = `${i+1}: ${this.choices[i]}`;
                const px    = x + 48;
                const py    = y + PAD_TOP + i * 36;
                const w     = ctx.measureText(label).width;
                const h     = 28;

                if (this.hoverIndex === i) {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect(px - 4, py - 2, w + 8, h);
                }

                ctx.fillStyle = '#fff';
                ctx.fillText(label, px, py);

                this.choiceRects.push({ x: px - 4, y: py - 2, w: w + 8, h, index: i });
            }
            return;
        }

        const cfg = dialogues[this.nodeKey];

        ctx.font         = 'bold 18px Consolas';
        ctx.fillStyle    = '#fff';
        ctx.textBaseline = 'top';
        ctx.fillText(
            cfg.name,
            x + fixedWidth - 200,
            y + PAD_TOP - 36
        );

        ctx.font      = '18px Consolas';
        ctx.fillStyle = '#fff';
        this._drawWrapped(
            this.currentText,
            x + fixedWidth -200,
            y + PAD_TOP,
            boxW - fixedWidth - 32
        );

        if (this.lineIndex < cfg.lines.length - 1) {
            ctx.fillText(
                '▼',
                x + boxW - 32,
                y + boxH - PAD_BOTTOM - 16
            );
        }
    }

    update(delta) {
        if (this.isChoiceMode || !this.visible) return;
        this.charTimer += delta;

        const targetCount = Math.floor(this.charTimer / 1000 * this.charSpeed);
        if (targetCount > this.currentText.length) {
            this.currentText = this.fullText.slice(0, targetCount);
        }
    }


    _drawWrapped(text, x, y, maxW) {
        const words = text.split(' ');
        let line = '';
        let yy   = y;

        for (const w of words) {
            const test = line ? line + ' ' + w : w;
            if (this.ctx.measureText(test).width > maxW) {
                this.ctx.fillText(line, x, yy);
                line = w;
                yy  += 26;
            } else {
                line = test;
            }
        }
        this.ctx.fillText(line, x, yy);
    }
}
