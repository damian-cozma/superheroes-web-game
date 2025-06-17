export class SpeechDialogue {

    constructor(ctx, text, targetPos, dialogueImage) {
        this.ctx         = ctx;
        this.text        = text;
        this.targetPos   = targetPos;
        this.dialogueImage = dialogueImage;

        this.padding     = 10;
        this.fontSize    = 16;
        ctx.font         = `${this.fontSize}px sans-serif`;
        ctx.textBaseline = 'top';

        const metrics    = ctx.measureText(text);
        this.textWidth   = metrics.width;
        this.width       = this.textWidth + this.padding * 2;
        this.height      = dialogueImage.height * (this.width / dialogueImage.width);
    }

    draw(scrollOffset) {
        const { ctx, text, targetPos, dialogueImage, padding, width, height } = this;

        const bx = targetPos.x - scrollOffset - width / 2;
        const by = targetPos.y - height - 20;

        ctx.drawImage(
            dialogueImage,
            0, 0, dialogueImage.width, dialogueImage.height,
            bx, by,
            width, height
        );

        ctx.fillStyle = 'black';
        const textY = by + (height - this.fontSize) / 2;
        ctx.fillText(text, bx + padding, textY);
    }


}
