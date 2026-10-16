/**
 * Pecahan Ceria - Interactive Math Manipulatives (Laboratorium Pecahan)
 * Pizza cutter SVG, chocolate grid, fraction wall, balance scale, addition/subtraction.
 */

class MateriManager {
  constructor() {
    this.pizzaNum = 3;
    this.pizzaDen = 8;
    this.chocTotal = 8;
    this.chocEaten = 3;

    this.scaleLeft = { num: 1, den: 2 };
    this.scaleRight = { num: 2, den: 4 };

    this.opType = 'add';
    this.opDen = 6;
    this.opNum1 = 2;
    this.opNum2 = 3;
  }

  init() {
    this.bindTabs();
    this.initPizzaExplorer();
    this.initChocolateBar();
    this.initFractionWall();
    this.initBalanceScale();
    this.initOperationLab();
  }

  bindTabs() {
    const tabBtns = document.querySelectorAll('.materi-tab-btn');
    const panels = document.querySelectorAll('.materi-content-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playPop();

        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }

        // Trigger quest progress
        if (window.gameManager) {
          window.gameManager.completeQuest('explore_lab', 30, 'Jelajahi Lab Pecahan');
          window.gameManager.unlockBadge('first_step');
        }
      });
    });
  }

  /* -------------------------------------------------------------
     1. PIZZA EXPLORER (Konsep Dasar)
     ------------------------------------------------------------- */
  initPizzaExplorer() {
    const numSlider = document.getElementById('pizzaNumSlider');
    const denSlider = document.getElementById('pizzaDenSlider');

    if (numSlider && denSlider) {
      numSlider.addEventListener('input', (e) => {
        this.pizzaNum = parseInt(e.target.value, 10);
        if (this.pizzaNum > this.pizzaDen) {
          this.pizzaNum = this.pizzaDen;
          numSlider.value = this.pizzaNum;
        }
        this.renderPizza();
      });

      denSlider.addEventListener('input', (e) => {
        this.pizzaDen = parseInt(e.target.value, 10);
        numSlider.max = this.pizzaDen;
        if (this.pizzaNum > this.pizzaDen) {
          this.pizzaNum = this.pizzaDen;
          numSlider.value = this.pizzaNum;
        }
        this.renderPizza();
      });
    }

    this.renderPizza();
  }

  renderPizza() {
    const container = document.getElementById('pizzaSvgContainer');
    const numLabel = document.getElementById('pizzaNumValue');
    const denLabel = document.getElementById('pizzaDenValue');
    const fracNum = document.getElementById('dispPizzaNum');
    const fracDen = document.getElementById('dispPizzaDen');
    const descText = document.getElementById('pizzaDescText');

    if (numLabel) numLabel.textContent = this.pizzaNum;
    if (denLabel) denLabel.textContent = this.pizzaDen;
    if (fracNum) fracNum.textContent = this.pizzaNum;
    if (fracDen) fracDen.textContent = this.pizzaDen;

    if (descText) {
      descText.innerHTML = `Kamu memilih <strong>${this.pizzaNum} potong</strong> dari total <strong>${this.pizzaDen} potong pizza</strong> yang sama besar.`;
    }

    if (!container) return;

    // Build SVG Pizza
    const size = 240;
    const center = size / 2;
    const radius = 100;
    const crustRadius = 112;

    let svg = `<svg class="pizza-svg" viewBox="0 0 ${size} ${size}">`;
    // Pizza Crust Base
    svg += `<circle cx="${center}" cy="${center}" r="${crustRadius}" fill="#D97706" stroke="#92400E" stroke-width="4"/>`;
    svg += `<circle cx="${center}" cy="${center}" r="${radius}" fill="#FEF08A" stroke="#F59E0B" stroke-width="2"/>`;

    const anglePerSlice = (2 * Math.PI) / this.pizzaDen;

    for (let i = 0; i < this.pizzaDen; i++) {
      const startAngle = i * anglePerSlice - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const isSelected = i < this.pizzaNum;
      const fillColor = isSelected ? '#F59E0B' : '#FEF9C3';
      const strokeColor = '#B45309';

      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      svg += `<path d="${pathData}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2.5" class="pizza-slice ${isSelected ? 'active' : 'empty'}" data-slice="${i}"/>`;

      // Add cute pepperonis / topping if selected
      if (isSelected) {
        const midAngle = startAngle + anglePerSlice / 2;
        const topX = center + (radius * 0.65) * Math.cos(midAngle);
        const topY = center + (radius * 0.65) * Math.sin(midAngle);
        svg += `<circle cx="${topX}" cy="${topY}" r="7" fill="#DC2626" opacity="0.85"/>`;
        svg += `<circle cx="${topX + 2}" cy="${topY - 2}" r="2" fill="#FEF2F2" opacity="0.6"/>`;
      }
    }

    svg += `</svg>`;
    container.innerHTML = svg;

    // Attach click to slices to allow direct clicking
    const slicePaths = container.querySelectorAll('.pizza-slice');
    slicePaths.forEach((path, idx) => {
      path.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playPop();
        this.pizzaNum = idx + 1;
        const numSlider = document.getElementById('pizzaNumSlider');
        if (numSlider) numSlider.value = this.pizzaNum;
        this.renderPizza();
      });
    });
  }

  /* -------------------------------------------------------------
     2. CHOCOLATE BAR MANIPULATIVE
     ------------------------------------------------------------- */
  initChocolateBar() {
    this.renderChocolate();
  }

  setChocolateTotal(total) {
    this.chocTotal = total;
    if (this.chocEaten > total) this.chocEaten = total;
    this.renderChocolate();
  }

  renderChocolate() {
    const grid = document.getElementById('chocBarGrid');
    const dispNum = document.getElementById('chocNum');
    const dispDen = document.getElementById('chocDen');
    const chocInfo = document.getElementById('chocInfo');

    const remaining = this.chocTotal - this.chocEaten;
    if (dispNum) dispNum.textContent = remaining;
    if (dispDen) dispDen.textContent = this.chocTotal;

    if (chocInfo) {
      chocInfo.innerHTML = `Sisa cokelat: <strong>${remaining}/${this.chocTotal}</strong> (dimakan ${this.chocEaten} potong). Klik potongan untuk memakannya!`;
    }

    if (!grid) return;
    grid.innerHTML = '';

    // Columns calculation: 8 -> 4x2, 6 -> 3x2, 10 -> 5x2, 12 -> 4x3
    let cols = 4;
    if (this.chocTotal === 6) cols = 3;
    if (this.chocTotal === 10) cols = 5;
    if (this.chocTotal === 12) cols = 4;

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < this.chocTotal; i++) {
      const piece = document.createElement('div');
      const isEaten = i < this.chocEaten;
      piece.className = `choc-piece ${isEaten ? 'eaten' : 'active'}`;
      piece.textContent = isEaten ? '😋' : '🍫';
      piece.title = isEaten ? 'Sudah dimakan' : 'Klik untuk makan potongan ini!';

      piece.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playPop();
        if (isEaten) {
          this.chocEaten = Math.max(0, this.chocEaten - 1);
        } else {
          this.chocEaten = Math.min(this.chocTotal, this.chocEaten + 1);
        }
        this.renderChocolate();
      });

      grid.appendChild(piece);
    }
  }

  /* -------------------------------------------------------------
     3. FRACTION WALL (Dinding Pecahan Senilai)
     ------------------------------------------------------------- */
  initFractionWall() {
    const blocks = document.querySelectorAll('.wall-block');
    const resultBox = document.getElementById('wallEquivResult');

    blocks.forEach(block => {
      block.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playPop();

        const val = parseFloat(block.getAttribute('data-value'));
        const label = block.getAttribute('data-frac');

        // Highlight matching fractions
        let matches = [];
        blocks.forEach(b => {
          const bVal = parseFloat(b.getAttribute('data-value'));
          // Tolerance for float comparison
          if (Math.abs(bVal - val) < 0.001) {
            b.classList.add('highlighted');
            const frac = b.getAttribute('data-frac');
            if (!matches.includes(frac)) matches.push(frac);
          } else {
            b.classList.remove('highlighted');
          }
        });

        if (resultBox) {
          resultBox.innerHTML = `
            <div style="font-size: 1.1rem; color: #1E293B;">
              ✨ Balok <strong>${label}</strong> memiliki panjang yang sama dengan pecahan senilai:
              <div style="margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-size: 1.3rem; font-weight: 700; color: #4F46E5;">
                ${matches.join(' = ')}
              </div>
            </div>
          `;
        }
      });
    });
  }

  /* -------------------------------------------------------------
     4. BALANCE SCALE (Membandingkan Pecahan)
     ------------------------------------------------------------- */
  initBalanceScale() {
    const leftSelect = document.getElementById('scaleLeftSelect');
    const rightSelect = document.getElementById('scaleRightSelect');

    if (leftSelect && rightSelect) {
      const updateScale = () => {
        const [lNum, lDen] = leftSelect.value.split('/').map(Number);
        const [rNum, rDen] = rightSelect.value.split('/').map(Number);
        this.scaleLeft = { num: lNum, den: lDen };
        this.scaleRight = { num: rNum, den: rDen };
        this.renderScale();
      };

      leftSelect.addEventListener('change', updateScale);
      rightSelect.addEventListener('change', updateScale);
    }

    this.renderScale();
  }

  renderScale() {
    const beam = document.getElementById('scaleBeam');
    const signBubble = document.getElementById('scaleSign');
    const explBox = document.getElementById('scaleExplanation');
    const dispLeft = document.getElementById('dispScaleLeft');
    const dispRight = document.getElementById('dispScaleRight');

    if (dispLeft) dispLeft.textContent = `${this.scaleLeft.num}/${this.scaleLeft.den}`;
    if (dispRight) dispRight.textContent = `${this.scaleRight.num}/${this.scaleRight.den}`;

    const lVal = this.scaleLeft.num / this.scaleLeft.den;
    const rVal = this.scaleRight.num / this.scaleRight.den;

    let deg = 0;
    let sign = '=';
    let text = '';

    if (lVal > rVal) {
      deg = -14; // Left tilts downward
      sign = '>';
      text = `<strong>${this.scaleLeft.num}/${this.scaleLeft.den} LEBIH BESAR (>)</strong> daripada <strong>${this.scaleRight.num}/${this.scaleRight.den}</strong> karena nilainya lebih banyak!`;
    } else if (lVal < rVal) {
      deg = 14; // Right tilts downward
      sign = '<';
      text = `<strong>${this.scaleLeft.num}/${this.scaleLeft.den} LEBIH KECIL (<)</strong> daripada <strong>${this.scaleRight.num}/${this.scaleRight.den}</strong>.`;
    } else {
      deg = 0; // Balanced
      sign = '=';
      text = `<strong>${this.scaleLeft.num}/${this.scaleLeft.den} SAMA DENGAN (=)</strong> <strong>${this.scaleRight.num}/${this.scaleRight.den}</strong>. Keduanya adalah pecahan senilai!`;
    }

    if (beam) beam.style.transform = `rotate(${deg}deg)`;
    if (signBubble) signBubble.textContent = sign;

    if (explBox) {
      explBox.innerHTML = `
        <div style="background: #fff; padding: 1rem 1.25rem; border-radius: 12px; border: 2px solid #BAE6FD; text-align: center;">
          <p style="font-size: 1.1rem; color: #0369A1; margin-bottom: 0.35rem;">${text}</p>
          <p style="font-size: 0.85rem; color: #64748B;">
            💡 Trik Cepat Kali Silang: (${this.scaleLeft.num} × ${this.scaleRight.den} = <strong>${this.scaleLeft.num * this.scaleRight.den}</strong>) bandingkan dengan (${this.scaleRight.num} × ${this.scaleLeft.den} = <strong>${this.scaleRight.num * this.scaleLeft.den}</strong>).
          </p>
        </div>
      `;
    }
  }

  /* -------------------------------------------------------------
     5. ADDITION & SUBTRACTION LAB (Penyebut Sama)
     ------------------------------------------------------------- */
  initOperationLab() {
    this.renderOperation();
  }

  setOperationType(type) {
    this.opType = type;
    if (window.soundEngine) window.soundEngine.playPop();

    const addBtn = document.getElementById('opBtnAdd');
    const subBtn = document.getElementById('opBtnSub');

    if (type === 'add') {
      addBtn?.classList.add('active');
      subBtn?.classList.remove('active');
    } else {
      subBtn?.classList.add('active');
      addBtn?.classList.remove('active');
    }

    this.renderOperation();
  }

  changeOpValue(field, delta) {
    if (window.soundEngine) window.soundEngine.playPop();

    if (field === 'den') {
      this.opDen = Math.max(3, Math.min(10, this.opDen + delta));
      if (this.opNum1 >= this.opDen) this.opNum1 = this.opDen - 1;
      if (this.opNum2 >= this.opDen) this.opNum2 = 1;
    } else if (field === 'num1') {
      this.opNum1 = Math.max(1, Math.min(this.opDen - 1, this.opNum1 + delta));
    } else if (field === 'num2') {
      this.opNum2 = Math.max(1, Math.min(this.opDen - 1, this.opNum2 + delta));
    }

    if (this.opType === 'sub' && this.opNum1 < this.opNum2) {
      this.opNum1 = this.opNum2;
    }

    this.renderOperation();
  }

  renderOperation() {
    const isAdd = this.opType === 'add';
    const resultNum = isAdd ? (this.opNum1 + this.opNum2) : (this.opNum1 - this.opNum2);

    const f1Num = document.getElementById('opF1Num');
    const f1Den = document.getElementById('opF1Den');
    const f2Num = document.getElementById('opF2Num');
    const f2Den = document.getElementById('opF2Den');
    const symbolEl = document.getElementById('opSymbol');
    const rNum = document.getElementById('opResultNum');
    const rDen = document.getElementById('opResultDen');
    const visualBox = document.getElementById('opVisualBox');

    if (f1Num) f1Num.textContent = this.opNum1;
    if (f1Den) f1Den.textContent = this.opDen;
    if (f2Num) f2Num.textContent = this.opNum2;
    if (f2Den) f2Den.textContent = this.opDen;
    if (symbolEl) symbolEl.textContent = isAdd ? '+' : '−';
    if (rNum) rNum.textContent = resultNum;
    if (rDen) rDen.textContent = this.opDen;

    if (visualBox) {
      // Build dynamic visual strip
      let strip1 = '';
      for (let i = 0; i < this.opDen; i++) {
        strip1 += `<div style="flex:1; height:32px; background:${i < this.opNum1 ? '#3B82F6' : '#E2E8F0'}; border:1px solid #fff; border-radius:4px;"></div>`;
      }

      let strip2 = '';
      for (let i = 0; i < this.opDen; i++) {
        strip2 += `<div style="flex:1; height:32px; background:${i < this.opNum2 ? '#10B981' : '#E2E8F0'}; border:1px solid #fff; border-radius:4px;"></div>`;
      }

      let stripRes = '';
      for (let i = 0; i < this.opDen; i++) {
        let col = '#E2E8F0';
        if (isAdd) {
          if (i < this.opNum1) col = '#3B82F6';
          else if (i < this.opNum1 + this.opNum2) col = '#10B981';
        } else {
          if (i < resultNum) col = '#F59E0B';
        }
        stripRes += `<div style="flex:1; height:36px; background:${col}; border:1px solid #fff; border-radius:4px;"></div>`;
      }

      visualBox.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:480px; margin:0 auto;">
          <div>
            <span style="font-size:0.85rem; font-weight:700; color:#3B82F6;">Bagian Pertama (${this.opNum1}/${this.opDen}):</span>
            <div style="display:flex; width:100%; border-radius:6px; overflow:hidden; border:2px solid #94A3B8; margin-top:3px;">${strip1}</div>
          </div>
          <div>
            <span style="font-size:0.85rem; font-weight:700; color:#10B981;">Bagian Kedua (${this.opNum2}/${this.opDen}):</span>
            <div style="display:flex; width:100%; border-radius:6px; overflow:hidden; border:2px solid #94A3B8; margin-top:3px;">${strip2}</div>
          </div>
          <div style="margin-top:8px;">
            <span style="font-size:0.95rem; font-weight:700; color:#1E293B;">
              ${isAdd ? 'Gabungan Total (+):' : 'Sisa Setelah Dikurangi (−):'}
              <strong style="color:#4F46E5;">${resultNum}/${this.opDen}</strong>
            </span>
            <div style="display:flex; width:100%; border-radius:6px; overflow:hidden; border:3px solid #4F46E5; margin-top:4px;">${stripRes}</div>
          </div>
        </div>
      `;
    }
  }
}

// Global instance
window.materiManager = new MateriManager();
