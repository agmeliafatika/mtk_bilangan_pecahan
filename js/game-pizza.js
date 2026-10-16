/**
 * Game 1: Dapur Chef Pizza Pecahan (Pizza Chef Academy)
 * Fun interactive pizza fraction kitchen with cute animal customers, topping placement, combos, and stars!
 */

class PizzaGame {
  constructor() {
    this.customers = [
      {
        name: 'Roro si Kelinci',
        avatar: '🐰',
        requestNum: 3,
        requestDen: 8,
        topping: '🍄 Jamur Lezat',
        toppingIcon: '🍄',
        dialogue: 'Halo Chef! Tolong buatkan pizza dengan 3/8 bagian topping jamur ya!'
      },
      {
        name: 'Bimo si Beruang',
        avatar: '🐻',
        requestNum: 4,
        requestDen: 6,
        topping: '🧀 Keju Meleleh',
        toppingIcon: '🧀',
        dialogue: 'Aum! Aku lapar sekali, buatkan aku 4/6 pizza penuh keju lumer!'
      },
      {
        name: 'Kiko si Burung Hantu',
        avatar: '🦉',
        requestNum: 2,
        requestDen: 4,
        topping: '🍅 Tomat Segar',
        toppingIcon: '🍅',
        dialogue: 'Halo kawan cerdas! Aku pesan 2/4 bagian pizza dengan irisan tomat merah manis!'
      },
      {
        name: 'Fani si Rubah',
        avatar: '🦊',
        requestNum: 5,
        requestDen: 8,
        topping: '🥩 Sosis Panggang',
        toppingIcon: '🥩',
        dialogue: 'Hai Chef! Bisakah kamu buatkan 5/8 bagian pizza dengan potongan sosis renyah?'
      },
      {
        name: 'Pandu si Panda',
        avatar: '🐼',
        requestNum: 3,
        requestDen: 6,
        topping: '🌽 Jagung Manis',
        toppingIcon: '🌽',
        dialogue: 'Nyam! Aku suka sekali jagung manis, tolong beri topping pada 3/6 bagian pizza ya!'
      }
    ];

    this.currentOrderIdx = 0;
    this.activeCustomer = null;
    this.selectedDenominator = 8;
    this.selectedSlices = new Set();
    this.roundScore = 0;
    this.stars = 0;
  }

  init() {
    this.startNewSession();
  }

  startNewSession() {
    this.currentOrderIdx = 0;
    this.roundScore = 0;
    this.loadCustomer(this.currentOrderIdx);
  }

  loadCustomer(index) {
    this.activeCustomer = this.customers[index % this.customers.length];
    this.selectedDenominator = this.activeCustomer.requestDen;
    this.selectedSlices.clear();

    const avatarEl = document.getElementById('pizzaCustomerAvatar');
    const nameEl = document.getElementById('pizzaCustomerName');
    const bubbleEl = document.getElementById('pizzaCustomerDialogue');
    const orderTag = document.getElementById('pizzaOrderFractionTag');
    const roundTag = document.getElementById('pizzaRoundTag');

    if (avatarEl) avatarEl.textContent = this.activeCustomer.avatar;
    if (nameEl) nameEl.textContent = this.activeCustomer.name;
    if (bubbleEl) bubbleEl.textContent = `"${this.activeCustomer.dialogue}"`;
    if (orderTag) orderTag.textContent = `${this.activeCustomer.requestNum}/${this.activeCustomer.requestDen} (${this.activeCustomer.topping})`;
    if (roundTag) roundTag.textContent = `Pesanan ${this.currentOrderIdx + 1} dari 3`;

    this.renderPizzaWorkspace();
    this.updateOrderFeedback('');
  }

  changeDenominator(den) {
    if (window.soundEngine) window.soundEngine.playPop();
    this.selectedDenominator = den;
    this.selectedSlices.clear();
    this.renderPizzaWorkspace();
  }

