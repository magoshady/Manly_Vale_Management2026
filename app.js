// =========================================================
// Manly Vale Match Day — application logic
// Single-file vanilla JS, no build step.
// =========================================================

const STORAGE_KEY = 'manly-vale-matchday-v1';

const DEFAULT_SHEET_ID = '1icq6EY1_dcMObs-bz_rLubiAKCLy9BWZugoushT-tns';

const DEFAULT_SQUAD = [
  ['Carlos Tanco', 'GK'],
  ['Johan Arrieta', 'DEF'],
  ['David Roberts', 'DEF'],
  ['Santi Paz', 'DEF'],
  ['Tom Smyth', 'DEF'],
  ['Benji Baxter', 'DEF'],
  ['Nico Grandi', 'DEF'],
  ['Pablo Pinero', 'DEF'],
  ['Javi Castillo', 'MID'],
  ['Christian Montivero', 'MID'],
  ['Mati Herrera', 'MID'],
  ['Michel Prezzi', 'MID'],
  ['Otto Thoresen', 'MID'],
  ['Abraham Barahona', 'MID'],
  ['Matt Wellstead', 'MID'],
  ['Alex Holder', 'MID'],
  ['Nicolas Matute', 'MID'],
  ['Manny Hastings', 'FWD'],
  ['Juan Pablo Munoz Valdez', 'FWD'],
  ['Miles Partridge', 'FWD'],
  ['Vincent Templon', 'FWD'],
];

const DEFAULT_FIXTURES = [
  ['2026-04-11', 'Round 1 — Manly Vale'],
  ['2026-04-25', 'Round 2 — Curl Curl'],
  ['2026-05-02', 'Round 3 — Pittwater'],
  ['2026-05-09', 'Round 4 — Harbord'],
  ['2026-05-16', 'Round 5 — Wakehurst'],
  ['2026-05-23', 'Round 6 — Seaforth'],
  ['2026-05-30', 'Round 7 — Mosman'],
  ['2026-06-06', 'Round 8 — Manly Vale'],
  ['2026-06-13', 'Round 9 — Curl Curl'],
  ['2026-06-20', 'Round 10 — Pittwater'],
  ['2026-06-27', 'Round 11 — Harbord'],
  ['2026-07-04', 'Round 12 — Wakehurst'],
  ['2026-07-11', 'Round 13 — Seaforth'],
  ['2026-07-18', 'Round 14 — Mosman'],
  ['2026-07-25', 'Round 15 — Manly Vale'],
  ['2026-08-01', 'Round 16 — Curl Curl'],
  ['2026-08-08', 'Round 17 — Pittwater'],
  ['2026-08-15', 'Round 18 — Harbord'],
  ['2026-08-22', 'Semi-final'],
  ['2026-08-29', 'Final'],
];

const ROLE_COLORS = {
  GK:   ['#01696f', '#0c4e54'],
  DEF:  ['#006494', '#0b5177'],
  MID:  ['#437a22', '#2e5c10'],
  FWD:  ['#964219', '#713417'],
  OTHER:['#7a39bb', '#5f2699'],
};

// Formation positions on a 100x100 grid
// y=0 is top (opponent's goal), y=100 is bottom (our goal, GK).
const FORMATIONS = {
  '442-diamond': {
    name: '4-4-2 Diamond',
    subtitle: 'Diamond midfield. Compact, two strikers.',
    positions: [
      { key: 'GK',  role: 'GK',  x: 50, y: 92 },
      { key: 'LB',  role: 'DEF', x: 14, y: 76 },
      { key: 'CB1', role: 'DEF', x: 36, y: 80 },
      { key: 'CB2', role: 'DEF', x: 64, y: 80 },
      { key: 'RB',  role: 'DEF', x: 86, y: 76 },
      { key: 'DM',  role: 'MID', x: 50, y: 64 },
      { key: 'LM',  role: 'MID', x: 22, y: 50 },
      { key: 'RM',  role: 'MID', x: 78, y: 50 },
      { key: 'AM',  role: 'MID', x: 50, y: 36 },
      { key: 'ST1', role: 'FWD', x: 38, y: 18 },
      { key: 'ST2', role: 'FWD', x: 62, y: 18 },
    ],
  },
  '4141': {
    name: '4-1-4-1',
    subtitle: 'Single pivot, single striker.',
    positions: [
      { key: 'GK',  role: 'GK',  x: 50, y: 92 },
      { key: 'LB',  role: 'DEF', x: 14, y: 76 },
      { key: 'CB1', role: 'DEF', x: 38, y: 80 },
      { key: 'CB2', role: 'DEF', x: 62, y: 80 },
      { key: 'RB',  role: 'DEF', x: 86, y: 76 },
      { key: 'CDM', role: 'MID', x: 50, y: 60 },
      { key: 'LM',  role: 'MID', x: 14, y: 42 },
      { key: 'CM1', role: 'MID', x: 38, y: 44 },
      { key: 'CM2', role: 'MID', x: 62, y: 44 },
      { key: 'RM',  role: 'MID', x: 86, y: 42 },
      { key: 'ST',  role: 'FWD', x: 50, y: 18 },
    ],
  },
  '4231': {
    name: '4-2-3-1',
    subtitle: 'Double pivot, attacking three.',
    positions: [
      { key: 'GK',   role: 'GK',  x: 50, y: 92 },
      { key: 'LB',   role: 'DEF', x: 14, y: 76 },
      { key: 'CB1',  role: 'DEF', x: 38, y: 80 },
      { key: 'CB2',  role: 'DEF', x: 62, y: 80 },
      { key: 'RB',   role: 'DEF', x: 86, y: 76 },
      { key: 'CDM1', role: 'MID', x: 38, y: 62 },
      { key: 'CDM2', role: 'MID', x: 62, y: 62 },
      { key: 'LW',   role: 'MID', x: 18, y: 38 },
      { key: 'CAM',  role: 'MID', x: 50, y: 40 },
      { key: 'RW',   role: 'MID', x: 82, y: 38 },
      { key: 'ST',   role: 'FWD', x: 50, y: 18 },
    ],
  },
};

const SET_PIECES = [
  { key: 'LCK',      label: 'Left corner',       short: 'L-CK',  spot: { x: 5,  y: 5  } },
  { key: 'RCK',      label: 'Right corner',      short: 'R-CK',  spot: { x: 95, y: 5  } },
  { key: 'PEN',      label: 'Penalty',           short: 'PEN',   spot: { x: 50, y: 13 } },
  { key: 'FK_SHORT', label: 'Short free kick',   short: 'F-SH',  spot: null },
  { key: 'FK_LONG',  label: 'Long free kick',    short: 'F-LG',  spot: null },
];

// Cycler stops in fullscreen: lineup → set pieces → back
const CYCLE_ORDER = ['LINEUP', 'LCK', 'RCK', 'PEN', 'FK_SHORT', 'FK_LONG'];

