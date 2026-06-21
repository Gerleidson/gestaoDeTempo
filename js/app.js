/* ═══════════════════════════════════════
FIREBASE — inicialização via CDN ESM
═══════════════════════════════════════ */
import { initializeApp }                            from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut,
         onAuthStateChanged, updateProfile }        from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc,
         onSnapshot }                               from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyBoKmPZXp4apH-wQzWt7egVhDc_Go9yRSs',
  authDomain:        'gestao-de-tempo-7888e.firebaseapp.com',
  projectId:         'gestao-de-tempo-7888e',
  storageBucket:     'gestao-de-tempo-7888e.firebasestorage.app',
  messagingSenderId: '2393631625',
  appId:             '1:2393631625:web:c27fafc0b68d9887278f58',
};

const fbApp = initializeApp(firebaseConfig);
const auth  = getAuth(fbApp);
const db    = getFirestore(fbApp);

/* ═══════════════════════════════════════
DATA
═══════════════════════════════════════ */
const AREAS = [
  { id:'trabalho',   label:'Trabalho',   color:'#3A9BDC', bg:'rgba(58,155,220,0.14)',  dark:'#7EC8F4' },
  { id:'familia',    label:'Família',    color:'#E063A8', bg:'rgba(224,99,168,0.14)',  dark:'#F4A0CE' },
  { id:'saude',      label:'Saúde',      color:'#1DB974', bg:'rgba(29,185,116,0.14)',  dark:'#5DDBA0' },
  { id:'estudos',    label:'Estudos',    color:'#6C63FF', bg:'rgba(108,99,255,0.14)',  dark:'#A29BFF' },
  { id:'lazer',      label:'Lazer',      color:'#F0A640', bg:'rgba(240,166,64,0.14)',  dark:'#FFCB6B' },
  { id:'financas',   label:'Finanças',   color:'#14C8A8', bg:'rgba(20,200,168,0.14)',  dark:'#5EECD6' },
  { id:'espiritual', label:'Espiritual', color:'#A67AF4', bg:'rgba(166,122,244,0.14)', dark:'#C9AEFB' },
];

