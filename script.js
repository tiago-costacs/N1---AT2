class QuizApp {
  constructor() {
    this.currentQuestion = 0;
    this.answers = new Array(GameData.questions.length).fill(null);
    this.scores = { A: 0, B: 0, C: 0 };
  }
 
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + id).classList.add('active');
  }
 
  startQuiz() {
    this.currentQuestion = 0;
    this.answers = new Array(GameData.questions.length).fill(null);
    this.scores = { A: 0, B: 0, C: 0 };
    this.showScreen('quiz');
    this.renderQuestion();
  }
 
  renderQuestion() {
    const q = GameData.questions[this.currentQuestion];
    const total = GameData.questions.length;
    const idx = this.currentQuestion;
 
    document.getElementById('question-counter').textContent =
      `Pergunta ${idx + 1} de ${total}`;
    document.getElementById('question-text').textContent = q.text;
    document.getElementById('progress-bar').style.width =
      `${((idx + 1) / total) * 100}%`;
 
    const letters = ['A', 'B', 'C'];
    const list = document.getElementById('options-list');
    list.innerHTML = '';
 
    q.options.forEach((opt, i) => {
      const li = document.createElement('li');
      li.className = 'option-item' + (this.answers[idx] === i ? ' selected' : '');
      li.innerHTML = `
        <span class="option-letter">${letters[i]}</span>
        <span>${opt.text}</span>
      `;
      li.addEventListener('click', () => this.selectOption(i));
      list.appendChild(li);
    });
 
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    btnNext.disabled = this.answers[idx] === null;
    btnNext.textContent = idx === total - 1 ? 'Ver Resultado ✦' : 'Próxima →';
    btnBack.style.display = idx === 0 ? 'none' : 'block';
  }
 
  selectOption(optionIndex) {
    this.answers[this.currentQuestion] = optionIndex;
    document.querySelectorAll('.option-item').forEach((el, i) => {
      el.classList.toggle('selected', i === optionIndex);
    });
    document.getElementById('btn-next').disabled = false;
  }
 
  nextQuestion() {
    if (this.answers[this.currentQuestion] === null) return;
    if (this.currentQuestion < GameData.questions.length - 1) {
      this.currentQuestion++;
      this.renderQuestion();
    } else {
      this.calculateResult();
    }
  }
 
  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.renderQuestion();
    }
  }
 
  calculateResult() {
    this.scores = { A: 0, B: 0, C: 0 };
    this.answers.forEach((answerIdx, qIdx) => {
      if (answerIdx !== null) {
        const opt = GameData.questions[qIdx].options[answerIdx];
        this.scores.A += opt.scores.A;
        this.scores.B += opt.scores.B;
        this.scores.C += opt.scores.C;
      }
    });
    this.showResult();
  }
 
  showResult() {
    const winnerId = Object.keys(this.scores).reduce((a, b) =>
      this.scores[a] >= this.scores[b] ? a : b
    );
    const winner = GameData.characters.find(c => c.id === winnerId);
 
    document.getElementById('result-name').textContent = winner.name;
    document.getElementById('result-name').style.color = winner.color;
    document.getElementById('result-role').textContent = winner.role;
    document.getElementById('result-desc').textContent = winner.description;
 
    const avatar = document.getElementById('result-avatar');
    avatar.textContent = winner.emoji;
    avatar.className = `result-avatar ${winner.cssClass}`;
 
    const grid = document.getElementById('scores-grid');
    grid.innerHTML = '';
    GameData.characters.forEach(char => {
      const isWinner = char.id === winnerId;
      const div = document.createElement('div');
      div.className = 'score-card' + (isWinner ? ' winner' : '');
      div.innerHTML = `
        <div class="score-char">${char.name}</div>
        <div class="score-val">${this.scores[char.id]}</div>
        <div class="score-label">pontos</div>
      `;
      grid.appendChild(div);
    });
 
    this.showScreen('result');
  }
 
  restart() {
    this.startQuiz();
  }
 
  goHome() {
    this.showScreen('welcome');
  }
}
 
const App = new QuizApp();