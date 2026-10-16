/**
 * Game 2: Tangkap Bintang Pecahan (Fraction Catcher Arcade)
 * Canvas-based arcade game where kids catch equivalent fraction stars using a basket.
 */

class CatcherGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isPlaying = false;
    this.animationId = null;

    this.score = 0;
    this.lives = 3;
    this.highScore = parseInt(localStorage.getItem('pecahan_catcher_hi') || '0', 10);

    // Target fractions list
    this.targetPool = [
      {
        display: '1/2',
        value: 0.5,
        equivalents: ['2/4', '3/6', '4/8', '5/10', '6/12'],
        distractors: ['1/3', '2/5', '3/8', '4/7', '2/3', '3/5']
      },
      {
        display: '1/3',
        value: 1 / 3,
        equivalents: ['2/6', '3/9', '4/12'],
        distractors: ['1/2', '2/5', '3/8', '1/4', '2/4']
      },
      {
        display: '1/4',
        value: 0.25,
        equivalents: ['2/8', '3/12'],
        distractors: ['1/2', '1/3', '2/6', '3/8', '2/5']
      },
      {
        display: '2/3',
        value: 2 / 3,
        equivalents: ['4/6', '6/9', '8/12'],
        distractors: ['1/2', '3/4', '2/5', '1/3', '5/8']
      },
      {
        display: '3/4',
        value: 0.75,
        equivalents: ['6/8', '9/12'],
        distractors: ['1/2', '2/3', '4/6', '3/5', '5/6']
      }
    ];

    this.currentTarget = null;
    this.basket = {
      x: 200,
      y: 380,
      width: 90,
      height: 36,
      speed: 8
    };

    this.items = [];
    this.spawnTimer = 0;
    this.keys = { left: false, right: false };
    this.floatingTexts = [];
  }

  init() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.bindControls();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth || 700;
      this.canvas.height = 420;
      this.basket.y = this.canvas.height - 48;
    }
  }

  bindControls() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
    });

    // Touch & Mouse drag
    const moveBasketTo = (clientX) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      this.basket.x = Math.max(0, Math.min(this.canvas.width - this.basket.width, relativeX - this.basket.width / 2));
    };

    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        if (this.isPlaying) moveBasketTo(e.clientX);
      });

      this.canvas.addEventListener('touchmove', (e) => {
        if (this.isPlaying && e.touches.length > 0) {
          moveBasketTo(e.touches[0].clientX);
          e.preventDefault();
        }
      }, { passive: false });
    }

    // On-screen buttons
    const btnLeft = document.getElementById('btnArcadeLeft');
    const btnRight = document.getElementById('btnArcadeRight');

    if (btnLeft && btnRight) {
      btnLeft.addEventListener('mousedown', () => this.keys.left = true);
      btnLeft.addEventListener('mouseup', () => this.keys.left = false);
      btnLeft.addEventListener('touchstart', (e) => { this.keys.left = true; e.preventDefault(); });
      btnLeft.addEventListener('touchend', () => this.keys.left = false);

      btnRight.addEventListener('mousedown', () => this.keys.right = true);
      btnRight.addEventListener('mouseup', () => this.keys.right = false);
      btnRight.addEventListener('touchstart', (e) => { this.keys.right = true; e.preventDefault(); });
      btnRight.addEventListener('touchend', () => this.keys.right = false);
    }
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.lives = 3;
    this.items = [];
    this.floatingTexts = [];
    this.pickNextTarget();

    const startBtn = document.getElementById('btnStartCatcher');
    if (startBtn) startBtn.style.display = 'none';

    this.resizeCanvas();
    this.basket.x = this.canvas.width / 2 - this.basket.width / 2;

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.loop();
  }

  pickNextTarget() {
    const nextIdx = Math.floor(Math.random() * this.targetPool.length);
    this.currentTarget = this.targetPool[nextIdx];

    const targetEl = document.getElementById('catcherTargetDisplay');
    if (targetEl) {
      targetEl.innerHTML = `⭐ Cari Pecahan Senilai dengan: <span style="font-size:1.6rem; color:#FDE047; text-shadow:0 0 8px #F59E0B;">${this.currentTarget.display}</span>`;
    }
  }

  spawnItem() {
    if (!this.currentTarget) return;

    // 50% chance of equivalent, 50% chance of distractor
    const isCorrect = Math.random() < 0.52;
    let text = '';

    if (isCorrect) {
      const eq = this.currentTarget.equivalents;
      text = eq[Math.floor(Math.random() * eq.length)];
    } else {
      const dis = this.currentTarget.distractors;
      text = dis[Math.floor(Math.random() * dis.length)];
    }

    const item = {
      x: 30 + Math.random() * (this.canvas.width - 80),
      y: -30,
      radius: 26,
      speed: 2 + Math.random() * 1.5,
      text: text,
      isCorrect: isCorrect,
      color: isCorrect ? '#F59E0B' : '#64748B'
    };

    this.items.push(item);
  }

  loop() {
    if (!this.isPlaying) return;

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    // Basket movement via keys
    if (this.keys.left) {
      this.basket.x = Math.max(0, this.basket.x - this.basket.speed);
    }
    if (this.keys.right) {
      this.basket.x = Math.min(this.canvas.width - this.basket.width, this.basket.x + this.basket.speed);
    }

    // Spawn falling stars
    this.spawnTimer++;
    if (this.spawnTimer > 60) {
      this.spawnItem();
      this.spawnTimer = 0;
    }

    // Update items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.speed;

      // Collision check with basket
      if (
        item.y + item.radius >= this.basket.y &&
        item.y - item.radius <= this.basket.y + this.basket.height &&
        item.x + item.radius >= this.basket.x &&
        item.x - item.radius <= this.basket.x + this.basket.width
      ) {
        // Caught!
        if (item.isCorrect) {
          if (window.soundEngine) window.soundEngine.playCoin();
          this.score += 10;
          this.floatingTexts.push({
            x: item.x,
            y: this.basket.y,
            text: `+10 Benar! (${item.text})`,
            color: '#10B981',
            alpha: 1
          });

          // Change target every 30 points
          if (this.score % 30 === 0) {
            this.pickNextTarget();
          }

          if (this.score >= 50 && window.gameManager) {
            window.gameManager.unlockBadge('star_catcher');
          }
        } else {
          if (window.soundEngine) window.soundEngine.playWrong();
          this.lives--;
          this.floatingTexts.push({
            x: item.x,
            y: this.basket.y,
            text: `Oops Salah! (${item.text})`,
            color: '#EF4444',
            alpha: 1
          });

          if (this.lives <= 0) {
            this.gameOver();
            return;
          }
        }

        this.items.splice(i, 1);
        continue;
      }

      // Fell off bottom
      if (item.y > this.canvas.height + 40) {
        this.items.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 1.2;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Basket
    this.ctx.save();
    this.ctx.fillStyle = '#4F46E5';
    this.ctx.beginPath();
    this.ctx.roundRect(this.basket.x, this.basket.y, this.basket.width, this.basket.height, 12);
    this.ctx.fill();
    this.ctx.strokeStyle = '#818CF8';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Basket rim & icon
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Fredoka, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('🧺', this.basket.x + this.basket.width / 2, this.basket.y + this.basket.height / 2);
    this.ctx.restore();

    // Draw Falling Fraction Bubbles
    for (let item of this.items) {
      this.ctx.save();
      // Glowing bubble
      this.ctx.fillStyle = item.isCorrect ? '#FEF08A' : '#E2E8F0';
      this.ctx.strokeStyle = item.isCorrect ? '#F59E0B' : '#94A3B8';
      this.ctx.lineWidth = 3;

      this.ctx.beginPath();
      this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Text inside bubble
      this.ctx.fillStyle = item.isCorrect ? '#B45309' : '#334155';
      this.ctx.font = 'bold 16px Fredoka, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(item.text, item.x, item.y);
      this.ctx.restore();
    }

    // Draw HUD text (Score & Lives)
    this.ctx.save();
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 18px Fredoka, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Skor: ${this.score}`, 16, 28);

    // Hearts
    this.ctx.textAlign = 'right';
    let heartsText = '';
    for (let h = 0; h < 3; h++) {
      heartsText += h < this.lives ? '❤️ ' : '🤍 ';
    }
    this.ctx.fillText(`Nyawa: ${heartsText}`, this.canvas.width - 16, 28);
    this.ctx.restore();

    // Draw Floating Texts
    for (let ft of this.floatingTexts) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.fillStyle = ft.color;
      this.ctx.font = 'bold 16px Fredoka, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    }
  }

  gameOver() {
    this.isPlaying = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('pecahan_catcher_hi', this.highScore.toString());
    }

    if (window.gameManager) {
      window.gameManager.addXP(Math.min(50, Math.floor(this.score / 2)), `Game Tangkap Bintang (${this.score} Pts)`);
      if (this.score > window.gameManager.state.stats.catcherHighScore) {
        window.gameManager.state.stats.catcherHighScore = this.score;
        window.gameManager.saveState();
      }
    }

    // Draw Game Over Screen on Canvas
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#F43F5E';
    this.ctx.font = 'bold 36px Fredoka, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Permainan Selesai!', this.canvas.width / 2, this.canvas.height / 2 - 40);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 22px Fredoka, sans-serif';
    this.ctx.fillText(`Skor Akhir: ${this.score} Poin`, this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.fillStyle = '#FDE047';
    this.ctx.font = '16px Fredoka, sans-serif';
    this.ctx.fillText(`Skor Tertinggi: ${this.highScore} Poin`, this.canvas.width / 2, this.canvas.height / 2 + 35);
    this.ctx.restore();

    const startBtn = document.getElementById('btnStartCatcher');
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = '🔄 Main Lagi';
    }
  }
}

// Global instance
window.catcherGame = new CatcherGame();
