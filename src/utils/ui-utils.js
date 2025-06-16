// src/utils/ui-utils.js
export function drawTwoSlice(ctx, img, x, y, w, h, fixedWidth) {
    const sw = img.width, sh = img.height;
    // 1) Partea stângă fixă
    ctx.drawImage(img,
        0, 0,                   // src start
        fixedWidth, sh,         // src size
        x, y,                   // dst start
        fixedWidth, h           // dst size
    );
    // 2) Partea dreaptă elastică
    const stretchW = w - fixedWidth;
    ctx.drawImage(img,
        fixedWidth, 0,          // src start
        sw - fixedWidth, sh,    // src size
        x + fixedWidth, y,      // dst start
        stretchW, h             // dst size
    );
}
