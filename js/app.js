/* ═══════════════════════════════════════
DATA
═══════════════════════════════════════ */
const AREAS = [
  { id:'trabalho', label:'Trabalho', color:'#3A9BDC', bg:'rgba(58,155,220,0.14)',  dark:'#7EC8F4' },
  { id:'familia',  label:'Família',  color:'#E063A8', bg:'rgba(224,99,168,0.14)',  dark:'#F4A0CE' },
  { id:'saude',    label:'Saúde',    color:'#1DB974', bg:'rgba(29,185,116,0.14)',  dark:'#5DDBA0' },
  { id:'estudos',  label:'Estudos',  color:'#6C63FF', bg:'rgba(108,99,255,0.14)',  dark:'#A29BFF' },
  { id:'lazer',    label:'Lazer',    color:'#F0A640', bg:'rgba(240,166,64,0.14)',  dark:'#FFCB6B' },
  { id:'financas', label:'Finanças', color:'#14C8A8', bg:'rgba(20,200,168,0.14)', dark:'#5EECD6' },
];

// Cronograma padrão (template inicial para todos os dias de semana)
const SCHEDULE_WEEKDAY = [
  { time:'06:30', title:'Ritual de início',           dur:'30 min', area:null,       desc:'Água, alongamento, sem celular. Prepare a mente.' },
  { time:'07:00', title:'Bloco de estudos — foco',    dur:'90 min', area:'estudos',  desc:'Melhor janela cognitiva do dia. Conteúdo mais difícil aqui.' },
  { time:'08:30', title:'Trabalho — urgentes',        dur:'90 min', area:'trabalho', desc:'Responda o que bloqueia outras pessoas primeiro.' },
  { time:'10:00', title:'Pausa ativa',                dur:'20 min', area:null,       desc:'Caminhe, tome café. Não pule essa pausa.' },
  { time:'10:20', title:'Trabalho — bloco principal', dur:'2h',     area:'trabalho', desc:'Reuniões e entregas. Agrupe tudo nessa faixa.' },
  { time:'12:20', title:'Almoço + descanso',          dur:'1h',     area:null,       desc:'Longe de telas. Recarregue para a tarde.' },
  { time:'13:20', title:'Estudos — revisão leve',     dur:'60 min', area:'estudos',  desc:'Leitura técnica ou revisão do que estudou de manhã.' },
  { time:'14:20', title:'Trabalho — operacional',     dur:'2h',     area:'trabalho', desc:'Tarefas de execução, sem precisar de muito foco criativo.' },
  { time:'16:20', title:'Encerramento do trabalho',   dur:'10 min', area:null,       desc:'Anote pendências. Feche conscientemente o trabalho.' },
  { time:'16:30', title:'Família',                    dur:'2h',     area:'familia',  desc:'Jantar, conversa, presença. Telefone no silencioso.' },
  { time:'20:30', title:'Lazer',                      dur:'1h',     area:'lazer',    desc:'Série, livro por prazer. Algo que você escolhe livremente.' },
  { time:'22:00', title:'Ritual de encerramento',     dur:'30 min', area:null,       desc:'Sem telas, leitura leve. Prepare o sono.' },
];

const DAY_KEYS = ['dom','seg','ter','qua','qui','sex','sab'];
const DAY_FULL = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
const MONTH_FULL = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

// Cronograma independente por dia
function makeDefaultSchedule() {
  return JSON.parse(JSON.stringify(SCHEDULE_WEEKDAY)).map((s,i) => ({ ...s, id: i+1 }));
}

let state = {
  user: null,
  activeAreas: new Set(['estudos','trabalho','familia','saude','lazer','financas']),
  // Cada dia tem seu próprio array de blocos
  scheduleByDay: {
    dom: makeDefaultSchedule(),
    seg: makeDefaultSchedule(),
    ter: makeDefaultSchedule(),
    qua: makeDefaultSchedule(),
    qui: makeDefaultSchedule(),
    sex: makeDefaultSchedule(),
    sab: makeDefaultSchedule(),
  },
  selectedCronDay: 'seg',
  editingSchedId: null,
};

/* ═══════════════════════════════════════
AUTH
═══════════════════════════════════════ */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((b,i) => b.classList.toggle('active', i===(tab==='login'?0:1)));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-'+tab).classList.add('active');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) { toast('Preencha e-mail e senha.','error'); return; }
  loginUser({ name: email.split('@')[0], email });
}

function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  if (!name||!email||!pass) { toast('Preencha todos os campos.','error'); return; }
  if (pass.length<6)        { toast('Senha muito curta (mínimo 6 caracteres).','error'); return; }
  if (pass!==pass2)         { toast('As senhas não coincidem.','error'); return; }
  loginUser({ name, email });
  toast('Conta criada! Bem-vindo(a), '+name+'!','success');
}

function doDemo() { loginUser({ name:'Demo', email:'demo@kronos.app' }); }