const SCHEDULE_SEG = [
  { time:'05:00', title:'Oração e leitura da Bíblia',     dur:'1h',     area:'espiritual', desc:'Comece o dia com oração e leitura da Bíblia.' },
  { time:'06:00', title:'Café da manhã e preparação',     dur:'1h',     area:null,         desc:'Café da manhã, arrumar a casa rapidamente e se preparar para o dia.' },
  { time:'07:00', title:'Levar filha',                    dur:'40 min', area:'familia',    desc:'Levar a filha (se estiver com ela neste dia).' },
  { time:'08:00', title:'Academia + deslocamentos',       dur:'1h30',   area:'saude',      desc:'Treino e deslocamentos.' },
  { time:'09:30', title:'Banho e refeição',               dur:'1h',     area:null,         desc:'Banho e refeição após o treino.' },
  { time:'10:30', title:'Inglês',                         dur:'1h',     area:'estudos',    desc:'Estudo de inglês.' },
  { time:'12:30', title:'Trabalho',                       dur:'7h30',   area:'trabalho',   desc:'Bloco principal de trabalho.' },
  { time:'20:20', title:'Jantar',                         dur:'40 min', area:null,         desc:'Jantar.' },
  { time:'21:00', title:'Dormir',                         dur:'',       area:null,         desc:'Hora de dormir e descansar.' },
];
const SCHEDULE_TER = [
  { time:'05:00', title:'Oração e leitura da Bíblia',     dur:'1h',     area:'espiritual', desc:'Comece o dia com oração e leitura da Bíblia.' },
  { time:'06:00', title:'Café da manhã e preparação',     dur:'1h',     area:null,         desc:'Café da manhã, arrumar a casa rapidamente e se preparar para o dia.' },
  { time:'07:00', title:'Levar filha',                    dur:'40 min', area:'familia',    desc:'Levar a filha (se estiver com ela neste dia).' },
  { time:'08:00', title:'Academia + deslocamentos',       dur:'1h30',   area:'saude',      desc:'Treino e deslocamentos.' },
  { time:'09:30', title:'Banho e refeição',               dur:'1h',     area:null,         desc:'Banho e refeição após o treino.' },
  { time:'10:30', title:'Programação',                    dur:'1h',     area:'estudos',    desc:'Estudo de programação.' },
  { time:'12:30', title:'Trabalho',                       dur:'7h30',   area:'trabalho',   desc:'Bloco principal de trabalho.' },
  { time:'20:20', title:'Jantar',                         dur:'40 min', area:null,         desc:'Jantar.' },
  { time:'21:00', title:'Dormir',                         dur:'',       area:null,         desc:'Hora de dormir e descansar.' },
];
const SCHEDULE_QUA = [
  { time:'05:00', title:'Oração e leitura da Bíblia',     dur:'1h',     area:'espiritual', desc:'Comece o dia com oração e leitura da Bíblia.' },
  { time:'06:00', title:'Café da manhã e preparação',     dur:'1h',     area:null,         desc:'Café da manhã, arrumar a casa rapidamente e se preparar para o dia.' },
  { time:'07:00', title:'Levar filha',                    dur:'40 min', area:'familia',    desc:'Levar a filha (se estiver com ela neste dia).' },
  { time:'08:00', title:'Academia + deslocamentos',       dur:'1h30',   area:'saude',      desc:'Treino e deslocamentos.' },
  { time:'09:30', title:'Banho e refeição',               dur:'1h',     area:null,         desc:'Banho e refeição após o treino.' },
  { time:'10:30', title:'Inglês',                         dur:'1h',     area:'estudos',    desc:'Estudo de inglês.' },
  { time:'12:30', title:'Trabalho',                       dur:'7h30',   area:'trabalho',   desc:'Bloco principal de trabalho.' },
  { time:'20:20', title:'Jantar',                         dur:'40 min', area:null,         desc:'Jantar.' },
  { time:'21:00', title:'Dormir',                         dur:'',       area:null,         desc:'Hora de dormir e descansar.' },
];
const SCHEDULE_QUI = [
  { time:'05:00', title:'Oração e leitura da Bíblia',     dur:'1h',     area:'espiritual', desc:'Comece o dia com oração e leitura da Bíblia.' },
  { time:'06:00', title:'Café da manhã e preparação',     dur:'1h',     area:null,         desc:'Café da manhã, arrumar a casa rapidamente e se preparar para o dia.' },
  { time:'08:00', title:'Programação',                    dur:'2h30',   area:'estudos',    desc:'Estudo de programação.' },
  { time:'10:30', title:'Curso',                          dur:'1h',     area:'estudos',    desc:'Curso.' },
  { time:'12:30', title:'Trabalho',                       dur:'7h30',   area:'trabalho',   desc:'Bloco principal de trabalho.' },
  { time:'20:20', title:'Jantar',                         dur:'40 min', area:null,         desc:'Jantar.' },
  { time:'21:00', title:'Dormir',                         dur:'',       area:null,         desc:'Hora de dormir e descansar.' },
];
const SCHEDULE_SEX = [
  { time:'05:00', title:'Oração e leitura da Bíblia',     dur:'1h',     area:'espiritual', desc:'Comece o dia com oração e leitura da Bíblia.' },
  { time:'06:00', title:'Café da manhã e preparação',     dur:'1h',     area:null,         desc:'Café da manhã, arrumar a casa rapidamente e se preparar para o dia.' },
  { time:'08:00', title:'Inglês',                         dur:'1h',     area:'estudos',    desc:'Estudo de inglês.' },
  { time:'09:00', title:'Programação',                    dur:'2h',     area:'estudos',    desc:'Estudo de programação.' },
  { time:'12:30', title:'Trabalho',                       dur:'7h30',   area:'trabalho',   desc:'Bloco principal de trabalho.' },
  { time:'20:20', title:'Jantar',                         dur:'40 min', area:null,         desc:'Jantar.' },
  { time:'21:00', title:'Dormir',                         dur:'',       area:null,         desc:'Hora de dormir e descansar.' },
];
const SCHEDULE_SAB = [
  { time:'Manhã',           title:'Trabalho',                     dur:'',     area:'trabalho', desc:'Período da manhã dedicado ao trabalho.' },
  { time:'15:30',           title:'Mercado e organização da casa', dur:'1h30', area:null,       desc:'Mercado, limpeza da casa, roupas e organização.' },
  { time:'Restante do dia', title:'Filha ou lazer',               dur:'',     area:null,       desc:'Tempo livre com a filha ou para lazer.' },
];
const SCHEDULE_DOM = [
  { time:'Dia todo', title:'Prioridade total',  dur:'',   area:'familia', desc:'Filha, família, igreja (se fizer parte da sua rotina) e descanso.' },
  { time:'18:00',    title:'Planejar a semana', dur:'1h', area:null,      desc:'Separar roupas e organizar as refeições da semana.' },
];

