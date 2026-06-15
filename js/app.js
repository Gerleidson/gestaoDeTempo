/* ═══════════════════════════════════════
DATA
═══════════════════════════════════════ */
const AREAS = [
{ id:'trabalho',  label:'Trabalho',  color:'#3A9BDC', bg:'rgba(58,155,220,0.14)',  dark:'#7EC8F4' },
{ id:'familia',   label:'Família',   color:'#E063A8', bg:'rgba(224,99,168,0.14)',  dark:'#F4A0CE' },
{ id:'saude',     label:'Saúde',     color:'#1DB974', bg:'rgba(29,185,116,0.14)', dark:'#5DDBA0' },
{ id:'estudos',   label:'Estudos',   color:'#6C63FF', bg:'rgba(108,99,255,0.14)', dark:'#A29BFF' },
{ id:'lazer',     label:'Lazer',     color:'#F0A640', bg:'rgba(240,166,64,0.14)', dark:'#FFCB6B' },
{ id:'financas',  label:'Finanças',  color:'#14C8A8', bg:'rgba(20,200,168,0.14)','dark':'#5EECD6' },
];

const SCHEDULE_DEFAULT = [
{ id:1, time:'06:30', title:'Ritual de início',          dur:'30 min', area:null,       desc:'Água, alongamento, sem celular. Prepare a mente.' },
{ id:2, time:'07:00', title:'Bloco de estudos — foco',   dur:'90 min', area:'estudos',  desc:'Melhor janela cognitiva do dia. Conteúdo mais difícil aqui.' },
{ id:3, time:'08:30', title:'Trabalho — urgentes',       dur:'90 min', area:'trabalho', desc:'Responda o que bloqueia outras pessoas primeiro.' },
{ id:4, time:'10:00', title:'Pausa ativa',               dur:'20 min', area:null,       desc:'Caminhe, tome café. Não pule essa pausa.' },
{ id:5, time:'10:20', title:'Trabalho — bloco principal',dur:'2h',     area:'trabalho', desc:'Reuniões e entregas. Agrupe tudo nessa faixa.' },
{ id:6, time:'12:20', title:'Almoço + descanso',         dur:'1h',     area:null,       desc:'Longe de telas. Recarregue para a tarde.' },
{ id:7, time:'13:20', title:'Estudos — revisão leve',    dur:'60 min', area:'estudos',  desc:'Leitura técnica ou revisão do que estudou de manhã.' },
{ id:8, time:'14:20', title:'Trabalho — operacional',    dur:'2h',     area:'trabalho', desc:'Tarefas de execução, sem precisar de muito foco criativo.' },
{ id:9, time:'16:20', title:'Encerramento do trabalho',  dur:'10 min', area:null,       desc:'Anote pendências. Feche conscientemente o trabalho.' },
{id:10, time:'16:30', title:'Família',                   dur:'2h',     area:'familia',  desc:'Jantar, conversa, presença. Telefone no silencioso.' },
{id:11, time:'20:30', title:'Lazer',                     dur:'1h',     area:'lazer',    desc:'Série, livro por prazer. Algo que você escolhe livremente.' },
{id:12, time:'22:00', title:'Ritual de encerramento',    dur:'30 min', area:null,       desc:'Sem telas, leitura leve. Prepare o sono.' },
];

let state = {
user: null,
activeAreas: new Set(['estudos','trabalho','familia','saude','lazer','financas']),
tasks: [
{ id:1, text:'Revisar material do curso',   area:'estudos',  done:false },
{ id:2, text:'Fazer exercícios práticos',   area:'estudos',  done:false },
{ id:3, text:'Responder e-mails pendentes', area:'trabalho', done:false },
{ id:4, text:'Planejamento semanal',        area:'financas', done:false },
],
schedule: JSON.parse(JSON.stringify(SCHEDULE_DEFAULT)),
hours: { trabalho:4, familia:2, saude:1, estudos:3, lazer:1, financas:0 },
weekEvents: {},
selectedDay: null,
weekOffset: 0,
editingSchedId: null,
editingEventId: null,
priority: 'medium',
};

