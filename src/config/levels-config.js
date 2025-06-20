import { collisions as level1Collisions } from '../../collisions/level1.js';
import { collisions as level2Collisions } from '../../collisions/level2.js';
import { collisions as level3Collisions } from '../../collisions/level3.js';

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
        hasQuiz: true,
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
                id: 'ironman',
                x: 500,
                y: 333,
                sprite:         'assets/npcs/ironman.png',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'blackwidow',
                x: 1200,
                y: 10,
                sprite:         'assets/npcs/blackwidow.png',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'thor',
                x: 2700,
                y: 140,
                sprite:         'assets/npcs/thor.png',
                frameCount:     3,
                animationSpeed: 180
            },
            {
                id: 'captainamerica',
                x: 3800,
                y: 360,
                sprite:         'assets/npcs/captainamerica.png',
                frameCount:     3,
                animationSpeed: 140
            }
        ]
    },
    2: {
        bgImageSrc: ['assets/level_2/bg1.png',
                     'assets/level_2/bg2.png',
                     'assets/level_2/bg3.png',
                     'assets/level_2/bg4.png',
                     'assets/level_2/bg5.png'],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6],
        groundImageSrc: 'assets/level_2/ground.png',
        collisionBlocks: level2Collisions,
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
        npcs: []
    },
    3: {
        bgImageSrc: [
            'assets/level_3/bg1.png',
            'assets/level_3/bg2.png',
            'assets/level_3/bg3.png',
            'assets/level_3/bg4.png',
            'assets/level_3/bg5.png',
            'assets/level_3/bg6.png'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6, 0.7],
        groundImageSrc: 'assets/level_3/ground.png',
        collisionBlocks: [],
        levelCollisions: level3Collisions,
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
        npcs: []
    }
};