// Availability vocabulary from the sheet
//   Y, BEERS → available
//   TBC → maybe (counts as unavailable for picking, surfaced separately)
//   AWAY, INJ, NP (not picked), N → unavailable
const AVAILABLE_CODES = new Set(['Y', 'B']);

// =========================================================
// State
// =========================================================
const STATE = {
  squad: [],
  fixtures: [],
  // availability: { [matchId]: { [playerId]: 'Y'|'B'|'TBC'|'N' } }
  availability: {},
  ui: {
    matchId: null,
    formationKey: '442-diamond',
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    sheetId: DEFAULT_SHEET_ID,
  },
  // Per-match runtime: indexed by matchId
  runtimes: {},
};

// runtime shape:
// {
//   onPitch: [ { id, posKey, x, y, played: secs, onSince: ms|null } ],
//   bench:   [ playerId ],
//   setPieces: { LCK: playerId, RCK: ..., PEN: ..., FK_SHORT: ..., FK_LONG: ... },
//   timer: { running: false, accumulatedMs: 0, runStartedAt: null },
//   subs: [ { offId, onId, atSec } ],
//   selectedFieldId: null,    // tap-to-swap selection
// }

function blankRuntime() {
  return {
    onPitch: [],
    bench: [],
    setPieces: {},
    timer: { running: false, accumulatedMs: 0, runStartedAt: null },
    subs: [],
    selectedFieldId: null,
    setPieceMode: 'LINEUP', // for fullscreen cycler
  };
}

function getRuntime(matchId) {
  if (!matchId) return null;
  if (!STATE.runtimes[matchId]) STATE.runtimes[matchId] = blankRuntime();
  return STATE.runtimes[matchId];
}

// =========================================================
// Persistence
// =========================================================
function save() {
  try {
    // Snapshot a *paused* version for storage so a future reload can't double-count wall-clock drift,
    // but DO NOT mutate the live STATE — running timers must keep ticking.
    const now = Date.now();
    const snapshotRuntimes = {};
    Object.entries(STATE.runtimes).forEach(([id, rt]) => {
      const cloned = JSON.parse(JSON.stringify(rt));
      if (cloned.timer && cloned.timer.running) {
        cloned.timer.accumulatedMs = now - cloned.timer.runStartedAt;
        cloned.timer.running = false;
        cloned.timer.runStartedAt = null;
        cloned.onPitch.forEach(p => {
          if (p.onSince != null) {
            p.played += (now - p.onSince) / 1000;
            p.onSince = null;
          }
        });
      }
      snapshotRuntimes[id] = cloned;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      squad: STATE.squad,
      fixtures: STATE.fixtures,
      availability: STATE.availability,
      ui: STATE.ui,
      runtimes: snapshotRuntimes,
    }));
  } catch (e) {
    console.error('Save failed', e);
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed.squad) STATE.squad = parsed.squad;
    if (parsed.fixtures) STATE.fixtures = parsed.fixtures;
    if (parsed.availability) STATE.availability = parsed.availability;
    if (parsed.ui) STATE.ui = { ...STATE.ui, ...parsed.ui };
    if (parsed.runtimes) {
      STATE.runtimes = parsed.runtimes;
      // Defensive: ensure timers are not running on reload
      Object.values(STATE.runtimes).forEach(rt => {
        if (rt.timer) { rt.timer.running = false; rt.timer.runStartedAt = null; }
        rt.selectedFieldId = null;
        rt.setPieceMode = 'LINEUP';
        rt.onPitch.forEach(p => { p.onSince = null; });
      });
    }
    return true;
  } catch (e) {
    console.error('Load failed', e);
    return false;
  }
}