/* ═══════════════════════════════════════
AUTH
═══════════════════════════════════════ */
function switchAuthTab(tab) {
document.querySelectorAll('.auth-tab').forEach((b,i) => b.classList.toggle('active', i === (tab==='login'?0:1)));
document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
document.getElementById('panel-' + tab).classList.add('active');
}

function doLogin() {
const email = document.getElementById('login-email').value.trim();
const pass  = document.getElementById('login-pass').value;
if (!email || !pass) { toast('Preencha e-mail e senha.', 'error'); return; }
const name = email.split('@')[0];
loginUser({ name, email });
}

function doRegister() {
const name  = document.getElementById('reg-name').value.trim();
const email = document.getElementById('reg-email').value.trim();
const pass  = document.getElementById('reg-pass').value;
const pass2 = document.getElementById('reg-pass2').value;
if (!name || !email || !pass) { toast('Preencha todos os campos.', 'error'); return; }
if (pass.length < 6)          { toast('Senha muito curta (mínimo 6 caracteres).', 'error'); return; }
if (pass !== pass2)           { toast('As senhas não coincidem.', 'error'); return; }
loginUser({ name, email });
toast('Conta criada! Bem-vindo(a), ' + name + '!', 'success');
}

function doDemo() {
loginUser({ name: 'Demo', email: 'demo@kronos.app' });
}

function loginUser(user) {
state.user = user;
document.getElementById('auth-screen').style.display = 'none';
document.getElementById('app').classList.add('visible');
document.getElementById('user-name').textContent = user.name;
document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
toast('Bem-vindo(a), ' + user.name + '!', 'success');
render();
}

function doLogout() {
state.user = null;
document.getElementById('auth-screen').style.display = 'flex';
document.getElementById('app').classList.remove('visible');
toast('Sessão encerrada.', 'info');
}

