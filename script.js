const leagueData = {
    bronze_3:   { name: "ทองแดง 3",   base: 35,  guaranteed: 1 },
    bronze_2:   { name: "ทองแดง 2",   base: 35,  guaranteed: 1 },
    bronze_1:   { name: "ทองแดง 1",   base: 35,  guaranteed: 1 },
    silver_3:   { name: "เงิน 3",     base: 35,  guaranteed: 1 },
    silver_2:   { name: "เงิน 2",     base: 40,  guaranteed: 1 },
    silver_1:   { name: "เงิน 1",     base: 45,  guaranteed: 1 },
    gold_3:     { name: "ทอง 3",     base: 50,  guaranteed: 2 },
    gold_2:     { name: "ทอง 2",     base: 55,  guaranteed: 2 },
    gold_1:     { name: "ทอง 1",     base: 60,  guaranteed: 2 },
    crystal_3:  { name: "คริสตัล 3",  base: 65,  guaranteed: 2 },
    crystal_2:  { name: "คริสตัล 2",  base: 70,  guaranteed: 2 },
    crystal_1:  { name: "คริสตัล 1",  base: 75,  guaranteed: 2 },
    master_3:   { name: "ยอดฝีมือ 3", base: 80,  guaranteed: 3 },
    master_2:   { name: "ยอดฝีมือ 2", base: 85,  guaranteed: 3 },
    master_1:   { name: "ยอดฝีมือ 1", base: 90,  guaranteed: 3 },
    champion_3: { name: "แชมเปียน 3", base: 95,  guaranteed: 4 },
    champion_2: { name: "แชมเปียน 2", base: 100, guaranteed: 4 },
    champion_1: { name: "แชมเปียน 1", base: 105, guaranteed: 4 }
  };
  
  const leagueSelect  = document.getElementById('league');
  const chipsWrap     = document.getElementById('winDays');
  const btnCalc       = document.getElementById('calculateButton');
  const btnReset      = document.getElementById('resetButton');
  
  const resultsWrap   = document.getElementById('results');
  const emptyState    = document.getElementById('emptyState');
  const guaranteedEl  = document.getElementById('guaranteedValue');
  const winEl         = document.getElementById('winValue');
  const totalEl       = document.getElementById('totalValue');
  const perPersonEl   = document.getElementById('perPerson');
  const totalMedalsEl = document.getElementById('totalMedals');
  
  const lsKey = 'coc-medal-tool-v1';
  
  function saveState(obj) {
    localStorage.setItem(lsKey, JSON.stringify(obj));
  }
  function loadState() {
    try { return JSON.parse(localStorage.getItem(lsKey) || '{}'); }
    catch(e) { return {}; }
  }
  
  function countUp(el, to) {
    const from = Number(el.textContent) || 0;
    const diff = to - from;
    if (diff === 0) return;
    const dur = 500;
    const start = performance.now();
    function step(t) {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(from + diff * (0.5 - Math.cos(p * Math.PI) / 2));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  
  function renderLeagueOptions() {
    leagueSelect.innerHTML = '';
    Object.entries(leagueData).forEach(([key, v]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = `${v.name} — เหรียญ/คน ${v.base}`;
      leagueSelect.appendChild(opt);
    });
  }
  
  function renderWinChips() {
    chipsWrap.innerHTML = '';
    for (let i = 0; i <= 7; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('data-value', i);
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<div>${i}</div><small>วัน</small>`;
      b.addEventListener('click', () => {
        chipsWrap.querySelectorAll('.chip').forEach(x => {
          x.classList.remove('active');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      });
      chipsWrap.appendChild(b);
    }
  }
  
  function getSelectedWinDays() {
    return Number(chipsWrap.querySelector('.chip.active')?.dataset.value || 0);
  }
  
  function calculate() {
    const leagueKey = leagueSelect.value || Object.keys(leagueData)[0];
    const L = leagueData[leagueKey];
    const winDays = getSelectedWinDays();
  
    const guaranteed = L.guaranteed;
    const winBonus = winDays;
    const total = guaranteed + winBonus;
  
    resultsWrap.classList.remove('hidden');
    emptyState.classList.add('hidden');
  
    countUp(guaranteedEl, guaranteed);
    countUp(winEl, winBonus);
    countUp(totalEl, total);
  
    perPersonEl.textContent = `ได้คนละ ${L.base} เหรียญ`;
    // totalMedalsEl.textContent = `รวมทั้งหมด ${L.base * total} เหรียญ (ถ้าแจกครบ)`; // This line was commented out in your previous reference
  
    saveState({ leagueKey, winDays });
  }
  
  function resetAll() {
    chipsWrap.querySelectorAll('.chip').forEach(x => {
      x.classList.remove('active');
      x.setAttribute('aria-pressed', 'false');
    });
    leagueSelect.selectedIndex = 0;
    resultsWrap.classList.add('hidden');
    emptyState.classList.remove('hidden');
    localStorage.removeItem(lsKey);
  }
  
  renderLeagueOptions();
  renderWinChips();
  
  const s = loadState();
  if (s.leagueKey && leagueData[s.leagueKey]) leagueSelect.value = s.leagueKey;
  if (Number.isInteger(s.winDays)) {
    const target = chipsWrap.querySelector(`[data-value="${s.winDays}"]`);
    if (target) target.click();
  }
  
  btnCalc.addEventListener('click', calculate);
  btnReset.addEventListener('click', resetAll);