const DEFAULT_SCHEDULES = { dom:SCHEDULE_DOM, seg:SCHEDULE_SEG, ter:SCHEDULE_TER, qua:SCHEDULE_QUA, qui:SCHEDULE_QUI, sex:SCHEDULE_SEX, sab:SCHEDULE_SAB };
const DAY_KEYS  = ['dom','seg','ter','qua','qui','sex','sab'];
const DAY_FULL  = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

function makeDefaultSchedule(dayKey) {
  return JSON.parse(JSON.stringify(DEFAULT_SCHEDULES[dayKey] || [])).map((s,i) => ({ ...s, id: i+1, done: false }));
}
function makeDefaultScheduleByDay() {
  const obj = {};
  DAY_KEYS.forEach(k => { obj[k] = makeDefaultSchedule(k); });
  return obj;
}

/* ═══════════════════════════════════════
STATE
═══════════════════════════════════════ */
let state = {
  user:            null,
  activeAreas:     new Set(AREAS.map(a => a.id)),
  scheduleByDay:   makeDefaultScheduleByDay(),
  selectedCronDay: 'seg',
  editingSchedId:  null,
};

let unsubscribeFirestore = null; // listener em tempo real

/* ═══════════════════════════════════════
FIRESTORE — salvar / carregar
═══════════════════════════════════════ */
async function saveToFirestore() {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  try {
    await setDoc(doc(db, 'usuarios', uid), {
      activeAreas:     [...state.activeAreas],
      scheduleByDay:   state.scheduleByDay,
      selectedCronDay: state.selectedCronDay,
      updatedAt:       new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn('Erro ao salvar no Firestore:', e);
    toast('Erro ao salvar dados.', 'error');
  }
}

function subscribeFirestore(uid) {
  if (unsubscribeFirestore) unsubscribeFirestore();
  unsubscribeFirestore = onSnapshot(doc(db, 'usuarios', uid), (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    state.activeAreas     = new Set(data.activeAreas || AREAS.map(a => a.id));
    state.scheduleByDay   = data.scheduleByDay || makeDefaultScheduleByDay();
    state.selectedCronDay = data.selectedCronDay || 'seg';
    // Garante que todos os dias existam
    DAY_KEYS.forEach(k => {
      if (!state.scheduleByDay[k]) state.scheduleByDay[k] = makeDefaultSchedule(k);
    });
    render();
  });
}

// Alias para manter compatibilidade com chamadas internas
function saveState() { saveToFirestore(); }

/* ═══════════════════════════════════════
AUTH — Firebase
═══════════════════════════════════════ */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((b, i) => b.classList.toggle('active', i === (tab === 'login' ? 0 : 1)));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
}

function setAuthLoading(loading) {
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(b => {
    b.disabled = loading;
    if (loading) b.style.opacity = '0.6';
    else b.style.opacity = '';
  });
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) { toast('Preencha e-mail e senha.', 'error'); return; }
  setAuthLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged cuida do resto
  } catch (e) {
    toast(firebaseAuthError(e.code), 'error');
    setAuthLoading(false);
  }
}

