/**
 * Pecahan Ceria - Gamified Quiz & Certificate Engine
 * 10 questions covering all 4 TP standards, immediate educational feedback,
 * 3-heart system, and official digital printable certificate generator!
 */

class QuizEngine {
  constructor() {
    this.questions = [
      {
        id: 1,
        tp: 'TP 1',
        prompt: 'Perhatikan gambar pizza di bawah ini. Jika sebuah pizza dipotong menjadi 6 potong sama besar dan sudah dimakan 2 potong, berapakah bagian pizza yang tersisa?',
        visual: `
          <div style="display:flex; align-items:center; gap:1.5rem; justify-content:center;">
            <div style="font-size:3.5rem;">🍕</div>
            <div style="font-size:1.1rem; color:#475569;">
              Total potongan = <strong>6</strong><br>
              Dimakan = <strong>2</strong><br>
              Sisa = <strong>4 potong</strong>
            </div>
          </div>
        `,
        options: ['4/6 bagian', '2/6 bagian', '6/4 bagian', '2/4 bagian'],
        correct: 0,
        explanation: 'Benar! Total potongan adalah penyebut (6). Karena sudah dimakan 2, maka sisa pizza adalah 6 - 2 = 4 potong (pembilang). Jadi sisa pizza adalah 4/6 bagian.'
      },
      {
        id: 2,
        tp: 'TP 1',
        prompt: 'Pada pecahan 5/8, angka 5 disebut sebagai ... dan angka 8 disebut sebagai ...',
        visual: `
          <div class="fraction-big-display">
            <span class="fraction-num">5 (Atas)</span>
            <span class="fraction-den">8 (Bawah)</span>
          </div>
        `,
        options: [
          'Pembilang dan Penyebut',
          'Penyebut dan Pembilang',
          'Pengurang dan Penjumlah',
          'Pecahan dan Bilangan'
        ],
        correct: 0,
        explanation: 'Tepat sekali! Angka di atas garis adalah Pembilang (bagian yang diambil), sedangkan angka di bawah garis adalah Penyebut (total seluruh bagian).'
      },
      {
        id: 3,
        tp: 'TP 2',
        prompt: 'Pecahan berikut ini yang SENILAI dengan 2/3 adalah ...',
        visual: `
          <div style="text-align:center; font-size:1.1rem; color:#4338CA;">
            💡 Kalikan pembilang dan penyebut dengan angka yang sama (misal × 2):<br>
            <strong>2/3 × 2/2 = ... ?</strong>
          </div>
        `,
        options: ['4/6', '3/4', '4/9', '2/6'],
        correct: 0,
        explanation: 'Hebat! Jika pembilang dan penyebut 2/3 sama-sama dikali 2, hasilnya adalah (2 × 2) / (3 × 2) = 4/6. Jadi 2/3 senilai dengan 4/6.'
      },
      {
        id: 4,
        tp: 'TP 2',
        prompt: 'Manakah pasangan pecahan di bawah ini yang TIDAK senilai?',
        visual: `
          <div style="font-size:1.05rem; color:#64748B; text-align:center;">
            Cari pecahan yang jika disederhanakan nilainya berbeda.
          </div>
        `,
        options: ['1/3 dan 2/5', '1/2 dan 4/8', '2/4 dan 3/6', '3/5 dan 6/10'],
        correct: 0,
        explanation: 'Benar! 1/3 tidak sama dengan 2/5 (1 × 5 = 5, sedangkan 2 × 3 = 6). Pasangan lainnya senilai.'
      },
      {
        id: 5,
        tp: 'TP 3',
        prompt: 'Tanda perbandingan yang tepat untuk mengisi titik-titik pada: 4/9 ... 7/9 adalah ...',
        visual: `
          <div style="display:flex; align-items:center; justify-content:center; gap:1.5rem; font-size:1.5rem; font-weight:700;">
            <span style="color:#3B82F6;">4/9</span>
            <span style="color:#F59E0B; background:#FEF3C7; padding:4px 14px; border-radius:8px;">?</span>
            <span style="color:#10B981;">7/9</span>
          </div>
        `,
        options: [
          '< (Lebih kecil dari)',
          '> (Lebih besar dari)',
          '= (Sama dengan)',
          '≥ (Lebih besar sama dengan)'
        ],
        correct: 0,
        explanation: 'Tepat! Karena penyebutnya sudah sama (9), kita tinggal melihat pembilangnya. 4 lebih kecil dari 7, sehingga 4/9 < 7/9.'
      },
      {
        id: 6,
        tp: 'TP 3',
        prompt: 'Urutan pecahan berikut dari yang TERKECIL ke TERBESAR adalah ...',
        visual: `
          <div style="font-size:1.2rem; font-weight:700; color:#4F46E5; text-align:center;">
            5/8 , 1/8 , 7/8 , 3/8
          </div>
        `,
        options: [
          '1/8, 3/8, 5/8, 7/8',
          '7/8, 5/8, 3/8, 1/8',
          '1/8, 5/8, 3/8, 7/8',
          '3/8, 1/8, 5/8, 7/8'
        ],
        correct: 0,
        explanation: 'Luar biasa! Karena semua penyebutnya 8, urutkan saja pembilangnya dari yang paling kecil: 1, 3, 5, lalu 7.'
      },
      {
        id: 7,
        tp: 'TP 3',
        prompt: 'Manakah pernyataan yang BENAR mengenai perbandingan 1/2 dan 1/4?',
        visual: `
          <div style="display:flex; justify-content:center; gap:2rem; font-size:1.1rem; align-items:center;">
            <div>🍰 1/2 Kue (Dibagi 2)</div>
            <span style="font-weight:700;">VS</span>
            <div>🧁 1/4 Kue (Dibagi 4)</div>
          </div>
        `,
        options: [
          '1/2 lebih besar daripada 1/4',
          '1/4 lebih besar daripada 1/2',
          '1/2 sama besar dengan 1/4',
          '1/4 dua kali lebih besar dari 1/2'
        ],
        correct: 0,
        explanation: 'Benar sekali! Benda yang dibagi 2 bagian menghasilkan potongan yang jauh lebih besar daripada benda yang dibagi 4 bagian. Jadi 1/2 > 1/4.'
      },
      {
        id: 8,
        tp: 'TP 4',
        prompt: 'Berapakah hasil dari 3/10 + 4/10?',
        visual: `
          <div style="font-size:1.8rem; font-family:var(--font-display); font-weight:700; color:#059669; text-align:center;">
            3/10 + 4/10 = ... ?
          </div>
        `,
        options: ['7/10', '7/20', '1/10', '12/10'],
        correct: 0,
        explanation: 'Hebat! Karena penyebutnya sama (10), jumlahkan pembilangnya: 3 + 4 = 7. Penyebutnya tetap 10. Hasilnya 7/10.'
      },
      {
        id: 9,
        tp: 'TP 4',
        prompt: 'Berapakah hasil dari 7/12 − 3/12?',
        visual: `
          <div style="font-size:1.8rem; font-family:var(--font-display); font-weight:700; color:#D97706; text-align:center;">
            7/12 − 3/12 = ... ?
          </div>
        `,
        options: ['4/12', '4/0', '10/12', '4/24'],
        correct: 0,
        explanation: 'Tepat sekali! Kurangkan pembilangnya: 7 - 3 = 4. Penyebutnya tetap 12. Jadi hasilnya 4/12 (yang juga senilai dengan 1/3).'
      },
      {
        id: 10,
        tp: 'TP 4',
        prompt: 'Siti memiliki sebatang cokelat yang terbagi menjadi 8 bagian sama besar. Siti memberikan 2/8 bagian kepada Dayu dan 3/8 bagian kepada Edo. Berapa total bagian cokelat yang telah Siti berikan?',
        visual: `
          <div style="font-size:1.1rem; color:#475569; text-align:center;">
            🍫 Diberikan ke Dayu: 2/8<br>
            🍫 Diberikan ke Edo: 3/8
          </div>
        `,
        options: ['5/8 bagian', '6/8 bagian', '1/8 bagian', '5/16 bagian'],
        correct: 0,
        explanation: 'Sempurna! Jumlahkan bagian cokelat: 2/8 + 3/8 = 5/8 bagian.'
      }
    ];

    this.currentIndex = 0;
    this.score = 0;
    this.hearts = 3;
    this.selectedOption = null;
    this.hasAnswered = false;
    this.tpResults = {
      'TP 1': { correct: 0, total: 2 },
      'TP 2': { correct: 0, total: 2 },
      'TP 3': { correct: 0, total: 3 },
      'TP 4': { correct: 0, total: 3 }
    };
  }

