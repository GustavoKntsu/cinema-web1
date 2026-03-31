// sessoes-cadastro.js — Cadastro de Sessões

const getFilmes  = () => JSON.parse(localStorage.getItem('filmes')  || '[]');
const getSalas   = () => JSON.parse(localStorage.getItem('salas')   || '[]');
const getSessoes = () => JSON.parse(localStorage.getItem('sessoes') || '[]');

function saveSessoes(sessoes) {
  try {
    localStorage.setItem('sessoes', JSON.stringify(sessoes));
  } catch (e) {
    if (e.name === 'QuotaExceededError') alert('Limite de armazenamento atingido!');
  }
}

function carregarSelects() {
  const filmes = getFilmes();
  const salas  = getSalas();
  const selFilme = document.getElementById('filmeId');
  const selSala  = document.getElementById('salaId');

  document.getElementById('warnFilmes').style.display = filmes.length ? 'none' : 'block';
  document.getElementById('warnSalas').style.display  = salas.length  ? 'none' : 'block';

  selFilme.innerHTML = '<option value="">Selecione um filme...</option>' +
    filmes.map(f => `<option value="${f.id}">${f.titulo}</option>`).join('');

  selSala.innerHTML = '<option value="">Selecione uma sala...</option>' +
    salas.map(s => `<option value="${s.id}">${s.nome} (${s.tipo})</option>`).join('');
}

function salvarSessao() {
  const filmeId  = document.getElementById('filmeId').value;
  const salaId   = document.getElementById('salaId').value;
  const dataHora = document.getElementById('dataHora').value;
  const preco    = document.getElementById('preco').value;
  const idioma   = document.getElementById('idioma').value;
  const formato  = document.getElementById('formato').value;

  if (!filmeId || !salaId || !dataHora || !preco || !idioma || !formato) {
    mostrarAlerta('erro');
    return;
  }

  const filme = getFilmes().find(f => f.id == filmeId);
  const sala  = getSalas().find(s => s.id == salaId);

  const sessao = {
    id: Date.now(),
    filmeId:   parseInt(filmeId),
    salaId:    parseInt(salaId),
    filmeNome: filme ? filme.titulo : '—',
    salaNome:  sala  ? sala.nome    : '—',
    dataHora,
    preco: parseFloat(preco),
    idioma,
    formato
  };

  const sessoes = getSessoes();
  sessoes.push(sessao);
  saveSessoes(sessoes);

  mostrarAlerta('sucesso');
  limparForm();
  renderLista();
}

function excluirSessao(id) {
  if (!confirm('Excluir esta sessão?')) return;
  saveSessoes(getSessoes().filter(s => s.id !== id));
  renderLista();
}

function limparForm() {
  ['filmeId', 'salaId', 'idioma', 'formato'].forEach(id =>
    document.getElementById(id).selectedIndex = 0
  );
  ['dataHora', 'preco'].forEach(id =>
    document.getElementById(id).value = ''
  );
}

function mostrarAlerta(tipo) {
  const el = document.getElementById(tipo === 'sucesso' ? 'alertSucesso' : 'alertErro');
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

function formatDT(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function renderLista() {
  const sessoes = getSessoes();
  const el = document.getElementById('listaSessoes');

  if (!sessoes.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>Nenhuma sessão cadastrada.</p></div>';
    return;
  }

  el.innerHTML = sessoes.map(s => `
    <div class="sessao-item">
      <button class="btn-del" onclick="excluirSessao(${s.id})" title="Excluir">✕</button>
      <div class="sessao-filme">${s.filmeNome}</div>
      <div class="sessao-meta">🏟 ${s.salaNome} · 🕐 ${formatDT(s.dataHora)}</div>
      <div class="sessao-meta">${s.idioma} · ${s.formato}</div>
      <div class="sessao-price">R$ ${parseFloat(s.preco).toFixed(2)}</div>
    </div>
  `).join('');
}

// Inicializa
carregarSelects();
renderLista();