// src/systems/dialogue-box.js

import { drawTwoSlice } from '../utils/ui-utils.js';
import { dialogues }    from '../config/dialogues-config.js';

export class DialogueBox {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLImageElement} dialogueImage
     * @param {number} fixedWidth
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
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

        // ─── Add these properties ────────────────────────────────────
        this.isChoiceMode = false;   // whether we're showing multiple options
        this.choices      = [];      // array of choice‐strings
        this.choiceRects  = [];      // [{x,y,w,h,index}, …]
        this.hoverIndex   = null;    // which choice (if any) is hovered

        // after this.hoverIndex = null;
        this.fullText    = '';   // the entire line we want to show
        this.currentText = '';   // what’s already been revealed
        this.charSpeed   = 30;   // chars per second
        this.charTimer   = 0;    // ms since we started revealing
        this.overrideName = null;

    }

    /**
     * Start a normal text node
     */
    start(nodeKey, onFinish = () => {}) {
        this.nodeKey      = nodeKey;
        this.lineIndex    = 0;
        this.visible      = true;

        const line = dialogues[this.nodeKey].lines[this.lineIndex].text;
        this.fullText    = line;
        this.currentText = '';
        this.charTimer   = 0;


        this.onFinish     = onFinish;
        this.isChoiceMode = false;
        this.choices      = [];
        this.choiceRects  = []; // reset
        this.hoverIndex   = null;
        this.overrideName = null;
    }

    /**
     * Enter choice‐mode with an array of labels.
     */
    showChoices(choiceLabels) {
        console.log("showChoices()", choiceLabels);
        this.visible      = true;
        this.isChoiceMode = true;
        this.choices      = choiceLabels;
        this.choiceRects  = []; // reset
        this.hoverIndex   = null;
        this.overrideName = "Player";
    }

    /**
     * Advance a normal text node; does nothing in choice mode.
     */
    advance() {
        if (this.isChoiceMode) return;
        const lines = dialogues[this.nodeKey].lines;
        if (this.lineIndex < lines.length - 1) {
            this.lineIndex++;
            const line = dialogues[this.nodeKey].lines[this.lineIndex].text;
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

        // 1) Box dimensions & position
        const boxH = 600;                                  // you can tweak this
        const boxW = Math.min(canvasWidth - 40, 1000);     // total width
        const x    = 20;                                   // left margin
        const y    = canvasHeight - boxH + 150;            // lift it up as needed

        // 2) Draw the 2-slice background
        drawTwoSlice(ctx, img, x, y, boxW, boxH, fixedWidth);

        // 3) Compute vertical paddings relative to boxH
        const PAD_TOP    = boxH * 0.50;   // 10% down from top
        const PAD_BOTTOM = boxH * 0.10;   // 10% up from bottom

        // draw the name above the choices:
        ctx.font      = 'bold 18px Consolas';
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'top';
        ctx.fillText(
            this.overrideName || dialogues[this.nodeKey].name,
            x + fixedWidth -200,
            y + PAD_TOP - 36   // 30px above the first choice line
        );

        // 4) Choice mode? render choices:
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

        // 5) Normal text mode
        const cfg = dialogues[this.nodeKey];

        // 5a) Speaker name sits PAD_TOP down
        ctx.font         = 'bold 18px Consolas';
        ctx.fillStyle    = '#fff';
        ctx.textBaseline = 'top';
        ctx.fillText(
            cfg.name,
            x + fixedWidth - 200,
            y + PAD_TOP - 36
        );

        // 5b) Dialogue text sits just below the name
        ctx.font      = '18px Consolas';
        ctx.fillStyle = '#fff';
        this._drawWrapped(
            this.currentText,
            x + fixedWidth -200,
            y + PAD_TOP,                     // 32px below the name
            boxW - fixedWidth - 32
        );

        // 6) Advance arrow sits PAD_BOTTOM up from bottom
        if (this.lineIndex < cfg.lines.length - 1) {
            ctx.fillText(
                '▼',
                x + boxW - 32,
                y + boxH - PAD_BOTTOM - 16         // 16px above that bottom padding
            );
        }
    }

    update(delta) {
        if (this.isChoiceMode || !this.visible) return;
        this.charTimer += delta;
        // how many chars we should have shown by now:
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
