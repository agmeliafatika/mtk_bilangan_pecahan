/**
 * Pecahan Ceria - Gamification & State Manager
 * Handles XP, Levels, Badges, Quests, Avatars, Hearts, LocalStorage & Confetti.
 */

class GamificationManager {
  constructor() {
    this.storageKey = 'pecahan_ceria_state_v1';
    this.state = this.loadState();
    this.badgesList = [
      { id: 'first_step', icon: '🚀', title: 'Langkah Pertama', desc: 'Membuka dan membaca materi pecahan' },
      { id: 'pizza_chef', icon: '🍕', title: 'Koki Pizza Cilik', desc: 'Sajikan pesanan benar di Dapur Pizza' },
      { id: 'star_catcher', icon: '⭐', title: 'Penangkap Ulung', desc: 'Raih skor 50+ di Game Tangkap Bintang' },
      { id: 'video_watcher', icon: '🎬', title: 'Penonton Rajin', desc: 'Tonton video materi dan selesaikan checkpoint' },
      { id: 'quiz_master', icon: '🏆', title: 'Juara Kuis', desc: 'Selesaikan kuis dengan nilai 80 ke atas' },
      { id: 'collector', icon: '👑', title: 'Kolektor XP', desc: 'Capai total lebih dari 300 XP' }
    ];

    this.levelTitles = [
      { level: 1, title: 'Penjelajah Pemula', minXp: 0, maxXp: 150 },
      { level: 2, title: 'Koki Pecahan Cilik', minXp: 150, maxXp: 350 },
      { level: 3, title: 'Detektif Matematika', minXp: 350, maxXp: 600 },
      { level: 4, title: 'Ahli Pecahan Juara', minXp: 600, maxXp: 1000 },
      { level: 5, title: 'Master Matematika SD', minXp: 1000, maxXp: 9999 }
    ];

    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.confettiParticles = [];
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return {
      playerName: 'Bintang Juara',
      playerAvatar: '🐰',
      avatarName: 'Roro si Kelinci',
      xp: 40,
      hearts: 3,
      badges: ['first_step'],
      quests: {
        explore_lab: false,
        play_pizza: false,
        watch_video: false,
        finish_quiz: false
      },
      stats: {
        pizzaOrdersSolved: 0,
        catcherHighScore: 0,
        quizScores: [],
        videosWatched: 0
      }
    };
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.updateHUD();
  }

  getCurrentLevelInfo() {
    const xp = this.state.xp;
    let current = this.levelTitles[0];
    for (let i = 0; i < this.levelTitles.length; i++) {
      if (xp >= this.levelTitles[i].minXp) {
        current = this.levelTitles[i];
      }
    }
    return current;
  }

  addXP(amount, reason = '') {
    const oldLevel = this.getCurrentLevelInfo().level;
    this.state.xp += amount;

    if (reason) {
      this.showToast(`+${amount} XP! ⭐ ${reason}`);
    }

    if (window.soundEngine) {
      window.soundEngine.playCoin();
    }

    const newLevel = this.getCurrentLevelInfo().level;
    if (newLevel > oldLevel) {
      this.onLevelUp(newLevel);
    }

    // Check collector badge
    if (this.state.xp >= 300) {
      this.unlockBadge('collector');
    }

    this.saveState();
  }

  onLevelUp(level) {
    const info = this.getCurrentLevelInfo();
    this.showToast(`🎉 NAIK LEVEL ${level}! Gelar: ${info.title}`, 4000);
    if (window.soundEngine) {
      window.soundEngine.playLevelUp();
    }
    this.triggerConfetti();
  }

