const AREAS = [
  { id:'trabalho',  label:'Trabalho',    color:'#185FA5', bg:'#E6F1FB', dark:'#0C447C', pill:'#B5D4F4' },
  { id:'familia',   label:'Família',     color:'#D4537E', bg:'#FBEAF0', dark:'#72243E', pill:'#F4C0D1' },
  { id:'saude',     label:'Saúde',       color:'#0F6E56', bg:'#E1F5EE', dark:'#085041', pill:'#9FE1CB' },
  { id:'estudos',   label:'Estudos',     color:'#534AB7', bg:'#EEEDFE', dark:'#3C3489', pill:'#CECBF6' },
  { id:'lazer',     label:'Lazer',       color:'#BA7517', bg:'#FAEEDA', dark:'#633806', pill:'#FAC775' },
  { id:'financas',  label:'Finanças',    color:'#639922', bg:'#EAF3DE', dark:'#27500A', pill:'#C0DD97' },
];

const SCHEDULE = [
  { time:'06:30', title:'Ritual de início',             dur:'30 min', area:null,       desc:'Água, alongamento, sem celular. Prepare a mente.', tasks:[] },
  { time:'07:00', title:'Bloco de estudos — foco',      dur:'90 min', area:'estudos',  desc:'Melhor janela cognitiva do dia. Conteúdo mais difícil aqui.', tasks:['Revisar material do curso','Exercícios práticos'] },
  { time:'08:30', title:'Trabalho — urgentes',          dur:'90 min', area:'trabalho', desc:'Responda o que bloqueia outras pessoas primeiro.', tasks:['Responder e-mails pendentes'] },
  { time:'10:00', title:'Pausa ativa',                  dur:'20 min', area:null,       desc:'Caminhe, tome café. Não pule essa pausa.', tasks:[] },
  { time:'10:20', title:'Trabalho — bloco principal',   dur:'2h',     area:'trabalho', desc:'Reuniões e entregas. Agrupe tudo nessa faixa.', tasks:[] },
  { time:'12:20', title:'Almoço + descanso',            dur:'1h',     area:null,       desc:'Longe de telas. Recarregue para a tarde.', tasks:[] },
  { time:'13:20', title:'Estudos — revisão leve',       dur:'60 min', area:'estudos',  desc:'Leitura técnica ou revisão do que estudou de manhã.', tasks:['Ler 30 min de livro técnico'] },
  { time:'14:20', title:'Trabalho — operacional',       dur:'2h',     area:'trabalho', desc:'Tarefas de execução, sem precisar de muito foco criativo.', tasks:[] },
  { time:'16:20', title:'Encerramento do trabalho',     dur:'10 min', area:null,       desc:'Anote pendências. Feche conscientemente o trabalho.', tasks:[] },
  { time:'16:30', title:'Família',                      dur:'2h',     area:'familia',  desc:'Jantar, conversa, presença. Telefone no silencioso.', tasks:[] },
  { time:'20:30', title:'Lazer',                        dur:'1h',     area:'lazer',    desc:'Série, livro por prazer. Algo que você escolhe livremente.', tasks:[] },
  { time:'22:00', title:'Ritual de encerramento',       dur:'30 min', area:null,       desc:'Sem telas, leitura leve. Prepare o sono.', tasks:[] },
];

let activeAreas = new Set(['estudos','trabalho','familia','saude','lazer','financas']);
let tasks = [
  { id:1, text:'Revisar material do curso', area:'estudos', done:false },
  { id:2, text:'Fazer exercícios práticos',  area:'estudos', done:false },
  { id:3, text:'Ler 30 min de livro técnico', area:'estudos', done:false },
  { id:4, text:'Responder e-mails pendentes', area:'trabalho', done:false },
];
let hours = { trabalho:4, familia:2, saude:1, estudos:3, lazer:1, financas:0 };
let currentView = 'hoje';

function area(id) { return AREAS.find(a => a.id === id); }

function setView(v) {
  currentView = v;
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + v).classList.add('active');
  document.getElementById('nav-' + v).classList.add('active');
  const titles = { hoje:'Hoje', cronograma:'Cronograma', alocacao:'Alocação de Tempo' };
  const subs = { hoje:'Suas tarefas e progresso do dia', cronograma:'Distribuição sugerida do seu dia', alocacao:'Quanto tempo dedica a cada área' };
  document.getElementById('page-title').textContent = titles[v];
  document.getElementById('page-subtitle').textContent = subs[v];
}

function renderSidebarAreas() {
  const el = document.getElementById('area-chips');
  el.innerHTML = AREAS.map(a => {
    const on = activeAreas.has(a.id);
    const tasksDone = tasks.filter(t => t.area === a.id && t.done).length;
    const tasksTotal = tasks.filter(t => t.area === a.id).length;
    const pct = tasksTotal ? Math.round(tasksDone / tasksTotal * 100) : 0;
    return `<button class="area-chip ${on ? 'on' : ''}" onclick="toggleArea('${a.id}')" style="${on ? 'background:'+a.bg+'; border-color:'+a.color+';' : ''}">
      <span class="area-dot" style="background:${a.color};"></span>
      <span style="flex:1; color:${on ? a.dark : ''}">${a.label}</span>
      <span style="font-size:11px; color:${on ? a.dark : 'var(--text3)'}; opacity:0.7;">${tasksTotal ? pct+'%' : ''}</span>
    </button>`;
  }).join('');
}