  renderPizzaWorkspace() {
    const container = document.getElementById('pizzaSlicesInteractive');
    const countLabel = document.getElementById('pizzaSelectedCountLabel');
    if (!container) return;

    container.innerHTML = '';
    const selectedCount = this.selectedSlices.size;

    if (countLabel) {
      countLabel.innerHTML = `Topping terpasang: <strong style="color:#D97706; font-size:1.2rem;">${selectedCount}/${this.selectedDenominator}</strong> bagian.`;
    }

    for (let i = 0; i < this.selectedDenominator; i++) {
      const btn = document.createElement('button');
      const isSelected = this.selectedSlices.has(i);
      btn.className = `pizza-slice-btn ${isSelected ? 'selected' : ''}`;
      btn.innerHTML = isSelected ? this.activeCustomer.toppingIcon : '🍕';
      btn.title = `Potongan ${i + 1}`;

      btn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playPop();
        if (this.selectedSlices.has(i)) {
          this.selectedSlices.delete(i);
        } else {
          this.selectedSlices.add(i);
        }
        this.renderPizzaWorkspace();
      });

      container.appendChild(btn);
    }
  }

  servePizza() {
    const selectedCount = this.selectedSlices.size;
    const reqNum = this.activeCustomer.requestNum;
    const reqDen = this.activeCustomer.requestDen;

    // Check exact or equivalent match!
    const playerRatio = selectedCount / this.selectedDenominator;
    const targetRatio = reqNum / reqDen;

    const isMatch = Math.abs(playerRatio - targetRatio) < 0.001;

    if (isMatch) {
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.roundScore += 100;

      if (window.gameManager) {
        window.gameManager.addXP(40, `Pesanan Chef Sukses (+40 XP)`);
        window.gameManager.unlockBadge('pizza_chef');
        window.gameManager.completeQuest('play_pizza', 40, 'Bermain di Dapur Pizza');
        window.gameManager.state.stats.pizzaOrdersSolved++;
        window.gameManager.saveState();
      }

      this.updateOrderFeedback(`🎉 HEBAT SEKALI! Pesanan ${this.activeCustomer.name} benar! (${selectedCount}/${this.selectedDenominator} bagian = ${reqNum}/${reqDen}).`, true);

      // Next round after brief delay
      setTimeout(() => {
        this.currentOrderIdx++;
        if (this.currentOrderIdx < 3) {
          this.loadCustomer(this.currentOrderIdx);
        } else {
          this.finishSession();
        }
      }, 2000);
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      this.updateOrderFeedback(`❌ Hmm, potongan topping belum pas. Pelanggan meminta ${reqNum}/${reqDen}, sedangkan Chef membuat ${selectedCount}/${this.selectedDenominator}. Ayo perbaiki!`, false);
    }
  }

  updateOrderFeedback(text, isSuccess = true) {
    const feedbackBox = document.getElementById('pizzaFeedbackMsg');
    if (!feedbackBox) return;

    if (!text) {
      feedbackBox.style.display = 'none';
      return;
    }

    feedbackBox.style.display = 'block';
    feedbackBox.style.backgroundColor = isSuccess ? '#DCFCE7' : '#FEE2E2';
    feedbackBox.style.color = isSuccess ? '#15803D' : '#B91C1C';
    feedbackBox.style.borderColor = isSuccess ? '#86EFAC' : '#FCA5A5';
    feedbackBox.innerHTML = text;
  }

  finishSession() {
    const container = document.getElementById('pizzaKitchenWorkspace');
    if (window.soundEngine) window.soundEngine.playLevelUp();
    if (window.gameManager) window.gameManager.triggerConfetti();

    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: #fff; border-radius: 20px; border: 3px solid #FCD34D;">
          <div style="font-size: 4rem; margin-bottom: 0.5rem;">👨‍🍳⭐⭐⭐</div>
          <h3 style="font-family: var(--font-display); font-size: 2rem; color: #B45309;">Sesi Dapur Selesai!</h3>
          <p style="font-size: 1.15rem; color: #475569; margin: 0.5rem 0 1.5rem 0;">
            Semua 3 pelanggan sangat senang dan kenyang menikmati pizzamu! Skor Sesi: <strong>${this.roundScore} Poin</strong>.
          </p>
          <button class="btn btn-amber btn-lg" onclick="window.pizzaGame.startNewSession()">
            🔄 Layani Pelanggan Baru Lagi
          </button>
        </div>
      `;
    }
  }
}

// Global instance
window.pizzaGame = new PizzaGame();
