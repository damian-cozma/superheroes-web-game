export function drawTwoSlice(ctx, img, x, y, w, h, fixedWidth) {
    const sw = img.width, sh = img.height;

    ctx.drawImage(img,
        0, 0,
        fixedWidth, sh,
        x, y,
        fixedWidth, h
    );

    const stretchW = w - fixedWidth;
    ctx.drawImage(img,
        fixedWidth, 0,
        sw - fixedWidth, sh,
        x + fixedWidth, y,
        stretchW, h
    );
}
