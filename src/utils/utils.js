export function checkCollision(rect1, rect2) {
    return (
        rect1.position.x < rect2.position.x + rect2.width &&
        rect1.position.x + rect1.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height > rect2.position.y
    );
}

export const config = {
    canvasWidth:  1200,
    canvasHeight: 640,
    gravity:      1,
    blockSize:    32,
    jumpVelocity: 20,
    playerSpeed:  4    // viteza de deplasare orizontală
};
