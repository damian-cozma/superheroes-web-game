import { t } from '../i18n/i18n.js';

export class QuizSystem {
  constructor(onSuccess, onFail, questions) {
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.questions = questions;
    this.current = 0;
    this.container = null;
  }

  start() {
    this.current = 0;
    this._showQuestion();
  }

  _showQuestion() {
    if (this.container) this.container.remove();
    const q = this.questions[this.current];
    this.container = document.createElement('div');
    this.container.className = 'quiz-popup';
    this.container.innerHTML = `
      <div class="quiz-question">${t(q.question)}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button data-idx="${i}">${t(opt)}</button>`).join('')}
      </div>
    `;
    document.body.appendChild(this.container);
    this.container.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => this._checkAnswer(parseInt(btn.dataset.idx));
    });
  }

  _checkAnswer(idx) {
    const q = this.questions[this.current];
    if (idx === q.answer) {
      this.current++;
      if (this.current >= this.questions.length) {
        this._finish(true);
      } else {
        this._showQuestion();
      }
    } else {
      this._finish(false);
    }
  }

  _finish(success) {
    if (this.container) this.container.remove();
    if (success) this.onSuccess && this.onSuccess();
    else this.onFail && this.onFail();
  }
}
