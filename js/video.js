/**
 * Pecahan Ceria - Video Pembelajaran & Interactive Checkpoints
 * Curated playlist for 4th Grade Math Fractions, study notes, and comprehension mini-quizzes.
 */

class VideoManager {
  constructor() {
    this.videos = [
      {
        id: 'vid-1',
        title: '1. Petualangan Mengenal Konsep Pecahan',
        duration: '6:15 Menit',
        tpTag: 'TP 1 - Konsep Dasar',
        embedUrl: 'https://www.youtube-nocookie.com/embed/6iQe2W_9Wk4', // Edukasi Pecahan Dasar SD
        summary: 'Pecahan adalah bagian dari satu benda utuh yang dibagi menjadi bagian-bagian yang sama besar. Angka di atas disebut PEMBILANG (berapa potong yang diambil) dan angka di bawah disebut PENYEBUT (total seluruh potongan).',
        checkpoint: {
          q: 'Ibu memotong 1 buah semangka menjadi 8 bagian sama rata. Budi memakan 3 bagian. Berapakah pecahan semangka yang dimakan Budi?',
          options: ['3/8', '8/3', '5/8', '1/8'],
          correct: 0,
          explanation: 'Benar! Budi memakan 3 potong (pembilang) dari total 8 potong semangka (penyebut), sehingga bernilai 3/8.'
        }
      },
      {
        id: 'vid-2',
        title: '2. Rahasia Ajaib Pecahan Senilai',
        duration: '7:40 Menit',
        tpTag: 'TP 2 - Pecahan Senilai',
        embedUrl: 'https://www.youtube-nocookie.com/embed/n0Fvhq_1joo', // Edukasi Pecahan Senilai
        summary: 'Pecahan senilai adalah pecahan yang memiliki nilai atau luas bagian yang sama meski lambang bilangannya berbeda. Trik cepatnya: kalikan atau bagilah pembilang dan penyebut dengan angka yang sama!',
        checkpoint: {
          q: 'Manakah di bawah ini pecahan yang senilai dengan 1/3?',
          options: ['2/6', '2/5', '3/6', '1/6'],
          correct: 0,
          explanation: 'Tepat sekali! 1/3 × 2/2 = 2/6. Keduanya adalah pecahan senilai.'
        }
      },
      {
        id: 'vid-3',
        title: '3. Trik Mudah Membandingkan Pecahan',
        duration: '5:50 Menit',
        tpTag: 'TP 3 - Membandingkan',
        embedUrl: 'https://www.youtube-nocookie.com/embed/d3W47z9_k_s', // Membandingkan Pecahan
        summary: 'Jika penyebutnya sama, cukup bandingkan pembilangnya: pembilang lebih besar bernilai lebih besar. Jika penyebutnya berbeda, gunakan trik perkalian silang (kupu-kupu)!',
        checkpoint: {
          q: 'Tanda perbandingan yang tepat untuk 3/7 ... 5/7 adalah?',
          options: ['< (Lebih Kecil)', '> (Lebih Besar)', '= (Sama Dengan)', '≠ (Tidak Sama)'],
          correct: 0,
          explanation: 'Hebat! Karena penyebutnya sudah sama (7), kita lihat pembilangnya: 3 lebih kecil dari 5, jadi 3/7 < 5/7.'
        }
      },
      {
        id: 'vid-4',
        title: '4. Penjumlahan & Pengurangan Berpenyebut Sama',
        duration: '6:30 Menit',
        tpTag: 'TP 4 - Operasi Hitung',
        embedUrl: 'https://www.youtube-nocookie.com/embed/3yE2uE15L_Q', // Penjumlahan Pecahan
        summary: 'Pada pecahan berpenyebut sama, kita HANYA menjumlahkan atau mengurangkan angka pembilangnya saja. Angka penyebut TIDAK BOLEH dijumlahkan atau dikurangkan!',
        checkpoint: {
          q: 'Berapakah hasil dari 2/9 + 4/9?',
          options: ['6/9', '6/18', '2/9', '8/9'],
          correct: 0,
          explanation: 'Luar biasa! Pembilangnya dijumlahkan: 2 + 4 = 6. Penyebutnya tetap 9. Hasilnya 6/9!'
        }
      }
    ];

    this.currentIndex = 0;
    this.completedCheckpoints = new Set(JSON.parse(localStorage.getItem('pecahan_completed_vids') || '[]'));
  }

  init() {
    this.renderPlaylist();
    this.loadVideo(0);
    this.initNotes();
  }

