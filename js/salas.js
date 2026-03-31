// salas.js — Cadastro de Salas

let idEdicao = null; 

function getSalas() {
  return JSON.parse(localStorage.getItem('salas') || '[]');
}

function saveSalas(salas) {
  try {
    localStorage.setItem('salas', JSON.stringify(salas));
  } catch (e) {
    if (e.name === 'QuotaExceededError') alert('Limite de armazenamento atingido!');
  }
}

function editarSala(id) {
  const salas = getSalas();
  const sala = salas.find(s => s.id === id);

  if (sala) {
    document.getElementById('nome').value = sala.nome;
    document.getElementById('capacidade').value = sala.capacidade;
    document.getElementById('tipo').value = sala.tipo;

    idEdicao = id;
    document.querySelector('.btn-salvar').textContent = "Atualizar Sala";
  }
}

function salvarSala() {
  const nome       = document.getElementById('nome').value.trim();
  const capacidade = document.getElementById('capacidade').value;
  const tipo       = document.getElementById('tipo').value;

  if (!nome || !capacidade || !tipo) {
    mostrarAlerta('erro');
    return;
  }

  const salas = getSalas();

  if (idEdicao) {
    const index = salas.findIndex(s => s.id === idEdicao);
    if (index !== -1) {
      salas[index] = { ...salas[index], nome, capacidade: parseInt(capacidade), tipo };
    }
    idEdicao = null;
    document.querySelector('.btn-salvar').textContent = "Salvar Sala";
  } else {
    salas.push({ id: Date.now(), nome, capacidade: parseInt(capacidade), tipo });
  }

  saveSalas(salas);
  mostrarAlerta('sucesso');
  limparForm();
  renderLista();
}

function excluirSala(id) {
  if (!confirm('Excluir esta sala?')) return;
  saveSalas(getSalas().filter(s => s.id !== id));
  renderLista();
}

function limparForm() {
  ['nome', 'capacidade', 'tipo'].forEach(id => {
    const el = document.getElementById(id);
    el.tagName === 'SELECT' ? el.selectedIndex = 0 : el.value = '';
  });
  idEdicao = null;
  document.querySelector('.btn-salvar').textContent = "Salvar Sala";
}

function mostrarAlerta(tipo) {
  const el = document.getElementById(tipo === 'sucesso' ? 'alertSucesso' : 'alertErro');
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

function renderLista() {
  const salas = getSalas();
  const el = document.getElementById('listaSalas');

  if (!salas.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🏟️</div><p>Nenhuma sala cadastrada.</p></div>';
    return;
  }

  // Aqui já estão os botões ✏️ e 🗑️ perfeitamente alinhados
  el.innerHTML = salas.map(s => `
    <div class="film-item">
      <div>
        <div class="film-name">${s.nome}</div>
        <div class="film-meta">Capacidade: ${s.capacidade} lugares</div>
      </div>
      <div class="d-flex align-items-center gap-2 flex-shrink-0">
        <span class="badge border border-secondary text-light">${s.tipo}</span>
        <button class="btn-edit" onclick="editarSala(${s.id})" title="Editar" style="background:transparent; border:none; font-size:1.2rem; cursor:pointer;">✏️</button>
        <button class="btn-del" onclick="excluirSala(${s.id})" title="Excluir" style="background:transparent; border:none; font-size:1.2rem; cursor:pointer;">🗑️</button>
      </div>
    </div>
  `).join('');
}

// Inicializa
renderLista();