import { collisions as level1Collisions } from '../../collisions/level1.js';

export const levels = {
    1: {
        bgImageSrc: [
            'assets/level_1/bg1.png',
            'assets/level_1/bg2.png',
            'assets/level_1/bg3.png',
            'assets/level_1/bg4.png',
            'assets/level_1/bg5.png'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6],
        groundImageSrc: 'assets/level_1/ground_buildings.png',
        collisionBlocks: level1Collisions,
        gravity: 1,
        canvasHeight: 640,
        playerSprites: {
            idleRight: 'assets/player/idleRight.png',
            idleLeft:  'assets/player/idleLeft.png',
            runRight:  'assets/player/runRight.png',
            runLeft:   'assets/player/runLeft.png',
            jumpLeft:  'assets/player/jumpLeft.png',
            jumpRight: 'assets/player/jumpRight.png'
        },
        npcs: [
            {
                id: 'hero1',
                x: 500,
                y: 364,
                sprite:         'assets/npcs/hero1Idle.png',
                frameCount:     8,
                animationSpeed: 150
            }
        ]
    }
};