// =========================================================
// Squad / fixtures / availability
// =========================================================
function slugify(name) {
  return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function normaliseRole(role) {
  const v = (role || '').trim().toUpperCase();
  if (['GK','GOALKEEPER','GOALIE'].includes(v)) return 'GK';
  if (['DEF','DEFENDER','D','DF','CB','LB','RB'].includes(v)) return 'DEF';
  if (['MID','MIDFIELDER','M','MF','CM','DM','AM','LM','RM'].includes(v)) return 'MID';
  if (['FWD','FW','ST','STRIKER','FORWARD','F','LW','RW'].includes(v)) return 'FWD';
  return 'OTHER';
}

function buildSquad(rows) {
  return rows.map(([name, role], idx) => {
    const r = normaliseRole(role);
    return {
      id: `${slugify(name)}-${idx + 1}`,
      name,
      role: r,
      colors: ROLE_COLORS[r] || ROLE_COLORS.OTHER,
    };
  });
}

function buildFixtures(rows) {
  return rows.map(([date, label], idx) => ({
    id: `m-${date}-${idx + 1}`,
    date,
    label,
  }));
}

function loadDefaults() {
  STATE.squad = buildSquad(DEFAULT_SQUAD);
  STATE.fixtures = buildFixtures(DEFAULT_FIXTURES);
  // default everyone Y for every match
  STATE.availability = {};
  STATE.fixtures.forEach(f => {
    STATE.availability[f.id] = {};
    STATE.squad.forEach(p => { STATE.availability[f.id][p.id] = 'Y'; });
  });
  STATE.ui.matchId = pickRelevantFixture()?.id || STATE.fixtures[0]?.id || null;
}

// Pick today's match if there is one, otherwise the next upcoming, otherwise the most recent past.
function pickRelevantFixture() {
  if (!STATE.fixtures.length) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const todayMs = today.getTime();
  let exact = null;
  let upcoming = null;
  let past = null;
  STATE.fixtures.forEach(f => {
    const d = new Date(f.date); if (isNaN(d.getTime())) return;
    d.setHours(0,0,0,0);
    const ms = d.getTime();
    if (ms === todayMs) exact = f;
    else if (ms > todayMs) {
      if (!upcoming || ms < new Date(upcoming.date).getTime()) upcoming = f;
    } else {
      if (!past || ms > new Date(past.date).getTime()) past = f;
    }
  });
  return exact || upcoming || past;
}

function getAvailability(matchId, playerId) {
  return (STATE.availability[matchId] || {})[playerId] || 'Y';
}

function setAvailability(matchId, playerId, code) {
  if (!STATE.availability[matchId]) STATE.availability[matchId] = {};
  STATE.availability[matchId][playerId] = code;
}

function availablePlayersFor(matchId) {
  if (!matchId) return [];
  return STATE.squad.filter(p => AVAILABLE_CODES.has(getAvailability(matchId, p.id)));
}

// =========================================================
// Formation engine
// =========================================================
function autoPopulate(matchId, formationKey) {
  const formation = FORMATIONS[formationKey];
  if (!formation) return;
  const rt = getRuntime(matchId);
  const available = availablePlayersFor(matchId);

  // Pre-pause timer so any current XI minutes are flushed
  pauseTimerInternal(rt);

  const remaining = [...available];
  const taken = new Set();
  const pickByRole = (role) => {
    const idx = remaining.findIndex(p => p.role === role && !taken.has(p.id));
    if (idx === -1) return null;
    taken.add(remaining[idx].id);
    return remaining.splice(idx, 1)[0];
  };
  const pickAny = () => {
    const idx = remaining.findIndex(p => !taken.has(p.id));
    if (idx === -1) return null;
    taken.add(remaining[idx].id);
    return remaining.splice(idx, 1)[0];
  };

  const onPitch = [];
  formation.positions.forEach(pos => {
    let player = pickByRole(pos.role);
    if (!player && pos.role === 'GK') {
      // No real GK available — leave empty so coach assigns manually.
      return;
    }
    if (!player) player = pickAny();
    if (!player) return;
    onPitch.push({
      id: player.id,
      posKey: pos.key,
      x: pos.x, y: pos.y,
      played: 0,
      onSince: null,
    });
  });

  rt.onPitch = onPitch;
  const onSet = new Set(onPitch.map(p => p.id));
  rt.bench = available.filter(p => !onSet.has(p.id)).map(p => p.id);
  rt.subs = [];
  rt.selectedFieldId = null;
  // Auto-fill set piece defaults: pick first available outfield-ish for each
  const skill = available.filter(p => p.role !== 'GK');
  rt.setPieces = {
    LCK: skill[0]?.id, RCK: skill[1]?.id, PEN: skill[2]?.id,
    FK_SHORT: skill[3]?.id, FK_LONG: skill[4]?.id,
  };
  // reset minutes log: start from clean slate
  STATE.ui.formationKey = formationKey;
  save();
  render();
}

// =========================================================
// Substitutions & selection
// =========================================================
function selectFieldPlayer(playerId) {
  const rt = currentRuntime();
  if (!rt) return;
  rt.selectedFieldId = rt.selectedFieldId === playerId ? null : playerId;
  render();
}

function swapOnPitch(idA, idB) {
  const rt = currentRuntime();
  if (!rt || idA === idB) return;
  const a = rt.onPitch.find(p => p.id === idA);
  const b = rt.onPitch.find(p => p.id === idB);
  if (!a || !b) return;
  const tmpId = a.id;
  a.id = b.id;
  b.id = tmpId;
  // played/onSince follow the player, so swap those too
  const tmpPlayed = a.played, tmpOn = a.onSince;
  a.played = b.played; a.onSince = b.onSince;
  b.played = tmpPlayed; b.onSince = tmpOn;
  rt.selectedFieldId = null;
  save();
  render();
}

function performSub(offId, onId) {
  const rt = currentRuntime();
  if (!rt) return;
  const off = rt.onPitch.find(p => p.id === offId);
  if (!off) return;
  // Pitch-to-pitch: swap positions of two on-pitch players
  if (rt.onPitch.find(p => p.id === onId)) {
    swapOnPitch(offId, onId);
    return;
  }
  if (!rt.bench.includes(onId)) return;

  const now = Date.now();
  if (rt.timer.running && off.onSince != null) {
    off.played += (now - off.onSince) / 1000;
    off.onSince = null;
  }

  // Replace in onPitch
  const newOn = {
    id: onId,
    posKey: off.posKey,
    x: off.x, y: off.y,
    played: getMinutesEntry(onId)?.played || 0, // reuse if cycling back
    onSince: rt.timer.running ? now : null,
  };
  // Remove any pre-existing minutes record for `onId` from history? We just store live played here.
  // Look up if this player has prior minutes from earlier sub cycles in rt.history
  if (rt.history && rt.history[onId]) newOn.played = rt.history[onId];

  rt.onPitch = rt.onPitch.map(p => p.id === offId ? newOn : p);
  rt.bench = rt.bench.filter(id => id !== onId).concat(offId);
  // Save off player's accumulated minutes to history so they survive future re-subs
  if (!rt.history) rt.history = {};
  rt.history[off.id] = off.played;
  // Log
  const atSec = liveTimerSec(rt);
  rt.subs.push({ offId, onId, atSec });
  rt.selectedFieldId = null;
  save();
  render();
}

function getMinutesEntry(playerId) {
  const rt = currentRuntime();
  if (!rt) return null;
  return rt.onPitch.find(p => p.id === playerId);
}

// =========================================================
// Timer (single 45-min half)
// =========================================================
const HALF_SECONDS = 45 * 60;

function liveTimerSec(rt) {
  const ms = rt.timer.running
    ? Date.now() - rt.timer.runStartedAt
    : rt.timer.accumulatedMs;
  return ms / 1000;
}

function startTimerInternal(rt) {
  if (rt.timer.running) return;
  rt.timer.runStartedAt = Date.now() - rt.timer.accumulatedMs;
  rt.timer.running = true;
  // Stamp on-pitch players
  const now = Date.now();
  rt.onPitch.forEach(p => { p.onSince = now; });
}

function pauseTimerInternal(rt) {
  if (!rt.timer.running) return;
  const now = Date.now();
  rt.timer.accumulatedMs = now - rt.timer.runStartedAt;
  rt.timer.running = false;
  rt.timer.runStartedAt = null;
  rt.onPitch.forEach(p => {
    if (p.onSince != null) {
      p.played += (now - p.onSince) / 1000;
      p.onSince = null;
    }
  });
}

function toggleTimer() {
  const rt = currentRuntime();
  if (!rt) return;
  if (rt.timer.running) pauseTimerInternal(rt);
  else startTimerInternal(rt);
  save();
  render();
}

function resetTimer() {
  const rt = currentRuntime();
  if (!rt) return;
  if (!confirm('Reset clock and minutes for this match?')) return;
  pauseTimerInternal(rt);
  rt.timer = { running: false, accumulatedMs: 0, runStartedAt: null };
  rt.onPitch.forEach(p => { p.played = 0; p.onSince = null; });
  rt.history = {};
  rt.subs = [];
  save();
  render();
}

function livePlayedSec(p, rt) {
  if (rt.timer.running && p.onSince != null) {
    return p.played + (Date.now() - p.onSince) / 1000;
  }
  return p.played;
}

function fmtClock(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// =========================================================
// DOM helpers
// =========================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.entries(v).forEach(([dk, dv]) => node.dataset[dk] = dv);
    else if (v === true) node.setAttribute(k, '');
    else if (v != null && v !== false) node.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

function shortName(name, max = 14) {
  if (!name) return '';
  if (name.length <= max) return name;
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    const candidate = `${first} ${last[0]}.`;
    if (candidate.length <= max) return candidate;
    return `${first[0]}. ${last}`.slice(0, max);
  }
  return name.slice(0, max - 1) + '…';
}

function findPlayer(id) { return STATE.squad.find(p => p.id === id); }

function currentMatch() {
  return STATE.fixtures.find(f => f.id === STATE.ui.matchId) || null;
}

function currentRuntime() {
  return STATE.ui.matchId ? getRuntime(STATE.ui.matchId) : null;
}

// =========================================================
// Toast & sync log
// =========================================================
let toastTimer;
function toast(msg, ms = 2200) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

function syncLog(msg) {
  const log = $('#syncLog');
  if (!log) return;
  log.textContent += (log.textContent ? '\n' : '') + msg;
  log.scrollTop = log.scrollHeight;
}

function clearSyncLog() {
  const log = $('#syncLog');
  if (log) log.textContent = '';
}

// =========================================================
// Render
// =========================================================
function render() {
  renderMatchSelect();
  renderFormationButtons();
  renderBoard();
  renderBench();
  renderSetPieces();
  renderTimer();
  renderMinutes();
  renderFullscreen();
}

function renderMatchSelect() {
  const sel = $('#matchSelect');
  sel.innerHTML = '';
  const relevant = pickRelevantFixture();
  const today = new Date(); today.setHours(0,0,0,0);
  STATE.fixtures.forEach(f => {
    const d = new Date(f.date); d.setHours(0,0,0,0);
    let tag = '';
    if (!isNaN(d.getTime())) {
      if (d.getTime() === today.getTime()) tag = ' · TODAY';
      else if (relevant && f.id === relevant.id && d.getTime() > today.getTime()) tag = ' · NEXT';
    }
    const opt = el('option', { value: f.id }, `${formatDateShort(f.date)} — ${f.label}${tag}`);
    if (f.id === STATE.ui.matchId) opt.selected = true;
    sel.appendChild(opt);
  });
  // Brand subtitle: show the loaded match clearly
  const sub = $('#brandSubtitle');
  const m = currentMatch();
  if (sub && m) sub.textContent = `${formatDateShort(m.date)} — ${m.label}`;
  // Counts
  const available = availablePlayersFor(STATE.ui.matchId);
  const rt = currentRuntime();
  const onPitchCount = rt ? rt.onPitch.length : 0;
  const benchCount = rt ? rt.bench.length : 0;
  $('#availableCount').textContent = `${available.length} available`;
  $('#availableCount').className = `chip ${available.length >= 11 ? 'chip-success' : 'chip-warn'}`;
  $('#benchCount').textContent = `${onPitchCount}/11 on pitch · ${benchCount} bench`;
}

function formatDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
}