function loginUser(user) {
  state.user = user;
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
  toast('Bem-vindo(a), '+user.name+'!','success');
  render();
}

function doLogout() {
  state.user = null;
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('app').classList.remove('visible');
  toast('Sessão encerrada.','info');
}

/* ═══════════════════════════════════════
NAVIGATION
═══════════════════════════════════════ */
function setView(v) {
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
  document.getElementById('nav-'+v).classList.add('active');
  document.getElementById('page-title').textContent = 'Cronograma';
  document.getElementById('page-subtitle').textContent = 'Distribuição do dia por dia da semana';
}

/* ═══════════════════════════════════════
HELPERS
═══════════════════════════════════════ */
function area(id) { return AREAS.find(a=>a.id===id); }

function toast(msg, type='info') {
  const icons = { success:'ti-circle-check', error:'ti-alert-circle', info:'ti-info-circle' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="ti ${icons[type]}"></i> ${msg}`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(()=>el.remove(), 3500);
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ═══════════════════════════════════════
SIDEBAR AREAS
═══════════════════════════════════════ */
function renderSidebarAreas() {
  document.getElementById('area-chips').innerHTML = AREAS.map(a => {
    const on = state.activeAreas.has(a.id);
    return `<button class="area-chip ${on?'on':''}" onclick="toggleArea('${a.id}')"
        style="${on?`background:${a.bg};`:''}">
        <span class="area-dot" style="background:${a.color};"></span>
        <span style="flex:1;">${a.label}</span>
    </button>`;
  }).join('');
}

function toggleArea(id) {
  if (state.activeAreas.has(id)) state.activeAreas.delete(id);
  else state.activeAreas.add(id);
  render();
}

/* ═══════════════════════════════════════
CRONOGRAMA — ABAS DE DIAS
═══════════════════════════════════════ */
function initCronDayTabs() {
  // Detectar dia atual e selecionar
  const todayIdx = new Date().getDay(); // 0=dom
  selectCronDay(DAY_KEYS[todayIdx]);
}

function selectCronDay(key) {
  state.selectedCronDay = key;

  // Atualizar botões
  DAY_KEYS.forEach(k => {
    const btn = document.getElementById('ctab-'+k);
    if (btn) btn.classList.toggle('active', k===key);
  });

  // Título
  const idx = DAY_KEYS.indexOf(key);
  const titleEl = document.getElementById('cron-day-title');
  if (titleEl) titleEl.textContent = DAY_FULL[idx];

  renderSchedule();
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
    return `<div class="sched-block">
      <div class="sched-time">${s.time}</div>
      <div class="sched-body" style="background:${bg};border-left-color:${border};">
        <div class="sched-header">
          <div>
            <span class="sched-title" style="color:${titleC};">${s.title}</span>
            <span class="sched-dur">${s.dur}</span>
          </div>
          <div class="sched-actions">
            <button class="sched-btn" onclick="openEditSchedule(${s.id})" title="Editar"><i class="ti ti-pencil"></i></button>
            <button class="sched-btn danger" onclick="deleteScheduleBlock(${s.id})" title="Remover"><i class="ti ti-trash"></i></button>
          </div>
        </div>
        <div class="sched-desc" style="color:${descC};">${s.desc}</div>
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
  const s = (state.scheduleByDay[dayKey]||[]).find(s=>s.id===id);
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
  if (!title) { toast('Título obrigatório.','error'); return; }

  const dayKey = state.selectedCronDay;
  if (!state.scheduleByDay[dayKey]) state.scheduleByDay[dayKey] = [];

  if (state.editingSchedId) {
    const s = state.scheduleByDay[dayKey].find(s=>s.id===state.editingSchedId);
    if (s) Object.assign(s, {time,title,dur,desc,area:areaV});
    toast('Bloco atualizado!','success');
  } else {
    state.scheduleByDay[dayKey].push({ id:Date.now(), time, title, dur:dur||'', desc, area:areaV });
    state.scheduleByDay[dayKey].sort((a,b)=>a.time.localeCompare(b.time));
    toast('Bloco adicionado!','success');
  }
  closeModal('modal-sched');
  renderSchedule();
}

function deleteScheduleBlock(id) {
  const dayKey = state.selectedCronDay;
  state.scheduleByDay[dayKey] = (state.scheduleByDay[dayKey]||[]).filter(s=>s.id!==id);
  renderSchedule();
  toast('Bloco removido.','info');
}

/* ═══════════════════════════════════════
UTILITIES
═══════════════════════════════════════ */
function populateAreaSelect(selId, currentVal) {
  const sel = document.getElementById(selId);
  sel.innerHTML = `<option value="">— Sem área —</option>` +
    AREAS.map(a=>`<option value="${a.id}" ${a.id===currentVal?'selected':''}>${a.label}</option>`).join('');
}

function updateClock() {
  const now = new Date();
  document.getElementById('live-time').textContent =
    String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
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

updateClock();
setInterval(updateClock, 15000);
updateDateSubtitle();
