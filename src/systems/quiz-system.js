import { quizQuestions } from '../config/quiz-questions.js';

export class QuizSystem {
  constructor(onSuccess, onFail) {
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.current = 0;
    this.container = null;
  }

  start() {
    this.current = 0;
    this._showQuestion();
  }

  _showQuestion() {
    if (this.container) this.container.remove();
    const q = quizQuestions[this.current];
    this.container = document.createElement('div');
    this.container.className = 'quiz-popup';
    this.container.innerHTML = `
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button data-idx="${i}">${opt}</button>`).join('')}
      </div>
    `;
    document.body.appendChild(this.container);
    this.container.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => this._checkAnswer(parseInt(btn.dataset.idx));
    });
  }

  _checkAnswer(idx) {
    const q = quizQuestions[this.current];
    if (idx === q.answer) {
      this.current++;
      if (this.current >= quizQuestions.length) {
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
