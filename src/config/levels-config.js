import { collisions as level1Collisions } from '../../collisions/level1.js';
import { collisions as level2Collisions } from '../../collisions/level2.js';
import { collisions as level3Collisions } from '../../collisions/level3.js';

export const levels = {
    1: {
        bgImageSrc: [
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg1.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg2.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg3.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg4.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg5.webp'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6],
        groundImageSrc: 'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/ground_buildings.webp',
        collisionBlocks: level1Collisions,
        gravity: 1,
        hasQuiz: true,
        canvasHeight: 640,
        playerSprites: {
            idleRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleRight.webp',
            idleLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleLeft.webp',
            runRight:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/runRight.webp',
            runLeft:   'https://d1wlpmgdj7hm5h.cloudfront.net/player/runLeft.webp',
            jumpLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpLeft.webp',
            jumpRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpRight.webp'
        },
        npcs: [
            {
                id: 'ironman',
                x: 500,
                y: 333,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/ironman.webp',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'blackwidow',
                x: 1200,
                y: 10,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/blackwidow.webp',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'thor',
                x: 2700,
                y: 140,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/thor.webp',
                frameCount:     3,
                animationSpeed: 180
            },
            {
                id: 'captainamerica',
                x: 3800,
                y: 360,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/captainamerica.webp',
                frameCount:     3,
                animationSpeed: 140
            }
        ]
    },
    2: {
        bgImageSrc: [
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg1.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg2.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg3.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg4.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg5.webp'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6],
        groundImageSrc: 'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/ground.webp',
        collisionBlocks: level2Collisions,
        gravity: 1,
        hasQuiz: true,
        canvasHeight: 640,
        playerSprites: {
            idleRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleRight.webp',
            idleLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleLeft.webp',
            runRight:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/runRight.webp',
            runLeft:   'https://d1wlpmgdj7hm5h.cloudfront.net/player/runLeft.webp',
            jumpLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpLeft.webp',
            jumpRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpRight.webp'
        },
        npcs: [
            {
                id: 'nickfury',
                x: 800,
                y: 170,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/nickfury.webp',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'hulk',
                x: 2150,
                y: 235,
                sprite:          'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/hulk.webp',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'mariahill',
                x: 4000,
                y: 430,
                sprite:          'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/mariahill.webp',
                frameCount:     3,
                animationSpeed: 180
            }
        ]
    },
    3: {
        bgImageSrc: [
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg1.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg2.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg3.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg4.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg5.webp',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg6.webp'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6, 0.7],
        groundImageSrc: 'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/ground.webp',
        collisionBlocks: [],
        levelCollisions: level3Collisions,
        gravity: 1,
        hasQuiz: true,
        canvasHeight: 640,
        playerSprites: {
            idleRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleRight.webp',
            idleLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleLeft.webp',
            runRight:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/runRight.webp',
            runLeft:   'https://d1wlpmgdj7hm5h.cloudfront.net/player/runLeft.webp',
            jumpLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpLeft.webp',
            jumpRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpRight.webp'
        },
        npcs: [
            {
                id: 'loki',
                x: 650,
                y: 400,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/loki.webp',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'hawkeye',
                x: 4300,
                y: 330,
                sprite:          'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/hawkeye.webp',
                frameCount:     3,
                animationSpeed: 150
            }
        ]
    }
};