function renderFormationButtons() {
  $$('.formation-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.formation === STATE.ui.formationKey);
  });
  const f = FORMATIONS[STATE.ui.formationKey];
  if (f) {
    $('#formationTitle').textContent = `${currentMatch()?.label || 'No match'} · ${f.name}`;
    $('#formationSubtitle').textContent = f.subtitle;
    const fsBtn = $('#fsFormationBtn');
    if (fsBtn) fsBtn.textContent = f.name.replace(/-/g, '').replace(' Diamond', '◆');
  }
}

function renderBoard() {
  const overlay = $('#pitchOverlay');
  overlay.innerHTML = '';
  const rt = currentRuntime();
  if (!rt) return;
  rt.onPitch.forEach(p => {
    const player = findPlayer(p.id);
    if (!player) return;
    const marker = createMarker(player, p, { selected: rt.selectedFieldId === p.id });
    overlay.appendChild(marker);
  });
}

function createMarker(player, slot, opts = {}) {
  const node = el('button', {
    class: 'marker' + (opts.selected ? ' selected' : ''),
    style: `left:${slot.x}%; top:${slot.y}%; --marker-a:${player.colors[0]}; --marker-b:${player.colors[1]}`,
    dataset: { id: player.id, posKey: slot.posKey || '' },
    title: `${player.name} (${player.role})`,
  });
  const inner = el('div', {});
  inner.appendChild(el('span', { class: 'name' }, shortName(player.name)));
  inner.appendChild(el('span', { class: 'pos' }, slot.posKey || player.role));
  node.appendChild(inner);
  // Substitution selection / pitch-to-pitch swap
  node.addEventListener('click', (e) => {
    e.preventDefault();
    if (markerJustDragged) { markerJustDragged = false; return; }
    const rt = currentRuntime();
    if (rt && rt.selectedFieldId && rt.selectedFieldId !== player.id) {
      swapOnPitch(rt.selectedFieldId, player.id);
    } else {
      selectFieldPlayer(player.id);
    }
  });
  // Drag
  attachDrag(node, player.id);
  return node;
}

let markerJustDragged = false;

function attachDrag(node, playerId) {
  let drag = null;
  node.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const pitch = node.parentElement;
    const rect = pitch.getBoundingClientRect();
    drag = { pitch, rect, moved: false };
    node.classList.add('dragging');
    node.setPointerCapture(e.pointerId);
  });
  node.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const x = ((e.clientX - drag.rect.left) / drag.rect.width) * 100;
    const y = ((e.clientY - drag.rect.top) / drag.rect.height) * 100;
    const cx = Math.max(4, Math.min(96, x));
    const cy = Math.max(4, Math.min(96, y));
    node.style.left = `${cx}%`;
    node.style.top = `${cy}%`;
    drag.x = cx; drag.y = cy;
    drag.moved = true;
  });
  node.addEventListener('pointerup', () => {
    if (!drag) return;
    node.classList.remove('dragging');
    if (drag.moved) {
      const rt = currentRuntime();
      const slot = rt?.onPitch.find(p => p.id === playerId);
      if (slot) { slot.x = drag.x; slot.y = drag.y; save(); }
      markerJustDragged = true;
    }
    drag = null;
  });
  node.addEventListener('pointercancel', () => { drag = null; node.classList.remove('dragging'); });
}

function renderBench() {
  const list = $('#benchList');
  list.innerHTML = '';
  const rt = currentRuntime();
  if (!rt) return;
  if (rt.bench.length === 0) {
    list.appendChild(el('div', { class: 'bench-empty' }, 'No players on bench yet. Pick a formation and auto-populate.'));
    return;
  }
  const swapping = rt.selectedFieldId != null;
  rt.bench.forEach(id => {
    const player = findPlayer(id);
    if (!player) return;
    const item = el('button', {
      class: 'bench-item' + (swapping ? ' swap-target' : ''),
      title: swapping ? `Sub on for ${findPlayer(rt.selectedFieldId)?.name}` : 'Available bench player',
    },
      el('span', { class: 'bench-pip', style: `--pip-bg: ${player.colors[0]}` }, player.role.slice(0,2)),
      el('span', {}, el('strong', {}, player.name), el('br'), el('small', {}, `${player.role} · ${fmtClock((rt.history?.[id]) || 0)}`)),
      el('span', {},
        swapping
          ? el('span', { class: 'chip chip-success' }, 'Sub in')
          : el('span', { class: 'chip' }, 'Bench')
      ),
    );
    item.addEventListener('click', () => {
      if (swapping) performSub(rt.selectedFieldId, id);
    });
    list.appendChild(item);
  });
}