  unlockBadge(badgeId) {
    if (!this.state.badges.includes(badgeId)) {
      this.state.badges.push(badgeId);
      const b = this.badgesList.find(item => item.id === badgeId);
      if (b) {
        this.showToast(`🏅 Lencana Baru: ${b.icon} ${b.title}!`);
      }
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
      }
      this.triggerConfetti();
      this.saveState();
    }
  }

  completeQuest(questKey, xpReward = 30, questName = '') {
    if (this.state.quests && !this.state.quests[questKey]) {
      this.state.quests[questKey] = true;
      this.addXP(xpReward, `Misi Selesai: ${questName}`);
      this.saveState();
    }
  }

  setHearts(val) {
    this.state.hearts = Math.max(0, Math.min(3, val));
    this.saveState();
  }

  resetHearts() {
    this.state.hearts = 3;
    this.saveState();
  }

  setProfile(name, avatar, avatarName) {
    if (name) this.state.playerName = name.trim();
    if (avatar) this.state.playerAvatar = avatar;
    if (avatarName) this.state.avatarName = avatarName;
    this.saveState();
    this.showToast(`Profil diperbarui! Halo ${this.state.playerName} ${this.state.playerAvatar}`);
  }

  updateHUD() {
    // Player avatar & name
    const avatarEls = document.querySelectorAll('.profile-avatar');
    avatarEls.forEach(el => el.textContent = this.state.playerAvatar);

    const nameEls = document.querySelectorAll('.profile-name');
    nameEls.forEach(el => el.textContent = this.state.playerName);

    // Level info
    const levelInfo = this.getCurrentLevelInfo();
    const levelEls = document.querySelectorAll('.profile-level');
    levelEls.forEach(el => el.textContent = `Lv.${levelInfo.level} - ${levelInfo.title}`);

    // XP displays
    const xpNumberEls = document.querySelectorAll('.xp-display-number');
    xpNumberEls.forEach(el => el.textContent = `${this.state.xp} XP`);

    // XP Progress bar
    const xpSpan = levelInfo.maxXp - levelInfo.minXp;
    const xpCurrentInLevel = this.state.xp - levelInfo.minXp;
    const percent = Math.min(100, Math.max(10, Math.round((xpCurrentInLevel / xpSpan) * 100)));
    const xpBar = document.querySelector('.xp-bar-inner');
    if (xpBar) {
      xpBar.style.width = `${percent}%`;
    }

    // Hearts
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, idx) => {
      if (idx < this.state.hearts) {
        heart.classList.remove('lost');
        heart.textContent = '❤️';
      } else {
        heart.classList.add('lost');
        heart.textContent = '🤍';
      }
    });

    // Badge counter
    const badgeCounter = document.querySelector('.badge-counter');
    if (badgeCounter) {
      badgeCounter.textContent = this.state.badges.length;
    }

    // Update Home Stats
    const statXp = document.getElementById('statTotalXp');
    if (statXp) statXp.textContent = this.state.xp;

    const statBadges = document.getElementById('statTotalBadges');
    if (statBadges) statBadges.textContent = this.state.badges.length;

    const statPizza = document.getElementById('statPizzaOrders');
    if (statPizza) statPizza.textContent = this.state.stats.pizzaOrdersSolved;

    const statQuiz = document.getElementById('statQuizBest');
    if (statQuiz) {
      const best = this.state.stats.quizScores.length ? Math.max(...this.state.stats.quizScores) : 0;
      statQuiz.textContent = `${best}%`;
    }
  }

  showToast(message, duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);
  }

  /* Confetti Particle Cannon */
  initConfetti() {
    this.confettiCanvas = document.getElementById('confettiCanvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.resizeConfetti();
    window.addEventListener('resize', () => this.resizeConfetti());
  }

  resizeConfetti() {
    if (!this.confettiCanvas) return;
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  triggerConfetti() {
    if (!this.confettiCanvas) this.initConfetti();
    if (!this.confettiCanvas) return;

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#FBBF24'];
    for (let i = 0; i < 90; i++) {
      this.confettiParticles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
        y: window.innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    if (!this.isAnimatingConfetti) {
      this.isAnimatingConfetti = true;
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.confettiCtx) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = 0; i < this.confettiParticles.length; i++) {
      const p = this.confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.rotation += p.rotSpeed;
      p.alpha -= 0.012;

      this.confettiCtx.save();
      this.confettiCtx.globalAlpha = Math.max(0, p.alpha);
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      this.confettiCtx.restore();
    }

    this.confettiParticles = this.confettiParticles.filter(p => p.alpha > 0 && p.y < window.innerHeight + 50);

    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.isAnimatingConfetti = false;
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }
}

// Global gamification instance
window.gameManager = new GamificationManager();
