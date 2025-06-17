export const dialogues = {
    ironman: {
        name: "Ironman",
        lines: [
            { text: "Hey, looks like you found me. Not bad!" },
            { text: "The city is in chaos—feels like a Monday." }
        ],
        questions: [
            { label: "What happened here?", branch: "ironman_q1" },
            { label: "Who are you?", branch: "ironman_q2" }
        ]
    },

    ironman_q1: {
        name: "Ironman",
        lines: [
            { text: "Some major tech got stolen from Stark Industries." },
            { text: "Without my suit’s AI systems, things are tough for all of us." }
        ],
        questions: [
            { label: "What powers your suit?", branch: "ironman_q1a" },
            { label: "Do you know who's behind this?", branch: "ironman_q1b" }
        ]
    },

    ironman_q1a: {
        name: "Ironman",
        lines: [
            { text: "My suit is powered by an Arc Reactor—a clean energy source I designed." },
            { text: "Pretty useful when the city’s power grid goes down." }
        ]
    },

    ironman_q1b: {
        name: "Ironman",
        lines: [
            { text: "No solid evidence yet, but it smells like a classic supervillain move." },
            { text: "Stay sharp—trust your instincts." }
        ]
    },

    ironman_q2: {
        name: "Ironman",
        lines: [
            { text: "Name’s Tony Stark. Genius, billionaire, playboy, philanthropist... and sometimes Avenger." },
            { text: "Underneath the suit, I’m just a guy doing his best to protect the world." }
        ]
    },

    // ────────────────────────────────

    blackwidow: {
        name: "Black Widow",
        lines: [
            { text: "You're new around here, aren't you?" },
            { text: "Trust no one until you know who they really are." }
        ],
        questions: [
            { label: "What happened here?", branch: "blackwidow_q1" },
            { label: "Who are you?", branch: "blackwidow_q2" }
        ]
    },

    blackwidow_q1: {
        name: "Black Widow",
        lines: [
            { text: "A coordinated attack wiped out communication and security systems." },
            { text: "Some say it was an inside job." }
        ],
        questions: [
            { label: "How do you know?", branch: "blackwidow_q1a" },
            { label: "Do you suspect anyone?", branch: "blackwidow_q1b" }
        ]
    },

    blackwidow_q1a: {
        name: "Black Widow",
        lines: [
            { text: "Let’s just say I have a knack for finding secrets. Old habits die hard." },
            { text: "Years of undercover work pay off in times like these." }
        ]
    },

    blackwidow_q1b: {
        name: "Black Widow",
        lines: [
            { text: "In my line of work, trust is earned, not given. I have my suspicions." },
            { text: "But until I’m sure, I keep my cards close." }
        ]
    },

    blackwidow_q2: {
        name: "Black Widow",
        lines: [
            { text: "I’m Natasha Romanoff, code name Black Widow." },
            { text: "Trained by the Red Room, former S.H.I.E.L.D. agent, and an Avenger." }
        ]
    },

    // ────────────────────────────────

    thor: {
        name: "Thor",
        lines: [
            { text: "Greetings, mortal! I sense great trouble brewing in this realm." },
            { text: "I must discover who dares disturb the peace of Midgard." }
        ],
        questions: [
            { label: "What happened here?", branch: "thor_q1" },
            { label: "Who are you?", branch: "thor_q2" }
        ]
    },

    thor_q1: {
        name: "Thor",
        lines: [
            { text: "A mighty storm swept through—unnatural, even by my standards." },
            { text: "There is a presence here I have not felt since the days of Loki." }
        ],
        questions: [
            { label: "Who is Loki?", branch: "thor_q1a" },
            { label: "How will you help?", branch: "thor_q1b" }
        ]
    },

    thor_q1a: {
        name: "Thor",
        lines: [
            { text: "Loki is my adopted brother—mischief is in his blood." },
            { text: "But even he would not risk such chaos without reason." }
        ]
    },

    thor_q1b: {
        name: "Thor",
        lines: [
            { text: "With Mjolnir, my enchanted hammer, I shall protect the innocent." },
            { text: "But I may need aid—your courage will be tested!" }
        ]
    },

    thor_q2: {
        name: "Thor",
        lines: [
            { text: "I am Thor, son of Odin, Prince of Asgard, God of Thunder." },
            { text: "Protector of this world and many others." }
        ]
    },

    // ────────────────────────────────

    captainamerica: {
        name: "Captain America",
        lines: [
            { text: "Glad to see a friendly face." },
            { text: "Times like these remind me of old Brooklyn—tough, but never hopeless." }
        ],
        questions: [
            { label: "What happened here?", branch: "captainamerica_q1" },
            { label: "Who are you?", branch: "captainamerica_q2" }
        ]
    },

    captainamerica_q1: {
        name: "Captain America",
        lines: [
            { text: "There was panic. Systems failed, and people forgot what matters most: working together." },
            { text: "A city is only as strong as its community." }
        ],
        questions: [
            { label: "How do you stay hopeful?", branch: "captainamerica_q1a" },
            { label: "What's your advice?", branch: "captainamerica_q1b" }
        ]
    },

    captainamerica_q1a: {
        name: "Captain America",
        lines: [
            { text: "No matter how dark things get, there's always a way forward if we stand together." },
            { text: "I learned that back in 1942, fighting for every inch of freedom." }
        ]
    },

    captainamerica_q1b: {
        name: "Captain America",
        lines: [
            { text: "Be brave. Do what’s right—even if it’s not easy." },
            { text: "And remember: I can do this all day." }
        ]
    },

    captainamerica_q2: {
        name: "Captain America",
        lines: [
            { text: "I’m Steve Rogers, but most know me as Captain America." },
            { text: "Super soldier, shield-bearer, and a believer in justice." }
        ]
    }
};