async function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  if (!name || !email || !pass)  { toast('Preencha todos os campos.', 'error'); return; }
  if (pass.length < 6)           { toast('Senha muito curta (mínimo 6 caracteres).', 'error'); return; }
  if (pass !== pass2)            { toast('As senhas não coincidem.', 'error'); return; }
  setAuthLoading(true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    // Salva cronograma padrão para o novo usuário
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      activeAreas:     [...state.activeAreas],
      scheduleByDay:   state.scheduleByDay,
      selectedCronDay: state.selectedCronDay,
      updatedAt:       new Date().toISOString(),
    });
    toast('Conta criada! Bem-vindo(a), ' + name + '!', 'success');
  } catch (e) {
    toast(firebaseAuthError(e.code), 'error');
    setAuthLoading(false);
  }
}

async function doLogout() {
  if (unsubscribeFirestore) { unsubscribeFirestore(); unsubscribeFirestore = null; }
  await signOut(auth);
  state.user          = null;
  state.scheduleByDay = makeDefaultScheduleByDay();
  state.activeAreas   = new Set(AREAS.map(a => a.id));
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('app').classList.remove('visible');
  toast('Sessão encerrada.', 'info');
}

function firebaseAuthError(code) {
  const msgs = {
    'auth/user-not-found':      'E-mail não encontrado.',
    'auth/wrong-password':      'Senha incorreta.',
    'auth/invalid-credential':  'E-mail ou senha inválidos.',
    'auth/email-already-in-use':'E-mail já cadastrado.',
    'auth/weak-password':       'Senha muito fraca.',
    'auth/invalid-email':       'E-mail inválido.',
    'auth/too-many-requests':   'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
  };
  return msgs[code] || 'Erro de autenticação. Tente novamente.';
}

// Observa mudanças de autenticação — ponto central de entrada
onAuthStateChanged(auth, async (user) => {
  setAuthLoading(false);
  if (user) {
    const name = user.displayName || user.email.split('@')[0];
    state.user = { name, email: user.email, uid: user.uid };

    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').classList.add('visible');
    document.getElementById('user-name').textContent    = name;
    document.getElementById('user-avatar').textContent  = name.charAt(0).toUpperCase();

    // Verifica se já tem dados no Firestore
    const snap = await getDoc(doc(db, 'usuarios', user.uid));
    if (!snap.exists()) {
      // Primeiro login — salva cronograma padrão
      await saveToFirestore();
    }

    // Abre listener em tempo real (sincroniza automaticamente)
    subscribeFirestore(user.uid);
    toast('Bem-vindo(a), ' + name + '!', 'success');
  } else {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app').classList.remove('visible');
  }
});

/* ═══════════════════════════════════════
NAVEGAÇÃO
═══════════════════════════════════════ */
function setView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + v).classList.add('active');
  document.getElementById('nav-' + v).classList.add('active');
  document.getElementById('page-title').textContent    = 'Cronograma';
  document.getElementById('page-subtitle').textContent = 'Distribuição do dia por dia da semana';
}

/* ═══════════════════════════════════════
HELPERS
═══════════════════════════════════════ */
function area(id) { return AREAS.find(a => a.id === id); }

