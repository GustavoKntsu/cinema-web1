// filmes.js — Cadastro de Filmes

let idEdicao = null; 

function getFilmes() {
  return JSON.parse(localStorage.getItem('filmes') || '[]');
}

function saveFilmes(filmes) {
  try {
    localStorage.setItem('filmes', JSON.stringify(filmes));
  } catch (e) {
    if (e.name === 'QuotaExceededError') alert('Limite de armazenamento atingido!');
  }
}

function editarFilme(id) {
  const filmes = getFilmes();
  const filme = filmes.find(f => f.id === id); 

  if (filme) {
    document.getElementById('titulo').value = filme.titulo;
    document.getElementById('genero').value = filme.genero;
    document.getElementById('classificacao').value = filme.classificacao;
    document.getElementById('duracao').value = filme.duracao;
    document.getElementById('estreia').value = filme.estreia;
    document.getElementById('descricao').value = filme.descricao;

    idEdicao = id;
    document.querySelector('.btn-salvar').textContent = "Atualizar Filme";
  }
}

function salvarFilme() {
  const titulo        = document.getElementById('titulo').value.trim();
  const genero        = document.getElementById('genero').value;
  const classificacao = document.getElementById('classificacao').value;
  const duracao       = document.getElementById('duracao').value;
  const estreia       = document.getElementById('estreia').value;
  const descricao     = document.getElementById('descricao').value.trim();

  if (!titulo || !genero || !classificacao || !duracao || !estreia) {
    mostrarAlerta('erro');
    return;
  }

  const filmes = getFilmes();

  if (idEdicao) {
    const index = filmes.findIndex(f => f.id === idEdicao);
    if (index !== -1) {
      filmes[index] = { ...filmes[index], titulo, genero, classificacao, duracao, estreia, descricao };
    }
    idEdicao = null;
    document.querySelector('.btn-salvar').textContent = "Salvar Filme";
  } else {
    const filme = { id: Date.now(), titulo, genero, classificacao, duracao, estreia, descricao };
    filmes.push(filme);
  }

  saveFilmes(filmes);

  mostrarAlerta('sucesso');
  limparForm();
  renderLista();
}

function excluirFilme(id) {
  if (!confirm('Excluir este filme?')) return;
  saveFilmes(getFilmes().filter(f => f.id !== id));
  renderLista();
}

function limparForm() {
  ['titulo', 'genero', 'classificacao', 'duracao', 'estreia', 'descricao'].forEach(id => {
    const el = document.getElementById(id);
    el.tagName === 'SELECT' ? el.selectedIndex = 0 : el.value = '';
  });
  
  idEdicao = null;
  document.querySelector('.btn-salvar').textContent = "Salvar Filme";
}

function mostrarAlerta(tipo) {
  const el = document.getElementById(tipo === 'sucesso' ? 'alertSucesso' : 'alertErro');
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

function formatDate(d) {
  if (!d) return '';
  const [y, m, dia] = d.split('-');
  return `${dia}/${m}/${y}`;
}

function renderLista() {
  const filmes = getFilmes();
  const el = document.getElementById('listaFilmes');

  if (!filmes.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🎬</div><p>Nenhum filme cadastrado.</p></div>';
    return;
  }

  // Os botões ✏️ e 🗑️ perfeitamente alinhados
  el.innerHTML = filmes.map(f => `
    <div class="film-item">
      <div>
        <div class="film-name">${f.titulo}</div>
        <div class="film-meta">${f.genero} · ${f.duracao}min · ${formatDate(f.estreia)}</div>
      </div>
      <div class="d-flex align-items-center gap-2 flex-shrink-0">
        <span class="film-badge">${f.classificacao}</span>
        <button class="btn-edit" onclick="editarFilme(${f.id})" title="Editar" style="background:transparent; border:none; font-size:1.2rem; cursor:pointer;">✏️</button>
        <button class="btn-del" onclick="excluirFilme(${f.id})" title="Excluir" style="background:transparent; border:none; font-size:1.2rem; cursor:pointer;">🗑️</button>
      </div>
    </div>
  `).join('');
}

// Inicializa
renderLista();