function toggleArea(id) {
  if (activeAreas.has(id)) activeAreas.delete(id);
  else activeAreas.add(id);
  render();
}

function renderMetrics() {
  const visible = tasks.filter(t => activeAreas.has(t.area));
  const done = visible.filter(t => t.done).length;
  const total = visible.length;
  const pct = total ? Math.round(done / total * 100) : 0;
  const totalH = Object.entries(hours).filter(([k]) => activeAreas.has(k)).reduce((s,[,v]) => s+v, 0);
  document.getElementById('metrics').innerHTML = `
    <div class="metric-card">
      <div class="metric-val">${done}/${total}</div>
      <div class="metric-lbl">Tarefas concluídas</div>
      <div class="metric-bar"><div class="metric-bar-fill" style="width:${total ? pct : 0}%;"></div></div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${pct}%</div>
      <div class="metric-lbl">Progresso do dia</div>
      <div class="metric-bar"><div class="metric-bar-fill" style="width:${pct}%; background: #1D9E75;"></div></div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${totalH}h</div>
      <div class="metric-lbl">Horas planejadas</div>
      <div class="metric-bar"><div class="metric-bar-fill" style="width:${Math.min(100, totalH/16*100)}%; background: #BA7517;"></div></div>
    </div>
  `;
}

function renderTasks() {
  const visible = tasks.filter(t => activeAreas.has(t.area));
  const container = document.getElementById('tasks-container');
  if (visible.length === 0) {
    container.innerHTML = `<div style="padding:18px 16px; font-size:14px; color:var(--text3);">Nenhuma tarefa nas áreas ativas.</div>`;
    return;
  }
  container.innerHTML = visible.map(t => {
    const a = area(t.area);
    return `<div class="task-row" id="task-${t.id}">
      <button class="check ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})" aria-label="Marcar como ${t.done ? 'pendente' : 'concluída'}">
        <i class="ti ti-check"></i>
      </button>
      <span class="task-text ${t.done ? 'done' : ''}">${t.text}</span>
      <span class="area-tag" style="background:${a.bg}; color:${a.dark};">${a.label}</span>
      <button class="task-delete" onclick="deleteTask(${t.id})" aria-label="Remover tarefa"><i class="ti ti-x"></i></button>
    </div>`;
  }).join('');

  // Populate area select
  const sel = document.getElementById('new-task-area');
  sel.innerHTML = AREAS.filter(a => activeAreas.has(a.id)).map(a => `<option value="${a.id}">${a.label}</option>`).join('');
}

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function addTask() {
  const text = document.getElementById('new-task-input').value.trim();
  const a = document.getElementById('new-task-area').value;
  if (!text || !a) return;
  tasks.push({ id: Date.now(), text, area: a, done: false });
  document.getElementById('new-task-input').value = '';
  render();
}

function renderSchedule() {
  const el = document.getElementById('schedule');
  el.innerHTML = SCHEDULE.map(s => {
    const a = s.area ? area(s.area) : null;
    const bg = a ? a.bg : 'var(--surface)';
    const titleColor = a ? a.dark : 'var(--text)';
    const border = a ? a.color : 'var(--border)';
    const pills = s.tasks.map(t => `<span class="sched-pill" style="background:${a ? a.pill : 'var(--surface2)'}; color:${a ? a.dark : 'var(--text2)'};">${t}</span>`).join('');
    return `<div class="sched-block">
      <div class="sched-time">${s.time}</div>
      <div class="sched-body" style="background:${bg}; border-left:3px solid ${border};">
        <div class="sched-title" style="color:${titleColor};">${s.title} <span class="sched-dur">${s.dur}</span></div>
        <div class="sched-desc" style="color:${a ? a.color : 'var(--text2)'};">${s.desc}</div>
        ${pills ? `<div class="sched-pills">${pills}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderAlloc() {
  const active = AREAS.filter(a => activeAreas.has(a.id));
  document.getElementById('alloc-grid').innerHTML = active.map(a => {
    const h = hours[a.id] || 0;
    const pct = Math.min(100, Math.round(h / 16 * 100));
    return `<div class="alloc-row">
      <div class="alloc-top">
        <span class="alloc-name">${a.label}</span>
        <span class="alloc-num">${h}h / dia</span>
      </div>
      <div class="alloc-bar"><div class="alloc-fill" id="alloc-fill-${a.id}" style="width:${pct}%; background:${a.color};"></div></div>
      <input type="range" class="alloc-slider" min="0" max="12" step="1" value="${h}"
        oninput="updateHours('${a.id}', this.value)"
        style="accent-color:${a.color};" />
    </div>`;
  }).join('');
}

function updateHours(id, val) {
  hours[id] = parseInt(val);
  const pct = Math.min(100, Math.round(parseInt(val) / 16 * 100));
  const fill = document.getElementById('alloc-fill-' + id);
  const row = fill.closest('.alloc-row');
  row.querySelector('.alloc-num').textContent = val + 'h / dia';
  fill.style.width = pct + '%';
  renderMetrics();
}

function updateClock() {
  const now = new Date();
  document.getElementById('live-time').textContent =
    String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
}

function render() {
  renderSidebarAreas();
  renderMetrics();
  renderTasks();
  renderSchedule();
  renderAlloc();
}

// Date subtitle
const days = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const now = new Date();
document.getElementById('page-subtitle').textContent =
  `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;

updateClock();
setInterval(updateClock, 15000);
render();