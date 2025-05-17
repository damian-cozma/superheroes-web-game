import { collisions as level1Collisions } from './collisions/level1.js';

export const levels = {
    1: {
        bgPaths: [
            'assets/level_1/bg1.png',
            'assets/level_1/bg2.png',
            'assets/level_1/bg3.png',
            'assets/level_1/bg4.png',
            'assets/level_1/bg5.png'
        ],
        groundImagePath: 'assets/level_1/ground_buildings.png',
        collisionsData: level1Collisions
    },
    // 2: {
    //     bgPaths: [
    //         'assets/level_2/bg1.png',
    //         'assets/level_2/bg2.png',
    //         'assets/level_2/bg3.png',
    //         'assets/level_2/bg4.png',
    //         'assets/level_2/bg5.png'
    //     ],
    //     groundImagePath: 'assets/level_2/ground_buildings.png',
    //     collisionData: none
    // }
};