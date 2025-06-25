import { collisions as level1Collisions } from '../../collisions/level1.js';
import { collisions as level2Collisions } from '../../collisions/level2.js';
import { collisions as level3Collisions } from '../../collisions/level3.js';

export const levels = {
    1: {
        bgImageSrc: [
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg1.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg2.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg3.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg4.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/bg5.png'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6],
        groundImageSrc: 'https://d1wlpmgdj7hm5h.cloudfront.net/level_1/ground_buildings.png',
        collisionBlocks: level1Collisions,
        gravity: 1,
        hasQuiz: true,
        canvasHeight: 640,
        playerSprites: {
            idleRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleRight.png',
            idleLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleLeft.png',
            runRight:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/runRight.png',
            runLeft:   'https://d1wlpmgdj7hm5h.cloudfront.net/player/runLeft.png',
            jumpLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpLeft.png',
            jumpRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpRight.png'
        },
        npcs: [
            {
                id: 'ironman',
                x: 500,
                y: 333,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/ironman.png',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'blackwidow',
                x: 1200,
                y: 10,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/blackwidow.png',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'thor',
                x: 2700,
                y: 140,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/thor.png',
                frameCount:     3,
                animationSpeed: 180
            },
            {
                id: 'captainamerica',
                x: 3800,
                y: 360,
                sprite:         'https://d1wlpmgdj7hm5h.cloudfront.net/npcs/captainamerica.png',
                frameCount:     3,
                animationSpeed: 140
            }
        ]
    },
    2: {
        bgImageSrc: [
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg1.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg2.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg3.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg4.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/bg5.png'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6],
        groundImageSrc: 'https://d1wlpmgdj7hm5h.cloudfront.net/level_2/ground.png',
        collisionBlocks: level2Collisions,
        gravity: 1,
        canvasHeight: 640,
        playerSprites: {
            idleRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleRight.png',
            idleLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleLeft.png',
            runRight:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/runRight.png',
            runLeft:   'https://d1wlpmgdj7hm5h.cloudfront.net/player/runLeft.png',
            jumpLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpLeft.png',
            jumpRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpRight.png'
        },
        npcs: [
            {
                id: 'nickfury',
                x: 800,
                y: 170,
                sprite:         'assets/npcs/nickfury.png',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'hulk',
                x: 2150,
                y: 235,
                sprite:          'assets/npcs/hulk.png',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'mariahill',
                x: 4000,
                y: 430,
                sprite:          'assets/npcs/mariahill.png',
                frameCount:     3,
                animationSpeed: 180
            }
        ]
    },
    3: {
        bgImageSrc: [
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg1.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg2.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg3.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg4.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg5.png',
            'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/bg6.png'
        ],
        parallaxSpeeds: [0.1, 0.2, 0.3, 0.4, 0.6, 0.7],
        groundImageSrc: 'https://d1wlpmgdj7hm5h.cloudfront.net/level_3/ground.png',
        collisionBlocks: [],
        levelCollisions: level3Collisions,
        gravity: 1,
        canvasHeight: 640,
        playerSprites: {
            idleRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleRight.png',
            idleLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/idleLeft.png',
            runRight:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/runRight.png',
            runLeft:   'https://d1wlpmgdj7hm5h.cloudfront.net/player/runLeft.png',
            jumpLeft:  'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpLeft.png',
            jumpRight: 'https://d1wlpmgdj7hm5h.cloudfront.net/player/jumpRight.png'
        },
        npcs: [
            {
                id: 'loki',
                x: 650,
                y: 400,
                sprite:         'assets/npcs/loki.png',
                frameCount:     3,
                animationSpeed: 150
            },
            {
                id: 'hawkeye',
                x: 4300,
                y: 330,
                sprite:          'assets/npcs/hawkeye.png',
                frameCount:     3,
                animationSpeed: 150
            }
        ]
    }
};
