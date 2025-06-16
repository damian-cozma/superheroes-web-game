// src/config/dialogues-config.js

export const dialogues = {
    hero1: {
        name: "Captain Codebreaker",
        lines: [
            { text: "Oh, thank goodness you're here!" },
            { text: "The city needs our help." }
        ],

        // NEW! questions array pairs prompt labels with branch keys
        questions: [
            { label: "What happened here?", branch: "hero1_q1" },
            { label: "Who are you?",         branch: "hero1_q2" }
        ]
    },

    hero1_q1: {
        name: "Captain Codebreaker",
        lines: [
            { text: "The villains attacked at dawn." },
            { text: "They overran the power plant." }
        ]
    },

    hero1_q2: {
        name: "Captain Codebreaker",
        lines: [
            { text: "I am Captain Codebreaker, protector of the innocent." },
            { text: "I've defended this town for years." }
        ]
    }
};
