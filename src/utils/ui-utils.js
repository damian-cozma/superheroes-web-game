export function drawTwoSlice(ctx, img, x, y, w, h, fixedWidth) {
    const sw = img.width, sh = img.height;

    ctx.drawImage(img,
        0, 0,                   // src start
        fixedWidth, sh,         // src size
        x, y,                   // dst start
        fixedWidth, h           // dst size
    );

    const stretchW = w - fixedWidth;
    ctx.drawImage(img,
        fixedWidth, 0,          // src start
        sw - fixedWidth, sh,    // src size
        x + fixedWidth, y,      // dst start
        stretchW, h             // dst size
    );
}
