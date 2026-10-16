/**
 * Pecahan Ceria - Main Application Controller
 * Handles SPA navigation, modal triggers, event bindings, and life-cycle initialization.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Managers
  if (window.soundEngine) window.soundEngine.init();
  if (window.gameManager) window.gameManager.updateHUD();
  if (window.materiManager) window.materiManager.init();
  if (window.pizzaGame) window.pizzaGame.init();
  if (window.catcherGame) window.catcherGame.init();
  if (window.videoManager) window.videoManager.init();
  if (window.quizEngine) window.quizEngine.init();

  // Navigation Logic
  initNavigation();

  // Modal Handlers
  initModals();

  // Sound Toggle Button
  initSoundButton();

  // Game Selector Tabs (Chef Pizza vs Star Catcher)
  initGameTabs();
});

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');

  const navigateTo = (targetId) => {
    if (window.soundEngine) window.soundEngine.playPop();

    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-pause or trigger game/video resizes
    if (targetId === 'game' && window.catcherGame) {
      window.catcherGame.resizeCanvas();
    }
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      navigateTo(targetId);
      window.location.hash = targetId;
    });
  });

  // Handle URL hash on load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash)) {
    navigateTo(currentHash);
  }

  // Global helper for CTA buttons (e.g. from Home hero to Materi)
  window.navigateToSection = (targetId) => {
    navigateTo(targetId);
    window.location.hash = targetId;
  };
}

function initModals() {
  // 1. PROFILE MODAL
  const profileChip = document.getElementById('btnOpenProfile');
  const profileModal = document.getElementById('profileModal');
  const closeProfileBtn = document.getElementById('btnCloseProfile');
  const saveProfileBtn = document.getElementById('btnSaveProfile');
  const nameInput = document.getElementById('profileNameInput');
  const avatarChoices = document.querySelectorAll('.avatar-choice');

  let selectedAvatar = window.gameManager.state.playerAvatar || '🐰';
  let selectedAvatarName = window.gameManager.state.avatarName || 'Roro si Kelinci';

  if (profileChip && profileModal) {
    profileChip.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playPop();
      if (nameInput) nameInput.value = window.gameManager.state.playerName;
      profileModal.classList.add('show');
    });

    closeProfileBtn?.addEventListener('click', () => {
      profileModal.classList.remove('show');
    });

    avatarChoices.forEach(choice => {
      choice.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playPop();
        avatarChoices.forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
        selectedAvatar = choice.getAttribute('data-emoji');
        selectedAvatarName = choice.getAttribute('data-name');
      });
    });

    saveProfileBtn?.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'Bintang Juara';
      window.gameManager.setProfile(name, selectedAvatar, selectedAvatarName);
      profileModal.classList.remove('show');
    });
  }

  // 2. BADGES MODAL
  const badgeBtn = document.getElementById('btnOpenBadges');
  const badgesModal = document.getElementById('badgesModal');
  const closeBadgesBtn = document.getElementById('btnCloseBadges');
  const badgesGrid = document.getElementById('badgesModalGrid');

  if (badgeBtn && badgesModal) {
    badgeBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playPop();
      renderBadgesModal(badgesGrid);
      badgesModal.classList.add('show');
    });

    closeBadgesBtn?.addEventListener('click', () => {
      badgesModal.classList.remove('show');
    });
  }

  // 3. QUESTS MODAL
  const questBtn = document.getElementById('btnOpenQuests');
  const questsModal = document.getElementById('questsModal');
  const closeQuestsBtn = document.getElementById('btnCloseQuests');
  const questList = document.getElementById('questsModalList');

  if (questBtn && questsModal) {
    questBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playPop();
      renderQuestsModal(questList);
      questsModal.classList.add('show');
    });

    closeQuestsBtn?.addEventListener('click', () => {
      questsModal.classList.remove('show');
    });
  }

  // Close modals on clicking overlay outside content
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('show');
    }
  });
}

function renderBadgesModal(container) {
  if (!container || !window.gameManager) return;
  container.innerHTML = '';

  const unlocked = window.gameManager.state.badges;
  window.gameManager.badgesList.forEach(b => {
    const isUnlocked = unlocked.includes(b.id);
    const card = document.createElement('div');
    card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <span class="badge-icon">${b.icon}</span>
      <div class="badge-title">${b.title}</div>
      <div class="badge-desc">${b.desc}</div>
      <div style="margin-top:0.35rem; font-size:0.7rem; font-weight:700; color:${isUnlocked ? '#059669' : '#94A3B8'};">
        ${isUnlocked ? '✅ Terbuka' : '🔒 Terkunci'}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderQuestsModal(container) {
  if (!container || !window.gameManager) return;
  container.innerHTML = '';

  const quests = [
    { key: 'explore_lab', name: 'Jelajahi Lab Pecahan Pizza & Cokelat', xp: 30 },
    { key: 'play_pizza', name: 'Layani Pelanggan di Dapur Pizza', xp: 40 },
    { key: 'watch_video', name: 'Tonton 1 Video & Jawab Kuis Kilat', xp: 40 },
    { key: 'finish_quiz', name: 'Selesaikan Kuis Petualang Pecahan', xp: 50 }
  ];

  const stateQuests = window.gameManager.state.quests || {};

  quests.forEach(q => {
    const isDone = !!stateQuests[q.key];
    const item = document.createElement('div');
    item.className = `quest-item ${isDone ? 'completed' : ''}`;
    item.innerHTML = `
      <div>
        <div class="quest-item-title">${isDone ? '✅ ' : '⏳ '}${q.name}</div>
        <span style="font-size:0.8rem; color:#64748B;">Hadiah: +${q.xp} XP</span>
      </div>
      <span class="xp-tag">${isDone ? 'Selesai' : 'Aktif'}</span>
    `;
    container.appendChild(item);
  });
}

function initSoundButton() {
  const btn = document.getElementById('btnSoundToggle');
  if (!btn) return;

  const updateSoundIcon = () => {
    const isMuted = window.soundEngine ? window.soundEngine.isMuted : false;
    btn.innerHTML = isMuted ? '🔇 <span style="font-size:0.75rem;">MUTE</span>' : '🔊 <span style="font-size:0.75rem;">SUARA</span>';
  };

  updateSoundIcon();

  btn.addEventListener('click', () => {
    if (window.soundEngine) {
      window.soundEngine.toggleMute();
      updateSoundIcon();
      if (!window.soundEngine.isMuted) {
        window.soundEngine.playPop();
      }
    }
  });
}

function initGameTabs() {
  const tabPizza = document.getElementById('tabGamePizza');
  const tabCatch = document.getElementById('tabGameCatch');
  const viewPizza = document.getElementById('gameViewPizza');
  const viewCatch = document.getElementById('gameViewCatch');

  if (tabPizza && tabCatch) {
    tabPizza.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playPop();
      tabPizza.classList.add('active');
      tabCatch.classList.remove('active');
      viewPizza?.classList.add('active');
      viewCatch?.classList.remove('active');
    });

    tabCatch.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playPop();
      tabCatch.classList.add('active');
      tabPizza.classList.remove('active');
      viewCatch?.classList.add('active');
      viewPizza?.classList.remove('active');
      if (window.catcherGame) window.catcherGame.resizeCanvas();
    });
  }
}
