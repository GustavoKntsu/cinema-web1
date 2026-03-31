// cadastro-sessoes.js — Cadastro de Sessões

let idEdicao = null;

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

function editarSessao(id) {
  const sessoes = getSessoes();
  const sessao = sessoes.find(s => s.id === id);

  if (sessao) {
    document.getElementById('filmeId').value = sessao.filmeId;
    document.getElementById('salaId').value = sessao.salaId;
    document.getElementById('dataHora').value = sessao.dataHora;
    document.getElementById('preco').value = sessao.preco;
    document.getElementById('idioma').value = sessao.idioma;
    document.getElementById('formato').value = sessao.formato;

    idEdicao = id;
    document.querySelector('.btn-salvar').textContent = "Atualizar Sessão";
  }
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

  const filmes = getFilmes();
  const salas  = getSalas();
  const filmeNome = filmes.find(f => f.id == filmeId)?.titulo || 'Filme Excluído';
  const salaNome  = salas.find(s => s.id == salaId)?.nome || 'Sala Excluída';

  const sessoes = getSessoes();

  if (idEdicao) {
    const index = sessoes.findIndex(s => s.id === idEdicao);
    if (index !== -1) {
      sessoes[index] = { ...sessoes[index], filmeId, filmeNome, salaId, salaNome, dataHora, preco, idioma, formato };
    }
    idEdicao = null;
    document.querySelector('.btn-salvar').textContent = "Salvar Sessão";
  } else {
    sessoes.push({ id: Date.now(), filmeId, filmeNome, salaId, salaNome, dataHora, preco, idioma, formato });
  }

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

  idEdicao = null;
  document.querySelector('.btn-salvar').textContent = "Salvar Sessão";
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

  // Aqui já estão os botões ✏️ e 🗑️ perfeitamente alinhados
  el.innerHTML = sessoes.map(s => `
    <div class="film-item">
      <div>
        <div class="film-name">${s.filmeNome}</div>
        <div class="film-meta">${s.salaNome} • ${formatDT(s.dataHora)}</div>
        <div class="film-meta mt-1">
          <span class="badge border border-secondary text-light">${s.idioma}</span>
          <span class="badge border border-secondary text-light">${s.formato}</span>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2 flex-shrink-0">
        <span class="text-warning fw-bold me-2">R$ ${parseFloat(s.preco).toFixed(2)}</span>
        <button class="btn-edit" onclick="editarSessao(${s.id})" title="Editar" style="background:transparent; border:none; font-size:1.2rem; cursor:pointer;">✏️</button>
        <button class="btn-del" onclick="excluirSessao(${s.id})" title="Excluir" style="background:transparent; border:none; font-size:1.2rem; cursor:pointer;">🗑️</button>
      </div>
    </div>
  `).join('');
}

// Inicializa
carregarSelects();
renderLista();