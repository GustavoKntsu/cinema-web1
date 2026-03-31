// venda-ingressos.js — Venda de Ingressos

let idEdicao = null;

const getSessoes   = () => JSON.parse(localStorage.getItem('sessoes')   || '[]');
const getIngressos = () => JSON.parse(localStorage.getItem('ingressos') || '[]');

function saveIngressos(ingressos) {
  try {
    localStorage.setItem('ingressos', JSON.stringify(ingressos));
  } catch (e) {
    if (e.name === 'QuotaExceededError') alert('Limite de armazenamento atingido!');
  }
}

function formatDT(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function mascaraCPF(el) {
  let v = el.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/,       '$1.$2');
  v = v.replace(/(\d{3})(\d)/,       '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  el.value = v;
}

function carregarSelects() {
  const sessoes = getSessoes();
  const sel = document.getElementById('sessaoId');

  document.getElementById('warnSessoes').style.display = sessoes.length ? 'none' : 'block';

  sel.innerHTML = '<option value="">Selecione uma sessão...</option>' +
    sessoes.map(s => `<option value="${s.id}">${s.filmeNome} — ${formatDT(s.dataHora)}</option>`).join('');

  const urlParams = new URLSearchParams(window.location.search);
  const sessaoUrl = urlParams.get('sessao');
  if (sessaoUrl) {
    sel.value = sessaoUrl;
    previewSessao();
  }
}

function previewSessao() {
  const sel = document.getElementById('sessaoId');
  const previewBox = document.getElementById('sessaoPreview');

  if (!sel.value) {
    previewBox.style.display = 'none';
    return;
  }

  const sessoes = getSessoes();
  const sessao = sessoes.find(s => s.id == sel.value);

  if (sessao) {
    document.getElementById('pvFilme').textContent = sessao.filmeNome;
    document.getElementById('pvInfo').textContent = `🏟️ ${sessao.salaNome} — ⏱️ ${formatDT(sessao.dataHora)} — 🗣️ ${sessao.idioma} ${sessao.formato}`;
    document.getElementById('pvPreco').textContent = `R$ ${parseFloat(sessao.preco).toFixed(2)}`;
    previewBox.style.display = 'block';
  }
}

function editarIngresso(id) {
  const ingressos = getIngressos();
  const ingresso = ingressos.find(i => i.id === id);

  if (ingresso) {
    document.getElementById('sessaoId').value = ingresso.sessaoId;
    previewSessao(); 
    
    document.getElementById('nomeCliente').value = ingresso.nomeCliente;
    document.getElementById('cpf').value = ingresso.cpf;
    document.getElementById('assento').value = ingresso.assento;
    document.getElementById('pagamento').value = ingresso.pagamento;

    idEdicao = id;
    document.querySelector('.btn-salvar').textContent = "Atualizar Venda";
  }
}

function confirmarVenda() {
  const sessaoId    = document.getElementById('sessaoId').value;
  const nomeCliente = document.getElementById('nomeCliente').value.trim();
  const cpf         = document.getElementById('cpf').value.trim();
  const assento     = document.getElementById('assento').value.trim();
  const pagamento   = document.getElementById('pagamento').value;

  if (!sessaoId || !nomeCliente || !cpf || !assento || !pagamento) {
    mostrarAlerta('erro');
    return;
  }

  const sessao = getSessoes().find(s => s.id == sessaoId);
  const ingressos = getIngressos();

  if (idEdicao) {
    const index = ingressos.findIndex(i => i.id === idEdicao);
    if (index !== -1) {
      ingressos[index] = { 
        ...ingressos[index], 
        sessaoId, 
        filme: sessao.filmeNome, 
        sala: sessao.salaNome, 
        dataHora: formatDT(sessao.dataHora), 
        preco: sessao.preco, 
        nomeCliente, cpf, assento, pagamento 
      };
    }
    idEdicao = null;
    document.querySelector('.btn-salvar').textContent = "Confirmar Venda";
  } else {
    const ingresso = {
      id: Date.now(),
      sessaoId,
      filme: sessao.filmeNome,
      sala: sessao.salaNome,
      dataHora: formatDT(sessao.dataHora),
      preco: sessao.preco,
      nomeCliente, cpf, assento, pagamento
    };
    ingressos.push(ingresso);
  }

  saveIngressos(ingressos);

  mostrarAlerta('sucesso');
  limparForm();
  renderLista();
}

function excluirIngresso(id) {
  if (!confirm('Cancelar este ingresso?')) return;
  saveIngressos(getIngressos().filter(i => i.id !== id));
  renderLista();
}

function limparForm() {
  document.getElementById('sessaoId').selectedIndex = 0;
  document.getElementById('sessaoPreview').style.display = 'none';
  document.getElementById('pagamento').selectedIndex = 0;
  ['nomeCliente', 'cpf', 'assento'].forEach(id =>
    document.getElementById(id).value = ''
  );

  idEdicao = null;
  document.querySelector('.btn-salvar').textContent = "Confirmar Venda";
}

function mostrarAlerta(tipo) {
  const el = document.getElementById(tipo === 'sucesso' ? 'alertSucesso' : 'alertErro');
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

function renderLista() {
  const ingressos = getIngressos();
  const el = document.getElementById('listaIngressos');

  if (!ingressos.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🎟️</div><p>Nenhum ingresso vendido.</p></div>';
    return;
  }

  // Reverse para ver os mais recentes em cima, com os botões corrigidos
  el.innerHTML = [...ingressos].reverse().map((ing, idx) => `
    <div class="ticket-item">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="ticket-id">#${String(ingressos.length - idx).padStart(4, '0')}</div>
        <div class="d-flex gap-1">
          <button class="btn-edit" onclick="editarIngresso(${ing.id})" title="Editar" style="background:transparent; border:none; font-size:1.1rem; cursor:pointer;">✏️</button>
          <button class="btn-del" onclick="excluirIngresso(${ing.id})" title="Cancelar" style="background:transparent; border:none; font-size:1.1rem; cursor:pointer;">🗑️</button>
        </div>
      </div>
      <div class="ticket-cliente">👤 ${ing.nomeCliente}</div>
      <div class="ticket-sessao">🎬 ${ing.filme} — 🏟️ ${ing.sala} — ⏱️ ${ing.dataHora}</div>
      <div class="ticket-row mt-2">
        <span class="ticket-badge badge-assento">💺 ${ing.assento}</span>
        <span class="ticket-badge badge-pagamento">💳 ${ing.pagamento}</span>
        <span class="ticket-badge badge-preco">💰 R$ ${parseFloat(ing.preco).toFixed(2)}</span>
      </div>
    </div>
  `).join('');
}

// Inicializa
carregarSelects();
renderLista();