  init() {
    this.startQuiz();
  }

  startQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.hearts = 3;
    this.hasAnswered = false;
    this.selectedOption = null;

    this.tpResults = {
      'TP 1': { correct: 0, total: 2 },
      'TP 2': { correct: 0, total: 2 },
      'TP 3': { correct: 0, total: 3 },
      'TP 4': { correct: 0, total: 3 }
    };

    const qCard = document.getElementById('quizActiveCard');
    const rCard = document.getElementById('quizResultCard');

    if (qCard) qCard.style.display = 'block';
    if (rCard) rCard.classList.remove('active');

    this.renderQuestion();
  }

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    this.hasAnswered = false;
    this.selectedOption = null;

    const stepLabel = document.getElementById('quizStepLabel');
    const progressFill = document.getElementById('quizProgressFill');
    const heartsContainer = document.getElementById('quizHeartsContainer');
    const promptEl = document.getElementById('quizQuestionPrompt');
    const visualEl = document.getElementById('quizVisualBox');
    const optionsGrid = document.getElementById('quizOptionsGrid');
    const explBox = document.getElementById('quizExplanationBox');
    const nextBtn = document.getElementById('quizBtnNext');

    if (stepLabel) stepLabel.textContent = `Soal ${this.currentIndex + 1} dari ${this.questions.length}`;
    if (progressFill) progressFill.style.width = `${((this.currentIndex + 1) / this.questions.length) * 100}%`;

    // Hearts UI
    if (heartsContainer) {
      let hHtml = '';
      for (let h = 0; h < 3; h++) {
        hHtml += h < this.hearts ? '❤️ ' : '🤍 ';
      }
      heartsContainer.innerHTML = hHtml;
    }

    if (promptEl) promptEl.textContent = q.prompt;
    if (visualEl) visualEl.innerHTML = q.visual;
    if (explBox) explBox.classList.remove('show');
    if (nextBtn) nextBtn.style.display = 'none';

    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
          <span style="background:#EEF2FF; color:#4338CA; width:32px; height:32px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:1rem;">
            ${String.fromCharCode(65 + idx)}
          </span>
          <span>${opt}</span>
        `;

        btn.addEventListener('click', () => {
          if (!this.hasAnswered) {
            this.handleAnswer(idx);
          }
        });

        optionsGrid.appendChild(btn);
      });
    }
  }

  handleAnswer(selectedIdx) {
    this.hasAnswered = true;
    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIdx === q.correct;

    const btns = document.querySelectorAll('#quizOptionsGrid .option-btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    const explBox = document.getElementById('quizExplanationBox');
    const nextBtn = document.getElementById('quizBtnNext');

    if (isCorrect) {
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.score += 10;
      this.tpResults[q.tp].correct++;

      if (explBox) {
        explBox.classList.add('show');
        explBox.style.background = '#ECFDF5';
        explBox.style.borderColor = '#10B981';
        explBox.innerHTML = `
          <h5 style="color:#065F46;">🎉 JAWABAN BENAR! (+10 XP)</h5>
          <p style="color:#064E3B;">${q.explanation}</p>
        `;
      }

      if (window.gameManager) {
        window.gameManager.addXP(10, 'Jawaban Kuis Benar');
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      this.hearts--;

      // Update hearts display
      const heartsContainer = document.getElementById('quizHeartsContainer');
      if (heartsContainer) {
        let hHtml = '';
        for (let h = 0; h < 3; h++) {
          hHtml += h < this.hearts ? '❤️ ' : '🤍 ';
        }
        heartsContainer.innerHTML = hHtml;
      }

      if (explBox) {
        explBox.classList.add('show');
        explBox.style.background = '#FEF2F2';
        explBox.style.borderColor = '#EF4444';
        explBox.innerHTML = `
          <h5 style="color:#991B1B;">❌ BELUM TEPAT</h5>
          <p style="color:#7F1D1D;">${q.explanation}</p>
        `;
      }
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = this.currentIndex < this.questions.length - 1 ? 'Soal Selanjutnya ➡️' : 'Lihat Hasil Akhir 🏆';
    }
  }

  nextQuestion() {
    if (window.soundEngine) window.soundEngine.playPop();

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    const qCard = document.getElementById('quizActiveCard');
    const rCard = document.getElementById('quizResultCard');

    if (qCard) qCard.style.display = 'none';
    if (rCard) rCard.classList.add('active');

    const scoreNumber = document.getElementById('resultScoreNumber');
    const titleEl = document.getElementById('resultTitle');
    const feedbackEl = document.getElementById('resultFeedbackMsg');
    const medalImg = document.getElementById('resultMedalImg');
    const tpBreakdown = document.getElementById('tpBreakdownContainer');

    if (scoreNumber) scoreNumber.textContent = `${this.score}`;

    let title = 'Luar Biasa!';
    let msg = 'Kamu telah menyelesaikan Petualangan Kuis Pecahan!';
    if (this.score >= 80) {
      title = '🏆 Bintang Matematika Pecahan!';
      msg = 'Hebat luar biasa! Pemahamanmu tentang materi pecahan kelas 4 sangat sempurna!';
      if (window.gameManager) {
        window.gameManager.unlockBadge('quiz_master');
      }
    } else if (this.score >= 60) {
      title = '⭐ Petualang Hebat!';
      msg = 'Bagus sekali! Kamu sudah memahami sebagian besar konsep pecahan dengan baik.';
    } else {
      title = '💪 Semangat Belajar!';
      msg = 'Jangan patah semangat! Pelajari kembali materi interaktif dan coba lagi untuk hasil maksimal.';
    }

    if (titleEl) titleEl.textContent = title;
    if (feedbackEl) feedbackEl.textContent = msg;

    // Render TP breakdown
    if (tpBreakdown) {
      let tpSummary = '';
      for (const [tp, data] of Object.entries(this.tpResults)) {
        const pct = Math.round((data.correct / data.total) * 100);
        tpSummary += `
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:0.85rem 1rem; text-align:left;">
            <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.25rem;">
              <span>${tp}</span>
              <span style="color:${pct >= 70 ? '#10B981' : '#F59E0B'};">${pct}%</span>
            </div>
            <div style="font-size:0.82rem; color:#64748B;">(${data.correct} dari ${data.total} soal benar)</div>
          </div>
        `;
      }
      tpBreakdown.innerHTML = tpSummary;
    }

    if (window.soundEngine) window.soundEngine.playLevelUp();
    if (window.gameManager) {
      window.gameManager.triggerConfetti();
      window.gameManager.addXP(50, 'Menyelesaikan Kuis Pecahan');
      window.gameManager.completeQuest('finish_quiz', 50, 'Selesaikan Kuis');
      window.gameManager.state.stats.quizScores.push(this.score);
      window.gameManager.saveState();
    }
  }

  showCertificate() {
    if (window.soundEngine) window.soundEngine.playPop();

    const modal = document.getElementById('certificateModal');
    const nameEl = document.getElementById('certStudentName');
    const dateEl = document.getElementById('certDate');
    const descEl = document.getElementById('certScoreDesc');

    const playerName = window.gameManager ? window.gameManager.state.playerName : 'Bintang Juara';
    const avatar = window.gameManager ? window.gameManager.state.playerAvatar : '🐰';

    if (nameEl) nameEl.textContent = `${playerName} ${avatar}`;

    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('id-ID', options);
    if (dateEl) dateEl.textContent = dateStr;

    if (descEl) {
      descEl.innerHTML = `Atas keberhasilan menyelesaikan seluruh rangkaian pembelajaran dan meraih nilai <strong>${this.score}/100</strong> pada Ujian Petualangan Matematika Materi Pecahan Kurikulum Merdeka Kelas 4 Sekolah Dasar.`;
    }

    if (modal) modal.classList.add('show');
  }

  closeCertificate() {
    const modal = document.getElementById('certificateModal');
    if (modal) modal.classList.remove('show');
  }

  printCertificate() {
    window.print();
  }
}

// Global instance
window.quizEngine = new QuizEngine();