  renderPlaylist() {
    const container = document.getElementById('videoPlaylistItems');
    if (!container) return;
    container.innerHTML = '';

    this.videos.forEach((vid, idx) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${idx === this.currentIndex ? 'active' : ''}`;
      item.innerHTML = `
        <div class="playlist-thumb-icon">▶</div>
        <div class="playlist-info">
          <h5>${vid.title}</h5>
          <span>⏱ ${vid.duration} • ${vid.tpTag}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playPop();
        this.loadVideo(idx);
      });

      container.appendChild(item);
    });
  }

  loadVideo(index) {
    this.currentIndex = index;
    const vid = this.videos[index];

    // Update active playlist UI
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((it, i) => {
      if (i === index) it.classList.add('active');
      else it.classList.remove('active');
    });

    // Update iframe and details
    const iframe = document.getElementById('mainVideoIframe');
    const titleEl = document.getElementById('activeVideoTitle');
    const badgeEl = document.getElementById('activeVideoBadge');
    const summaryEl = document.getElementById('activeVideoSummary');

    if (iframe) iframe.src = vid.embedUrl;
    if (titleEl) titleEl.textContent = vid.title;
    if (badgeEl) badgeEl.textContent = vid.tpTag;
    if (summaryEl) summaryEl.textContent = vid.summary;

    this.renderCheckpoint(vid);

    // Track state
    if (window.gameManager) {
      window.gameManager.completeQuest('watch_video', 30, 'Menonton Video');
      window.gameManager.unlockBadge('video_watcher');
      window.gameManager.state.stats.videosWatched = Math.max(window.gameManager.state.stats.videosWatched, index + 1);
      window.gameManager.saveState();
    }
  }

  renderCheckpoint(vid) {
    const box = document.getElementById('videoCheckpointBox');
    if (!box) return;

    const isAlreadyClaimed = this.completedCheckpoints.has(vid.id);

    box.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
        <h4 style="font-family:var(--font-display); font-size:1.15rem; color:#065F46; display:flex; align-items:center; gap:0.4rem;">
          🎯 Kuis Kilat Pemahaman Video
        </h4>
        <span class="xp-tag">+40 XP</span>
      </div>
      <p style="font-size:1.05rem; font-weight:600; color:#1E293B; margin-bottom:1rem;">${vid.checkpoint.q}</p>
      <div class="options-grid" id="checkpointOptionsGrid">
        ${vid.checkpoint.options.map((opt, i) => `
          <button class="option-btn" onclick="window.videoManager.answerCheckpoint(${i})">
            <span style="background:#E0E7FF; color:#4338CA; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.9rem;">
              ${String.fromCharCode(65 + i)}
            </span>
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="checkpointFeedback" style="display:none; margin-top:1rem; padding:0.85rem 1rem; border-radius:10px; font-weight:600;"></div>
    `;

    if (isAlreadyClaimed) {
      const fb = document.getElementById('checkpointFeedback');
      if (fb) {
        fb.style.display = 'block';
        fb.style.background = '#D1FAE5';
        fb.style.color = '#065F46';
        fb.innerHTML = '✅ Kamu sudah menyelesaikan kuis kilat video ini dan mengklaim bonus XP!';
      }
    }
  }

  answerCheckpoint(selectedIdx) {
    const vid = this.videos[this.currentIndex];
    const fb = document.getElementById('checkpointFeedback');
    const btns = document.querySelectorAll('#checkpointOptionsGrid .option-btn');

    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === vid.checkpoint.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    if (selectedIdx === vid.checkpoint.correct) {
      if (window.soundEngine) window.soundEngine.playCorrect();
      if (fb) {
        fb.style.display = 'block';
        fb.style.background = '#D1FAE5';
        fb.style.color = '#065F46';
        fb.innerHTML = `🎉 ${vid.checkpoint.explanation}`;
      }

      if (!this.completedCheckpoints.has(vid.id)) {
        this.completedCheckpoints.add(vid.id);
        localStorage.setItem('pecahan_completed_vids', JSON.stringify(Array.from(this.completedCheckpoints)));
        if (window.gameManager) {
          window.gameManager.addXP(40, `Kuis Kilat Video ${vid.title}`);
          window.gameManager.triggerConfetti();
        }
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      if (fb) {
        fb.style.display = 'block';
        fb.style.background = '#FEE2E2';
        fb.style.color = '#991B1B';
        fb.innerHTML = `❌ Jawaban kurang tepat. ${vid.checkpoint.explanation}`;
      }
    }
  }

  initNotes() {
    const notesInput = document.getElementById('studentNotesArea');
    if (!notesInput) return;

    const savedNotes = localStorage.getItem('pecahan_student_notes') || '';
    notesInput.value = savedNotes;

    notesInput.addEventListener('input', (e) => {
      localStorage.setItem('pecahan_student_notes', e.target.value);
    });
  }
}

// Global instance
window.videoManager = new VideoManager();
