// salas.js — Cadastro de Salas

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

function salvarSala() {
  const nome       = document.getElementById('nome').value.trim();
  const capacidade = document.getElementById('capacidade').value;
  const tipo       = document.getElementById('tipo').value;

  if (!nome || !capacidade || !tipo) {
    mostrarAlerta('erro');
    return;
  }

  const sala = { id: Date.now(), nome, capacidade: parseInt(capacidade), tipo };
  const salas = getSalas();
  salas.push(sala);
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
}

function mostrarAlerta(tipo) {
  const el = document.getElementById(tipo === 'sucesso' ? 'alertSucesso' : 'alertErro');
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

function tipoClass(t) {
  if (t === '2D')   return 'tipo-2d';
  if (t === '3D')   return 'tipo-3d';
  return 'tipo-imax';
}

function renderLista() {
  const salas = getSalas();
  const el = document.getElementById('listaSalas');

  if (!salas.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🏟️</div><p>Nenhuma sala cadastrada.</p></div>';
    return;
  }

  el.innerHTML = `
    <div class="sala-grid">
      ${salas.map(s => `
        <div class="sala-box">
          <button class="btn-del" onclick="excluirSala(${s.id})" title="Excluir">✕</button>
          <div class="sala-tipo ${tipoClass(s.tipo)}">${s.tipo}</div>
          <div class="sala-nome">${s.nome}</div>
          <div class="sala-cap">👥 ${s.capacidade} lugares</div>
        </div>
      `).join('')}
    </div>`;
}

// Inicializa
renderLista();