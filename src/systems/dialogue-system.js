// src/systems/dialogue-system.js

import { dialogues }      from '../config/dialogues-config.js';
import { SpeechBubble }   from '../entities/speech-bubble.js';

export class DialogueSystem {
    constructor(ctx) {
        this.ctx         = ctx;
        this.bubbleImage = new Image();
        this.bubbleImage.src = 'assets/ui/chatBubble.png';
        this.active      = false;
        this.phase       = null;   // 'intro'|'questions'|'answer'
        this.queue       = [];
        this.npc         = null;
        this.bubble      = null;
    }

    update(keys, player, npcs) {
        // 1) if not active, check F‐press near NPC
        if (!this.active && keys.interact.pressed) {
            const near = npcs.find(n => n.isPlayerNear(player.getHitbox()));
            if (near) {
                this._start(near);
            }
            keys.interact.pressed = false;
        }

        // 2) if active, process next / choice
        if (this.active) {
            if (this.phase === 'questions' && keys.choice != null) {
                this._ask(keys.choice);
                keys.choice = null;
            } else if (keys.interact.pressed) {
                this._next();
                keys.interact.pressed = false;
            }
        }
    }

    // src/systems/dialogue-system.js
    draw(scrollOffset) {
        if (this.bubble) this.bubble.draw(scrollOffset);
    }


    _start(npc) {
        this.active = true;
        this.npc    = npc;
        const cfg   = dialogues[npc.dialogueId];
        this.phase  = 'intro';
        this.queue  = [...cfg.intro];
        this._next();
    }

    _next() {
        const cfg = dialogues[this.npc.dialogueId];

        if (this.queue.length > 0) {
            const line = this.queue.shift();
            this.bubble = new SpeechBubble(
                this.ctx, line,
                { x: this.npc.position.x + this.npc.frameWidth/2,
                    y: this.npc.position.y },
                this.bubbleImage
            );
            return;
        }

        if (this.phase === 'intro') {
            this.phase = 'questions';
            this._showQuestions(cfg.questions);
        } else if (this.phase === 'answer') {
            this.phase = 'questions';
            this._showQuestions(cfg.questions);
        } else {
            this._end();
        }
    }

    _showQuestions(questions) {
        const labels = questions.map((q,i) => `${i+1}:${q.label}`).join('  ');
        this.bubble = new SpeechBubble(
            this.ctx, labels,
            { x: this.npc.position.x + this.npc.frameWidth/2,
                y: this.npc.position.y },
            this.bubbleImage
        );
    }

    _ask(i) {
        const cfg = dialogues[this.npc.dialogueId];
        this.phase = 'answer';
        this.queue = [...cfg.questions[i].answer];
        this._next();
    }

    _end() {
        this.active = false;
        this.bubble = null;
        this.npc    = null;
    }
}