/* ═══════════════════════════════════════
NAVIGATION
═══════════════════════════════════════ */
let currentView = 'hoje';
function setView(v) {
currentView = v;
document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
document.getElementById('view-' + v).classList.add('active');
document.getElementById('nav-' + v).classList.add('active');
const titles = { hoje:'Hoje', semanal:'Semanal', cronograma:'Cronograma', alocacao:'Alocação de Tempo' };
const subs   = { hoje:'Suas tarefas e progresso do dia', semanal:'Planeje sua semana com antecedência', cronograma:'Distribuição sugerida do seu dia', alocacao:'Quanto tempo dedica a cada área' };
document.getElementById('page-title').textContent = titles[v];
if (v !== 'hoje') document.getElementById('page-subtitle').textContent = subs[v];
if (v === 'semanal') renderWeekGrid();
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
return `<button class="area-chip ${on?'on':''}" onclick="toggleArea('${a.id}')"
    style="${on ? `background:${a.bg};` : ''}">
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
METRICS
═══════════════════════════════════════ */
function renderMetrics() {
const visible = state.tasks.filter(t => state.activeAreas.has(t.area));
const done    = visible.filter(t => t.done).length;
const total   = visible.length;
const pct     = total ? Math.round(done/total*100) : 0;
const totalH  = Object.entries(state.hours).filter(([k]) => state.activeAreas.has(k)).reduce((s,[,v])=>s+v,0);
document.getElementById('metrics').innerHTML = `
<div class="metric-card">
    <div class="metric-val">${done}/${total}</div>
    <div class="metric-lbl">Tarefas concluídas</div>
    <div class="metric-bar"><div class="metric-bar-fill" style="width:${pct}%;"></div></div>
</div>
<div class="metric-card">
    <div class="metric-val">${pct}%</div>
    <div class="metric-lbl">Progresso do dia</div>
    <div class="metric-bar"><div class="metric-bar-fill" style="width:${pct}%; background:var(--green);"></div></div>
</div>
<div class="metric-card">
    <div class="metric-val">${totalH}h</div>
    <div class="metric-lbl">Horas planejadas</div>
    <div class="metric-bar"><div class="metric-bar-fill" style="width:${Math.min(100,totalH/16*100)}%; background:var(--amber);"></div></div>
</div>`;
}

/* ═══════════════════════════════════════
TASKS
═══════════════════════════════════════ */
function renderTasks() {
const visible = state.tasks.filter(t => state.activeAreas.has(t.area));
const container = document.getElementById('tasks-container');
if (!visible.length) {
container.innerHTML = `<div class="empty-state"><i class="ti ti-checkbox"></i><p>Nenhuma tarefa nas áreas ativas.</p></div>`;
} else {
container.innerHTML = visible.map(t => {
    const a = area(t.area);
    return `<div class="task-row">
    <button class="check ${t.done?'done':''}" onclick="toggleTask(${t.id})"><i class="ti ti-check"></i></button>
    <span class="task-text ${t.done?'done':''}">${t.text}</span>
    <span class="area-tag" style="background:${a.bg};color:${a.dark};">${a.label}</span>
    <button class="task-delete" onclick="deleteTask(${t.id})"><i class="ti ti-trash"></i></button>
    </div>`;
}).join('');
}
const sel = document.getElementById('new-task-area');
sel.innerHTML = AREAS.filter(a=>state.activeAreas.has(a.id)).map(a=>`<option value="${a.id}">${a.label}</option>`).join('');
}

function toggleTask(id) {
const t = state.tasks.find(t=>t.id===id);
if (t) t.done = !t.done;
render();
}

function deleteTask(id) {
state.tasks = state.tasks.filter(t=>t.id!==id);
render();
toast('Tarefa removida.', 'info');
}

function addTask() {
const text = document.getElementById('new-task-input').value.trim();
const a    = document.getElementById('new-task-area').value;
if (!text || !a) return;
state.tasks.push({ id:Date.now(), text, area:a, done:false });
document.getElementById('new-task-input').value = '';
render();
toast('Tarefa adicionada!', 'success');
}

/* ═══════════════════════════════════════
SCHEDULE
═══════════════════════════════════════ */
function renderSchedule() {
const el = document.getElementById('schedule');
el.innerHTML = state.schedule.map(s => {
const a      = s.area ? area(s.area) : null;
const bg     = a ? a.bg : 'var(--surface)';
const border = a ? a.color : 'var(--border2)';
const title  = a ? a.dark : 'var(--text)';
return `<div class="sched-block">
    <div class="sched-time">${s.time}</div>
    <div class="sched-body" style="background:${bg};border-left-color:${border};">
    <div class="sched-header">
        <div><span class="sched-title" style="color:${title};">${s.title}</span><span class="sched-dur">${s.dur}</span></div>
        <div class="sched-actions">
        <button class="sched-btn" onclick="openEditSchedule(${s.id})" title="Editar"><i class="ti ti-pencil"></i></button>
        <button class="sched-btn danger" onclick="deleteScheduleBlock(${s.id})" title="Remover"><i class="ti ti-trash"></i></button>
        </div>
    </div>
    <div class="sched-desc" style="color:${a?a.color:'var(--text3)'};">${s.desc}</div>
    </div>
</div>`;
}).join('');
}

function openAddSchedule() {
state.editingSchedId = null;
document.getElementById('modal-sched-heading').textContent = 'Novo bloco';
document.getElementById('ms-time').value  = '';
document.getElementById('ms-title').value = '';
document.getElementById('ms-dur').value   = '';
document.getElementById('ms-desc').value  = '';
populateAreaSelect('ms-area', null);
openModal('modal-sched');
}

function openEditSchedule(id) {
const s = state.schedule.find(s=>s.id===id);
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
if (state.editingSchedId) {
const s = state.schedule.find(s=>s.id===state.editingSchedId);
Object.assign(s, {time,title,dur,desc,area:areaV});
toast('Bloco atualizado!', 'success');
} else {
state.schedule.push({id:Date.now(),time,title,dur:dur||'',desc,area:areaV});
state.schedule.sort((a,b)=>a.time.localeCompare(b.time));
toast('Bloco adicionado!', 'success');
}
closeModal('modal-sched');
renderSchedule();
}

function deleteScheduleBlock(id) {
state.schedule = state.schedule.filter(s=>s.id!==id);
renderSchedule();
toast('Bloco removido.', 'info');
}

/* ═══════════════════════════════════════
ALLOCATION
═══════════════════════════════════════ */
function renderAlloc() {
const active = AREAS.filter(a=>state.activeAreas.has(a.id));
document.getElementById('alloc-grid').innerHTML = active.map(a => {
const h = state.hours[a.id]||0;
const pct = Math.min(100, Math.round(h/16*100));
return `<div class="alloc-row">
    <div class="alloc-top">
    <span class="alloc-name">${a.label}</span>
    <span class="alloc-num">${h}h / dia</span>
    </div>
    <div class="alloc-bar"><div class="alloc-fill" id="alloc-fill-${a.id}" style="width:${pct}%;background:${a.color};"></div></div>
    <input type="range" class="alloc-slider" min="0" max="12" step="1" value="${h}"
    oninput="updateHours('${a.id}',this.value)" style="accent-color:${a.color};" />
</div>`;
}).join('');
}

function updateHours(id, val) {
state.hours[id] = parseInt(val);
const pct = Math.min(100, Math.round(parseInt(val)/16*100));
const fill = document.getElementById('alloc-fill-' + id);
fill.closest('.alloc-row').querySelector('.alloc-num').textContent = val + 'h / dia';
fill.style.width = pct + '%';
renderMetrics();
}

/* ═══════════════════════════════════════
WEEKLY PLANNER
═══════════════════════════════════════ */
const DAY_NAMES  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const MONTH_NAMES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function getWeekStart() {
const today = new Date();
const day = today.getDay();
const diff = today.getDate() - day + (state.weekOffset * 7);
return new Date(today.setDate(diff));
}

function prevWeek() { state.weekOffset--; renderWeekGrid(); }
function nextWeek() { state.weekOffset++; renderWeekGrid(); }

function renderWeekGrid() {
const weekStart = getWeekStart();
const today     = new Date();
const grid      = document.getElementById('week-grid');
const range     = document.getElementById('week-range');

const days = [];
for (let i=0; i<7; i++) {
const d = new Date(weekStart);
d.setDate(weekStart.getDate() + i);
days.push(d);
}

const s = days[0], e = days[6];
range.textContent = `${s.getDate()} ${MONTH_NAMES[s.getMonth()]} – ${e.getDate()} ${MONTH_NAMES[e.getMonth()]}`;

grid.innerHTML = days.map((d,i) => {
const key  = dateKey(d);
const events = state.weekEvents[key] || [];
const isToday = d.toDateString() === today.toDateString();
const isSel   = state.selectedDay === key;
const dots    = events.slice(0,5).map(ev => {
    const a = ev.area ? area(ev.area) : null;
    return `<div class="day-dot" style="background:${a?a.color:'var(--text3)'}"></div>`;
}).join('');
return `<div class="day-card ${isToday?'today':''} ${isSel?'selected':''}" onclick="selectDay('${key}', '${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}', ${i})">
    <div class="day-name">${DAY_NAMES[i]}</div>
    <div class="day-num">${d.getDate()}</div>
    <div class="day-dots">${dots}</div>
</div>`;
}).join('');

if (!state.selectedDay) {
const todayKey = dateKey(today);
if (days.some(d=>dateKey(d)===todayKey)) selectDay(todayKey, `${today.getDate()} de ${MONTH_NAMES[today.getMonth()]}`, today.getDay());
else selectDay(dateKey(days[0]), `${days[0].getDate()} de ${MONTH_NAMES[days[0].getMonth()]}`, 0);
} else {
renderWeekEvents();
}
}

function dateKey(d) {
return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function selectDay(key, label, dayIdx) {
state.selectedDay = key;
document.getElementById('selected-day-label').textContent = `${DAY_NAMES[dayIdx] || ''}, ${label}`;
renderWeekGrid();
renderWeekEvents();

// populate area select
const sel = document.getElementById('we-area');
sel.innerHTML = AREAS.map(a=>`<option value="${a.id}">${a.label}</option>`).join('');
}

function renderWeekEvents() {
const events = (state.weekEvents[state.selectedDay] || []);
const container = document.getElementById('week-events-container');
if (!events.length) {
container.innerHTML = `<div class="empty-state"><i class="ti ti-calendar-off"></i><p>Nenhuma atividade programada.</p></div>`;
return;
}
const sorted = [...events].sort((a,b)=>a.start.localeCompare(b.start));
const prioColors = { high:'#E24B4A', medium:'var(--amber)', low:'var(--green)' };
container.innerHTML = sorted.map(ev => {
const a = ev.area ? area(ev.area) : null;
return `<div class="week-event-item">
    <div class="priority-dot" style="background:${prioColors[ev.priority]||'var(--text3)'};"></div>
    <div class="event-time-badge">${ev.start} – ${ev.end}</div>
    <div class="event-content">
    <div class="event-title">${ev.title}</div>
    <div class="event-area-tag">${a?a.label:'Geral'}</div>
    </div>
    <div class="event-actions">
    <button class="event-btn" onclick="openEditEvent('${state.selectedDay}','${ev.id}')"><i class="ti ti-pencil"></i></button>
    <button class="event-btn del" onclick="deleteWeekEvent('${state.selectedDay}','${ev.id}')"><i class="ti ti-trash"></i></button>
    </div>
</div>`;
}).join('');
}

function setPriority(p) {
state.priority = p;
['high','medium','low'].forEach(pr => {
const btn = document.getElementById('prio-' + pr);
btn.className = 'priority-btn' + (pr===p ? ` active-${pr}` : '');
});
}

function addWeekEvent() {
const title = document.getElementById('we-title').value.trim();
const areaV = document.getElementById('we-area').value;
const start = document.getElementById('we-start').value;
const end   = document.getElementById('we-end').value;
const notes = document.getElementById('we-notes').value.trim();
if (!title || !start || !end) { toast('Preencha título e horários.', 'error'); return; }
if (!state.selectedDay) { toast('Selecione um dia primeiro.', 'error'); return; }
if (!state.weekEvents[state.selectedDay]) state.weekEvents[state.selectedDay] = [];
state.weekEvents[state.selectedDay].push({
id: String(Date.now()), title, area:areaV, start, end, notes, priority:state.priority
});
document.getElementById('we-title').value = '';
document.getElementById('we-notes').value = '';
toast('Atividade adicionada!', 'success');
renderWeekEvents();
renderWeekGrid();
}

function openEditEvent(dayKey, evId) {
const ev = (state.weekEvents[dayKey]||[]).find(e=>e.id===evId);
if (!ev) return;
state.editingEventId = { dayKey, evId };
populateAreaSelect('me-area', ev.area);
document.getElementById('me-title').value = ev.title;
document.getElementById('me-prio').value  = ev.priority||'medium';
document.getElementById('me-start').value = ev.start;
document.getElementById('me-end').value   = ev.end;
document.getElementById('me-notes').value = ev.notes||'';
openModal('modal-event');
}

function saveEventEdit() {
if (!state.editingEventId) return;
const { dayKey, evId } = state.editingEventId;
const ev = (state.weekEvents[dayKey]||[]).find(e=>e.id===evId);
if (!ev) return;
ev.title    = document.getElementById('me-title').value.trim();
ev.area     = document.getElementById('me-area').value;
ev.priority = document.getElementById('me-prio').value;
ev.start    = document.getElementById('me-start').value;
ev.end      = document.getElementById('me-end').value;
ev.notes    = document.getElementById('me-notes').value.trim();
closeModal('modal-event');
toast('Atividade atualizada!', 'success');
renderWeekEvents();
renderWeekGrid();
}

function deleteWeekEvent(dayKey, evId) {
state.weekEvents[dayKey] = (state.weekEvents[dayKey]||[]).filter(e=>e.id!==evId);
toast('Atividade removida.', 'info');
renderWeekEvents();
renderWeekGrid();
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
String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
}

function updateDateSubtitle() {
const days    = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const months  = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const now     = new Date();
document.getElementById('page-subtitle').textContent =
`${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
}

/* ═══════════════════════════════════════
RENDER ALL
═══════════════════════════════════════ */
function render() {
renderSidebarAreas();
renderMetrics();
renderTasks();
renderSchedule();
renderAlloc();
}

updateClock();
setInterval(updateClock, 15000);
updateDateSubtitle();