function renderSetPieces() {
  const list = $('#setPieceList');
  list.innerHTML = '';
  const rt = currentRuntime();
  if (!rt) return;
  const available = availablePlayersFor(STATE.ui.matchId);
  SET_PIECES.forEach(sp => {
    const select = el('select', { class: 'select' });
    select.appendChild(el('option', { value: '' }, '— select —'));
    available.forEach(p => {
      const opt = el('option', { value: p.id }, `${p.name} · ${p.role}`);
      if (rt.setPieces[sp.key] === p.id) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => {
      rt.setPieces[sp.key] = select.value || null;
      save();
      renderFullscreen();
    });
    list.appendChild(el('div', { class: 'setpiece-row' },
      el('span', { class: 'setpiece-icon' }, sp.short),
      el('span', { class: 'setpiece-name' }, sp.label),
      select,
    ));
  });
}

function renderTimer() {
  const rt = currentRuntime();
  const display = $('#timerDisplay');
  const bar = $('#timerBar');
  const toggle = $('#timerToggleBtn');
  const fsClock = $('#fsClock');
  const fsBtn = $('#fsTimerBtn');
  if (!rt) {
    display.textContent = '00:00';
    bar.style.width = '0%';
    toggle.textContent = 'Start';
    if (fsClock) fsClock.textContent = '00:00';
    if (fsBtn) fsBtn.textContent = '▶';
    return;
  }
  const sec = liveTimerSec(rt);
  display.textContent = fmtClock(sec);
  if (fsClock) fsClock.textContent = fmtClock(sec);
  bar.style.width = `${Math.min(100, (sec / HALF_SECONDS) * 100)}%`;
  display.classList.toggle('warn', sec >= HALF_SECONDS - 5 * 60 && sec < HALF_SECONDS);
  display.classList.toggle('over', sec >= HALF_SECONDS);
  if (fsClock) {
    fsClock.classList.toggle('warn', sec >= HALF_SECONDS - 5 * 60 && sec < HALF_SECONDS);
    fsClock.classList.toggle('over', sec >= HALF_SECONDS);
  }
  toggle.textContent = rt.timer.running ? 'Pause' : (rt.timer.accumulatedMs > 0 ? 'Resume' : 'Start');
  toggle.classList.toggle('primary', !rt.timer.running);
  if (fsBtn) fsBtn.textContent = rt.timer.running ? '⏸' : '▶';
}

function renderMinutes() {
  const list = $('#minutesList');
  list.innerHTML = '';
  const rt = currentRuntime();
  if (!rt) return;
  const onIds = new Set(rt.onPitch.map(p => p.id));
  // On pitch first
  rt.onPitch.forEach(p => {
    const player = findPlayer(p.id);
    if (!player) return;
    list.appendChild(el('div', { class: 'minute-row on-pitch' },
      el('span', {}, player.name),
      el('span', { class: 'mins' }, fmtClock(livePlayedSec(p, rt))),
      el('span', { class: 'chip' }, p.posKey || player.role),
    ));
  });
  // Bench
  rt.bench.forEach(id => {
    const player = findPlayer(id);
    if (!player) return;
    list.appendChild(el('div', { class: 'minute-row' },
      el('span', {}, player.name),
      el('span', { class: 'mins' }, fmtClock((rt.history?.[id]) || 0)),
      el('span', { class: 'chip' }, 'Bench'),
    ));
  });
}

// =========================================================
// Fullscreen mode
// =========================================================
function renderFullscreen() {
  const overlay = $('#pitchFsOverlay');
  if (!overlay) return;
  overlay.innerHTML = '';
  const rt = currentRuntime();
  if (!rt) return;

  const mode = rt.setPieceMode || 'LINEUP';
  const isLineup = mode === 'LINEUP';
  const sp = SET_PIECES.find(s => s.key === mode);

  rt.onPitch.forEach(p => {
    const player = findPlayer(p.id);
    if (!player) return;
    const isHighlighted = !isLineup && rt.setPieces[mode] === p.id;
    const m = createFsMarker(player, p, isHighlighted);
    overlay.appendChild(m);
  });

  // Set piece spot indicator
  if (!isLineup && sp && sp.spot) {
    const dot = el('div', {
      class: 'marker setpiece-active',
      style: `left:${sp.spot.x}%; top:${sp.spot.y}%; --marker-a:#ffd24a; --marker-b:#c08a00; pointer-events:none;`,
    }, el('div', {}, el('span', { class: 'name' }, '★')));
    overlay.appendChild(dot);
  }

  // Banner
  const banner = $('#setPieceBanner');
  const labelEl = $('#setPieceLabel');
  const playerEl = $('#setPiecePlayer');
  if (!isLineup && sp) {
    const playerId = rt.setPieces[mode];
    const player = findPlayer(playerId);
    labelEl.textContent = sp.label.toUpperCase();
    playerEl.textContent = player ? player.name : 'Tap to assign';
    banner.hidden = false;
    banner.style.cursor = 'pointer';
    banner.onclick = () => openInlineSetPiecePicker(mode);
  } else {
    banner.hidden = true;
    banner.onclick = null;
  }

  // Next button label
  const nextLabel = $('#fsNextLabel');
  if (nextLabel) {
    if (isLineup) nextLabel.textContent = 'NEXT';
    else nextLabel.textContent = sp?.short || 'NEXT';
  }
}

function createFsMarker(player, slot, highlighted) {
  const rt = currentRuntime();
  const selected = rt && rt.selectedFieldId === player.id;
  const node = el('button', {
    class: 'marker' + (highlighted ? ' setpiece-active' : '') + (selected ? ' selected' : ''),
    style: `left:${slot.x}%; top:${slot.y}%; --marker-a:${player.colors[0]}; --marker-b:${player.colors[1]}`,
    dataset: { id: player.id },
    title: `${player.name} (${player.role})`,
  });
  node.appendChild(el('span', { class: 'name' }, shortName(player.name, 18)));
  node.appendChild(el('span', { class: 'pos' }, slot.posKey || player.role));
  node.addEventListener('click', (e) => {
    e.preventDefault();
    if (markerJustDragged) { markerJustDragged = false; return; }
    const r = currentRuntime();
    if (r && r.selectedFieldId && r.selectedFieldId !== player.id) {
      swapOnPitch(r.selectedFieldId, player.id);
    } else {
      selectFieldPlayer(player.id);
    }
  });
  attachDrag(node, player.id);
  return node;
}

function cycleSetPiece() {
  const rt = currentRuntime();
  if (!rt) return;
  const cur = rt.setPieceMode || 'LINEUP';
  const idx = CYCLE_ORDER.indexOf(cur);
  rt.setPieceMode = CYCLE_ORDER[(idx + 1) % CYCLE_ORDER.length];
  save();
  renderFullscreen();
}

function openInlineSetPiecePicker(spKey) {
  const rt = currentRuntime();
  if (!rt) return;
  const available = availablePlayersFor(STATE.ui.matchId);
  if (!available.length) return;
  const names = available.map((p, i) => `${i + 1}. ${p.name} (${p.role})`).join('\n');
  const cur = rt.setPieces[spKey];
  const curIdx = cur ? available.findIndex(p => p.id === cur) + 1 : '';
  const choice = prompt(`${SET_PIECES.find(s => s.key === spKey).label} — pick a player:\n\n${names}\n\nEnter number:`, String(curIdx || ''));
  if (choice == null) return;
  const n = parseInt(choice, 10);
  if (!isNaN(n) && n >= 1 && n <= available.length) {
    rt.setPieces[spKey] = available[n - 1].id;
    save();
    render();
  }
}

// =========================================================
// Sub drawer (fullscreen)
// =========================================================
function openSubDrawer() {
  const drawer = $('#fsSubDrawer');
  const list = $('#fsBenchList');
  const rt = currentRuntime();
  if (!rt) return;
  list.innerHTML = '';
  const title = $('#fsSubDrawerTitle');
  title.textContent = rt.selectedFieldId
    ? `Sub OFF: ${findPlayer(rt.selectedFieldId)?.name}`
    : 'Tap a player on the pitch first';
  rt.bench.forEach(id => {
    const player = findPlayer(id);
    if (!player) return;
    const btn = el('button', { class: 'bench-item' },
      el('span', { class: 'bench-pip', style: `--pip-bg: ${player.colors[0]}` }, player.role.slice(0,2)),
      el('span', {}, el('strong', {}, player.name), el('br'), el('small', {}, `${player.role}`)),
      el('span', { class: 'chip chip-success' }, 'Sub in'),
    );
    btn.addEventListener('click', () => {
      if (!rt.selectedFieldId) {
        toast('Tap a player on the pitch first');
        return;
      }
      performSub(rt.selectedFieldId, id);
      drawer.hidden = true;
    });
    list.appendChild(btn);
  });
  drawer.hidden = false;
}

function closeSubDrawer() { $('#fsSubDrawer').hidden = true; }

// =========================================================
// Setup drawer
// =========================================================
function openSetup() {
  $('#setupDrawer').hidden = false;
  fillSetupInputs();
}
function closeSetup() { $('#setupDrawer').hidden = true; }

function fillSetupInputs() {
  $('#squadInput').value = STATE.squad.map(p => `${p.name} / ${p.role}`).join('\n');
  $('#fixturesInput').value = STATE.fixtures.map(f => `${f.date} / ${f.label}`).join('\n');
  $('#sheetIdInput').value = STATE.ui.sheetId || '';
  buildAvailabilityMatchSelect();
  renderAvailabilityGrid();
}

function switchTab(tab) {
  $$('.drawer-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  $$('.drawer-section').forEach(s => s.hidden = s.dataset.section !== tab);
}

function saveSquadFromInput() {
  const lines = $('#squadInput').value.split('\n').map(l => l.trim()).filter(Boolean);
  const rows = lines.map(l => {
    const [name, role] = l.split('/').map(s => (s || '').trim());
    return [name || 'Unnamed', role || 'OTHER'];
  });
  // Preserve old IDs if names match (so availability stays linked)
  const oldByName = new Map(STATE.squad.map(p => [p.name.toLowerCase(), p]));
  const newSquad = rows.map(([name, role], idx) => {
    const r = normaliseRole(role);
    const old = oldByName.get(name.toLowerCase());
    return {
      id: old?.id || `${slugify(name)}-${idx + 1}`,
      name, role: r,
      colors: ROLE_COLORS[r] || ROLE_COLORS.OTHER,
    };
  });
  STATE.squad = newSquad;
  // Clean availability: keep only known players per match
  Object.keys(STATE.availability).forEach(matchId => {
    const known = new Set(STATE.squad.map(p => p.id));
    Object.keys(STATE.availability[matchId]).forEach(pid => {
      if (!known.has(pid)) delete STATE.availability[matchId][pid];
    });
  });
  save();
  toast('Squad saved');
  render();
  fillSetupInputs();
}

function saveFixturesFromInput() {
  const lines = $('#fixturesInput').value.split('\n').map(l => l.trim()).filter(Boolean);
  const rows = lines.map(l => {
    const [date, label] = l.split('/').map(s => (s || '').trim());
    return [date, label || 'Match'];
  });
  STATE.fixtures = buildFixtures(rows);
  // Ensure availability dict for each match
  STATE.fixtures.forEach(f => {
    if (!STATE.availability[f.id]) {
      STATE.availability[f.id] = {};
      STATE.squad.forEach(p => { STATE.availability[f.id][p.id] = 'Y'; });
    }
  });
  if (!STATE.fixtures.find(f => f.id === STATE.ui.matchId)) {
    STATE.ui.matchId = STATE.fixtures[0]?.id || null;
  }
  save();
  toast('Fixtures saved');
  render();
  fillSetupInputs();
}

function buildAvailabilityMatchSelect() {
  const sel = $('#availMatchSelect');
  sel.innerHTML = '';
  STATE.fixtures.forEach(f => {
    sel.appendChild(el('option', { value: f.id }, `${formatDateShort(f.date)} — ${f.label}`));
  });
  sel.value = STATE.ui.matchId || STATE.fixtures[0]?.id || '';
  sel.onchange = () => renderAvailabilityGrid();
}

function renderAvailabilityGrid() {
  const grid = $('#availabilityGrid');
  grid.innerHTML = '';
  const matchId = $('#availMatchSelect').value;
  if (!matchId) return;
  STATE.squad.forEach(p => {
    const code = getAvailability(matchId, p.id);
    const row = el('div', { class: 'availability-row' },
      el('div', {},
        el('strong', {}, p.name), el('br'),
        el('small', {}, p.role),
      ),
      buildAvailSegment(matchId, p.id, code),
    );
    grid.appendChild(row);
  });
}

function buildAvailSegment(matchId, playerId, code) {
  const seg = el('div', { class: 'avail-segment' });
  [['Y','Y'], ['B','BEERS'], ['TBC','TBC'], ['N','NO']].forEach(([val, label]) => {
    const b = el('button', {
      class: 'avail-seg-btn' + (code === val ? ' active' : ''),
      dataset: { val },
    }, label);
    b.addEventListener('click', () => {
      setAvailability(matchId, playerId, val);
      // Keep runtime in sync if it's the current match
      if (matchId === STATE.ui.matchId) syncRuntimeAvailability();
      save();
      renderAvailabilityGrid();
      render();
    });
    seg.appendChild(b);
  });
  return seg;
}

function syncRuntimeAvailability() {
  const rt = currentRuntime();
  if (!rt) return;
  const availSet = new Set(availablePlayersFor(STATE.ui.matchId).map(p => p.id));
  // Remove non-available from pitch and bench
  rt.onPitch = rt.onPitch.filter(p => availSet.has(p.id));
  rt.bench = rt.bench.filter(id => availSet.has(id));
  // Add newly-available not present anywhere
  const placed = new Set([...rt.onPitch.map(p => p.id), ...rt.bench]);
  availablePlayersFor(STATE.ui.matchId).forEach(p => {
    if (!placed.has(p.id)) rt.bench.push(p.id);
  });
}

// =========================================================
// Google Sheet sync
// =========================================================
async function syncFromSheet() {
  const id = ($('#sheetIdInput')?.value || STATE.ui.sheetId || '').trim();
  if (!id) { toast('Add a Sheet ID first'); return; }
  STATE.ui.sheetId = id;
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;
  clearSyncLog();
  syncLog(`Fetching sheet ${id}...`);
  const btn = $('#syncBtn'); btn?.classList.add('spin');
  try {
    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const csv = await resp.text();
    syncLog(`Got ${csv.length} chars. Parsing...`);
    const matched = applySheetCsv(csv);
    syncLog(`Updated availability for ${matched.players} players across ${matched.matches} matches.`);
    save();
    render();
    toast(`Sheet sync ✓ ${matched.players} players, ${matched.matches} matches`);
  } catch (err) {
    console.error(err);
    syncLog(`ERROR: ${err.message}\nMake sure the sheet is shared as "Anyone with the link can view".`);
    toast('Sync failed — check sync log in Setup → Sheet');
  } finally {
    btn?.classList.remove('spin');
  }
}

// CSV parsing: minimal RFC 4180 (quoted fields, embedded commas, newlines, escaped quotes)
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* ignore */ }
      else field += c;
    }
  }
  row.push(field);
  if (row.length > 1 || row[0] !== '') rows.push(row);
  return rows;
}

