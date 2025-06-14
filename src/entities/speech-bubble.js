// src/entities/speech-bubble.js

export class SpeechBubble {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} text
     * @param {{x:number,y:number}} targetPos  – world-coords where the bubble should point
     * @param {HTMLImageElement} bubbleImage   – your chat-bubble PNG
     */
    constructor(ctx, text, targetPos, bubbleImage) {
        this.ctx         = ctx;
        this.text        = text;
        this.targetPos   = targetPos;
        this.bubbleImage = bubbleImage;

        this.padding     = 10;                        // px around text
        this.fontSize    = 16;                        // px
        ctx.font         = `${this.fontSize}px sans-serif`;
        ctx.textBaseline = 'top';

        const metrics    = ctx.measureText(text);
        this.textWidth   = metrics.width;
        this.width       = this.textWidth + this.padding * 2;
        this.height      = bubbleImage.height * (this.width / bubbleImage.width);
    }

    draw(scrollOffset) {
        const { ctx, text, targetPos, bubbleImage, padding, width, height } = this;

        const bx = targetPos.x - scrollOffset - width / 2;
        const by = targetPos.y - height - 20;

        ctx.drawImage(
            bubbleImage,
            0, 0, bubbleImage.width, bubbleImage.height,
            bx, by,
            width, height
        );

        ctx.fillStyle = 'black';
        const textY = by + (height - this.fontSize) / 2;
        ctx.fillText(text, bx + padding, textY);
    }


}