function toast(msg, type = 'info') {
  const icons = { success:'ti-circle-check', error:'ti-alert-circle', info:'ti-info-circle' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="ti ${icons[type]}"></i> ${msg}`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ═══════════════════════════════════════
SIDEBAR AREAS
═══════════════════════════════════════ */
function renderSidebarAreas() {
  document.getElementById('area-chips').innerHTML = AREAS.map(a => {
    const on = state.activeAreas.has(a.id);
    return `<button class="area-chip ${on ? 'on' : ''}" onclick="toggleArea('${a.id}')"
        style="${on ? `background:${a.bg};` : ''}">
        <span class="area-dot" style="background:${a.color};"></span>
        <span style="flex:1;">${a.label}</span>
    </button>`;
  }).join('');
}

function toggleArea(id) {
  if (state.activeAreas.has(id)) state.activeAreas.delete(id);
  else state.activeAreas.add(id);
  saveState();
  render();
}

/* ═══════════════════════════════════════
CRONOGRAMA — ABAS DE DIAS
═══════════════════════════════════════ */
function initCronDayTabs() {
  selectCronDay(state.selectedCronDay);
}

function selectCronDay(key) {
  state.selectedCronDay = key;

  DAY_KEYS.forEach(k => {
    const btn = document.getElementById('ctab-' + k);
    if (btn) btn.classList.toggle('active', k === key);
  });

  const idx = DAY_KEYS.indexOf(key);
  const titleEl = document.getElementById('cron-day-title');
  if (titleEl) titleEl.textContent = DAY_FULL[idx];

  renderSchedule();
  saveState(); // persiste dia selecionado
}

/* ═══════════════════════════════════════
SCHEDULE (por dia)
═══════════════════════════════════════ */
function renderSchedule() {
  const dayKey = state.selectedCronDay;
  const blocks = state.scheduleByDay[dayKey] || [];
  const el = document.getElementById('schedule');
  if (!el) return;

  if (!blocks.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-calendar-off"></i><p>Nenhum bloco cadastrado para este dia.</p></div>`;
    return;
  }

  el.innerHTML = blocks.map(s => {
    const a      = s.area ? area(s.area) : null;
    const bg     = a ? a.bg : 'var(--surface)';
    const border = a ? a.color : 'var(--border2)';
    const titleC = a ? a.dark : 'var(--text)';
    const descC  = a ? a.color : 'var(--text3)';
    const done   = s.done || false;
    return `<div class="sched-block${done ? ' sched-done' : ''}">
      <div class="sched-time">${s.time}</div>
      <div class="sched-body" style="background:${bg};border-left-color:${border};">
        <div class="sched-header">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
            <button class="sched-check${done ? ' checked' : ''}" onclick="toggleScheduleDone(${s.id})" title="${done ? 'Marcar como pendente' : 'Marcar como concluído'}">
              ${done ? '<i class="ti ti-check"></i>' : ''}
            </button>
            <div style="min-width:0;">
              <span class="sched-title" style="color:${titleC};">${s.title}</span>
              <span class="sched-dur">${s.dur}</span>
            </div>
          </div>
          <div class="sched-actions">
            <button class="sched-btn" onclick="openEditSchedule(${s.id})" title="Editar"><i class="ti ti-pencil"></i></button>
            <button class="sched-btn danger" onclick="deleteScheduleBlock(${s.id})" title="Remover"><i class="ti ti-trash"></i></button>
          </div>
        </div>
        ${s.desc ? `<div class="sched-desc" style="color:${descC};">${s.desc}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function openAddSchedule() {
  state.editingSchedId = null;
  document.getElementById('modal-sched-heading').textContent = 'Novo bloco — ' + DAY_FULL[DAY_KEYS.indexOf(state.selectedCronDay)];
  document.getElementById('ms-time').value  = '';
  document.getElementById('ms-title').value = '';
  document.getElementById('ms-dur').value   = '';
  document.getElementById('ms-desc').value  = '';
  populateAreaSelect('ms-area', null);
  openModal('modal-sched');
}

function openEditSchedule(id) {
  const dayKey = state.selectedCronDay;
  const s = (state.scheduleByDay[dayKey] || []).find(s => s.id === id);
  if (!s) return;
  state.editingSchedId = id;
  document.getElementById('modal-sched-heading').textContent = 'Editar bloco';
  document.getElementById('ms-time').value  = s.time;
  document.getElementById('ms-title').value = s.title;
  document.getElementById('ms-dur').value   = s.dur;
  document.getElementById('ms-desc').value  = s.desc;
  populateAreaSelect('ms-area', s.area);
  openModal('modal-sched');
}

function saveScheduleBlock() {
  const time  = document.getElementById('ms-time').value;
  const title = document.getElementById('ms-title').value.trim();
  const dur   = document.getElementById('ms-dur').value.trim();
  const desc  = document.getElementById('ms-desc').value.trim();
  const areaV = document.getElementById('ms-area').value || null;
  if (!title) { toast('Título obrigatório.', 'error'); return; }

  const dayKey = state.selectedCronDay;
  if (!state.scheduleByDay[dayKey]) state.scheduleByDay[dayKey] = [];

  if (state.editingSchedId) {
    const s = state.scheduleByDay[dayKey].find(s => s.id === state.editingSchedId);
    if (s) Object.assign(s, { time, title, dur, desc, area: areaV });
    toast('Bloco atualizado!', 'success');
  } else {
    state.scheduleByDay[dayKey].push({ id: Date.now(), time, title, dur: dur || '', desc, area: areaV, done: false });
    state.scheduleByDay[dayKey].sort((a, b) => a.time.localeCompare(b.time));
    toast('Bloco adicionado!', 'success');
  }

  saveState();
  closeModal('modal-sched');
  renderSchedule();
}

function deleteScheduleBlock(id) {
  const dayKey = state.selectedCronDay;
  state.scheduleByDay[dayKey] = (state.scheduleByDay[dayKey] || []).filter(s => s.id !== id);
  saveState();
  renderSchedule();
  toast('Bloco removido.', 'info');
}

function toggleScheduleDone(id) {
  const dayKey = state.selectedCronDay;
  const s = (state.scheduleByDay[dayKey] || []).find(s => s.id === id);
  if (!s) return;
  s.done = !s.done;
  saveState();
  renderSchedule();
}

/* ═══════════════════════════════════════
RESET
═══════════════════════════════════════ */
function resetDaySchedule() {
  const dayKey  = state.selectedCronDay;
  const dayName = DAY_FULL[DAY_KEYS.indexOf(dayKey)];
  if (!confirm(`Restaurar o cronograma padrão para ${dayName}? Todas as alterações do dia serão perdidas.`)) return;
  state.scheduleByDay[dayKey] = makeDefaultSchedule(dayKey);
  saveState();
  renderSchedule();
  toast(`Cronograma de ${dayName} restaurado.`, 'info');
}

function resetAllSchedules() {
  if (!confirm('Restaurar o cronograma padrão para TODOS os dias? Todas as alterações serão perdidas.')) return;
  state.scheduleByDay = makeDefaultScheduleByDay();
  saveState();
  renderSchedule();
  toast('Todos os cronogramas foram restaurados.', 'info');
}

/* ═══════════════════════════════════════
UTILITIES
═══════════════════════════════════════ */
function populateAreaSelect(selId, currentVal) {
  const sel = document.getElementById(selId);
  sel.innerHTML = `<option value="">— Sem área —</option>` +
    AREAS.map(a => `<option value="${a.id}" ${a.id === currentVal ? 'selected' : ''}>${a.label}</option>`).join('');
}

function updateClock() {
  const now = new Date();
  document.getElementById('live-time').textContent =
    String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}

function updateDateSubtitle() {
  const days   = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const now = new Date();
  document.getElementById('page-subtitle').textContent =
    `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
}

/* ═══════════════════════════════════════
RENDER ALL
═══════════════════════════════════════ */
function render() {
  renderSidebarAreas();
  initCronDayTabs();
}

/* ═══════════════════════════════════════
EXPOR FUNÇÕES GLOBAIS (necessário para onclick no HTML)
═══════════════════════════════════════ */
Object.assign(window, {
  switchAuthTab, doLogin, doRegister, doLogout,
  setView, toggleArea,
  selectCronDay, openAddSchedule, openEditSchedule,
  saveScheduleBlock, deleteScheduleBlock, toggleScheduleDone,
  resetDaySchedule, resetAllSchedules,
  openModal, closeModal,
});

/* ═══════════════════════════════════════
INICIALIZAÇÃO
═══════════════════════════════════════ */
(function init() {
  updateClock();
  setInterval(updateClock, 15000);
  updateDateSubtitle();
  // onAuthStateChanged já cuida de mostrar/esconder telas
})();