function normaliseAvailCell(value) {
  const v = (value || '').trim().toUpperCase();
  if (!v) return null;
  if (v === 'Y' || v === 'YES') return 'Y';
  if (v === 'B' || v === 'BEER' || v === 'BEERS') return 'B';
  if (v === 'TBC' || v === '?') return 'TBC';
  if (v === 'N' || v === 'NO' || v === 'AWAY' || v === 'INJ' || v === 'INJURED' || v === 'NP' || v.includes('NOT')) return 'N';
  return null;
}

function applySheetCsv(csv) {
  const rows = parseCsv(csv);
  if (!rows.length) return { players: 0, matches: 0 };
  // Heuristic: find a row that contains many of our known player names
  const nameLookup = new Map(STATE.squad.map(p => [p.name.toLowerCase().trim(), p]));
  // For each row, count how many cells match a player name → that column is the "name column"
  let nameColumn = -1;
  let bestMatchCount = 0;
  rows.forEach(row => {
    row.forEach((cell, colIdx) => {
      const key = (cell || '').toLowerCase().trim();
      if (nameLookup.has(key)) {
        // Count player matches in this column across the whole sheet
        const count = rows.reduce((acc, r) => {
          const v = (r[colIdx] || '').toLowerCase().trim();
          return acc + (nameLookup.has(v) ? 1 : 0);
        }, 0);
        if (count > bestMatchCount) {
          bestMatchCount = count;
          nameColumn = colIdx;
        }
      }
    });
  });
  if (nameColumn === -1 || bestMatchCount < 3) {
    syncLog('Could not locate a player-name column. Aborting.');
    return { players: 0, matches: 0 };
  }
  syncLog(`Player name column = ${nameColumn} (${bestMatchCount} matches found)`);

  // Find date columns: cells in rows above any player rows that look like dates
  // Build date map: { columnIdx: 'YYYY-MM-DD' } using first 8 rows
  const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/;
  const dateCols = {};
  rows.slice(0, 12).forEach(row => {
    row.forEach((cell, colIdx) => {
      if (dateCols[colIdx]) return;
      const m = (cell || '').trim().match(dateRegex);
      if (m) {
        const [_, d, mo, y] = m;
        const yyyy = y.length === 2 ? `20${y}` : y;
        const iso = `${yyyy}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        dateCols[colIdx] = iso;
      }
    });
  });
  syncLog(`Found ${Object.keys(dateCols).length} date columns.`);

  // Map sheet ISO date -> our fixture
  const fixtureByDate = new Map();
  STATE.fixtures.forEach(f => fixtureByDate.set(f.date, f));

  let playersUpdated = 0;
  const matchIdsTouched = new Set();
  rows.forEach(row => {
    const name = (row[nameColumn] || '').toLowerCase().trim();
    const player = nameLookup.get(name);
    if (!player) return;
    let touchedAny = false;
    Object.entries(dateCols).forEach(([colIdx, iso]) => {
      const fixture = fixtureByDate.get(iso);
      if (!fixture) return;
      const code = normaliseAvailCell(row[colIdx]);
      if (!code) return;
      setAvailability(fixture.id, player.id, code);
      matchIdsTouched.add(fixture.id);
      touchedAny = true;
    });
    if (touchedAny) playersUpdated++;
  });

  syncRuntimeAvailability();
  return { players: playersUpdated, matches: matchIdsTouched.size };
}

// =========================================================
// Fullscreen
// =========================================================
function openFullscreen() {
  $('#fullscreen').hidden = false;
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}
function closeFullscreen() {
  $('#fullscreen').hidden = true;
  if (document.exitFullscreen && document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

// =========================================================
// Animation loop
// =========================================================
let rafHandle;
function tick() {
  rafHandle = requestAnimationFrame(tick);
  const rt = currentRuntime();
  if (!rt) return;
  // Only repaint timer/minutes if running (cheap)
  if (rt.timer.running) {
    renderTimer();
    // Update only minute mins text without rebuilding DOM
    const list = $('#minutesList');
    Array.from(list.children).forEach(row => {
      const mins = row.querySelector('.mins');
      const name = row.firstChild?.textContent;
      const player = STATE.squad.find(p => p.name === name);
      if (!player) return;
      const onSlot = rt.onPitch.find(p => p.id === player.id);
      if (onSlot) mins.textContent = fmtClock(livePlayedSec(onSlot, rt));
    });
  }
}

// =========================================================
// Wire up
// =========================================================
function init() {
  if (!load() || !STATE.squad.length || !STATE.fixtures.length) {
    loadDefaults();
    save();
  }
  document.documentElement.setAttribute('data-theme', STATE.ui.theme);

  // On every load, prefer today's match (or next upcoming) over a stale saved selection.
  const todayFixture = pickRelevantFixture();
  const today = new Date(); today.setHours(0,0,0,0);
  const savedDate = STATE.ui.matchId
    ? new Date((STATE.fixtures.find(f => f.id === STATE.ui.matchId) || {}).date || 0)
    : null;
  if (savedDate) savedDate.setHours(0,0,0,0);
  const savedIsToday = savedDate && savedDate.getTime() === today.getTime();
  if (todayFixture && !savedIsToday) {
    STATE.ui.matchId = todayFixture.id;
  }

  // First-load: if the current match has no runtime XI yet, auto-populate so the pitch isn't empty.
  if (STATE.ui.matchId) {
    const rt = getRuntime(STATE.ui.matchId);
    if (!rt.onPitch.length && !rt.bench.length) {
      autoPopulate(STATE.ui.matchId, STATE.ui.formationKey);
    }
  }

  $('#matchSelect').addEventListener('change', (e) => {
    STATE.ui.matchId = e.target.value;
    save();
    render();
  });
  $$('.formation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.formation;
      STATE.ui.formationKey = key;
      save();
      render();
    });
  });
  $('#autoPopulateBtn').addEventListener('click', () => {
    if (!STATE.ui.matchId) { toast('Pick a match first'); return; }
    if (currentRuntime()?.onPitch.length && !confirm('Replace current XI with auto-populated formation?')) return;
    autoPopulate(STATE.ui.matchId, STATE.ui.formationKey);
    toast(`${FORMATIONS[STATE.ui.formationKey].name} loaded`);
  });
  $('#clearBoardBtn').addEventListener('click', () => {
    const rt = currentRuntime();
    if (!rt) return;
    if (!confirm('Clear all players from the pitch?')) return;
    pauseTimerInternal(rt);
    rt.onPitch = [];
    rt.bench = availablePlayersFor(STATE.ui.matchId).map(p => p.id);
    rt.subs = [];
    rt.selectedFieldId = null;
    save();
    render();
  });

  $('#timerToggleBtn').addEventListener('click', toggleTimer);
  $('#timerResetBtn').addEventListener('click', resetTimer);
  $('#fsTimerBtn').addEventListener('click', toggleTimer);
  $('#fsFormationBtn').addEventListener('click', () => {
    const keys = Object.keys(FORMATIONS);
    const idx = keys.indexOf(STATE.ui.formationKey);
    const next = keys[(idx + 1) % keys.length];
    if (!STATE.ui.matchId) return;
    if (currentRuntime()?.onPitch.length && !confirm(`Replace current XI with ${FORMATIONS[next].name}?`)) return;
    autoPopulate(STATE.ui.matchId, next);
    toast(FORMATIONS[next].name);
  });

  $('#themeBtn').addEventListener('click', () => {
    STATE.ui.theme = STATE.ui.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', STATE.ui.theme);
    save();
  });

  $('#fsExitBtn').addEventListener('click', closeFullscreen);
  $('#fsNextBtn').addEventListener('click', cycleSetPiece);
  $('#fsSubBtn').addEventListener('click', openSubDrawer);
  $('#fsSubDrawerClose').addEventListener('click', closeSubDrawer);

  $('#setupBtn').addEventListener('click', openSetup);
  $$('[data-close="setup"]').forEach(b => b.addEventListener('click', closeSetup));
  $$('.drawer-tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
  $('#saveSquadBtn').addEventListener('click', saveSquadFromInput);
  $('#resetSquadBtn').addEventListener('click', () => {
    if (!confirm('Reset squad to defaults? Availability and runtime are preserved by name.')) return;
    STATE.squad = buildSquad(DEFAULT_SQUAD);
    save();
    render();
    fillSetupInputs();
  });
  $('#saveFixturesBtn').addEventListener('click', saveFixturesFromInput);
  $('#resetFixturesBtn').addEventListener('click', () => {
    if (!confirm('Reset fixtures to defaults?')) return;
    STATE.fixtures = buildFixtures(DEFAULT_FIXTURES);
    STATE.ui.matchId = STATE.fixtures[0]?.id;
    save();
    render();
    fillSetupInputs();
  });
  $('#availAllYesBtn').addEventListener('click', () => {
    const matchId = $('#availMatchSelect').value;
    STATE.squad.forEach(p => setAvailability(matchId, p.id, 'Y'));
    if (matchId === STATE.ui.matchId) syncRuntimeAvailability();
    save();
    renderAvailabilityGrid();
    render();
  });
  $('#availAllNoBtn').addEventListener('click', () => {
    const matchId = $('#availMatchSelect').value;
    STATE.squad.forEach(p => setAvailability(matchId, p.id, 'N'));
    if (matchId === STATE.ui.matchId) syncRuntimeAvailability();
    save();
    renderAvailabilityGrid();
    render();
  });
  $('#syncBtn').addEventListener('click', syncFromSheet);
  $('#syncNowBtn').addEventListener('click', syncFromSheet);
  $('#forgetSheetBtn').addEventListener('click', () => {
    STATE.ui.sheetId = '';
    $('#sheetIdInput').value = '';
    save();
    toast('Sheet ID cleared');
  });
  $('#exportMinutesBtn').addEventListener('click', exportMinutes);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('#fullscreen').hidden) closeFullscreen();
      else if (!$('#setupDrawer').hidden) closeSetup();
      else if (!$('#fsSubDrawer').hidden) closeSubDrawer();
    }
    if (e.key === ' ' && !$('#fullscreen').hidden && document.activeElement === document.body) {
      e.preventDefault();
      toggleTimer();
    }
    if (e.key === 'ArrowRight' && !$('#fullscreen').hidden) cycleSetPiece();
  });

  render();
  rafHandle = requestAnimationFrame(tick);
}

function exportMinutes() {
  const rt = currentRuntime();
  if (!rt) return;
  const match = currentMatch();
  const all = new Map();
  rt.onPitch.forEach(p => all.set(p.id, livePlayedSec(p, rt)));
  rt.bench.forEach(id => { if (!all.has(id)) all.set(id, (rt.history?.[id]) || 0); });
  Object.entries(rt.history || {}).forEach(([id, secs]) => { if (!all.has(id)) all.set(id, secs); });
  const lines = ['Player,Position,MinutesPlayed,Seconds'];
  for (const [id, secs] of all.entries()) {
    const p = findPlayer(id);
    if (!p) continue;
    lines.push(`${p.name},${p.role},${(secs/60).toFixed(1)},${secs.toFixed(0)}`);
  }
  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `minutes-${match?.date || 'match'}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Minutes exported');
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
