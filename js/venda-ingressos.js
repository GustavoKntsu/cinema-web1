// venda.js — Venda de Ingressos

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
    sessoes.map(s =>
      `<option value="${s.id}">${s.filmeNome} — ${s.salaNome} — ${formatDT(s.dataHora)}</option>`
    ).join('');

  // Pré-seleciona sessão via parâmetro da URL
  const params = new URLSearchParams(window.location.search);
  const sessaoId = params.get('sessao');
  if (sessaoId) {
    sel.value = sessaoId;
    previewSessao();
  }
}

function previewSessao() {
  const id      = document.getElementById('sessaoId').value;
  const preview = document.getElementById('sessaoPreview');

  if (!id) { preview.style.display = 'none'; return; }

  const sessao = getSessoes().find(s => s.id == id);
  if (!sessao) return;

  document.getElementById('pvFilme').textContent = sessao.filmeNome;
  document.getElementById('pvInfo').textContent  =
    `${sessao.salaNome} · ${formatDT(sessao.dataHora)} · ${sessao.idioma} ${sessao.formato}`;
  document.getElementById('pvPreco').textContent =
    `R$ ${parseFloat(sessao.preco).toFixed(2)}`;

  preview.style.display = 'block';
}

function confirmarVenda() {
  const sessaoId    = document.getElementById('sessaoId').value;
  const nomeCliente = document.getElementById('nomeCliente').value.trim();
  const cpf         = document.getElementById('cpf').value.trim();
  const assento     = document.getElementById('assento').value.trim().toUpperCase();
  const pagamento   = document.getElementById('pagamento').value;

  if (!sessaoId || !nomeCliente || !cpf || !assento || !pagamento) {
    mostrarAlerta('erro');
    return;
  }

  const sessao = getSessoes().find(s => s.id == sessaoId);

  const ingresso = {
    id: Date.now(),
    sessaoId:   parseInt(sessaoId),
    sessaoInfo: sessao
      ? `${sessao.filmeNome} — ${sessao.salaNome} — ${formatDT(sessao.dataHora)}`
      : '—',
    preco: sessao ? sessao.preco : 0,
    nomeCliente,
    cpf,
    assento,
    pagamento
  };

  const ingressos = getIngressos();
  ingressos.push(ingresso);
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

  el.innerHTML = [...ingressos].reverse().map((ing, idx) => `
    <div class="ticket-item">
      <button class="btn-del" onclick="excluirIngresso(${ing.id})" title="Cancelar">✕</button>
      <div class="ticket-id">#${String(ingressos.length - idx).padStart(4, '0')}</div>
      <div class="ticket-cliente">${ing.nomeCliente}</div>
      <div class="ticket-sessao">${ing.sessaoInfo}</div>
      <div class="ticket-row">
        <span class="ticket-badge badge-assento">Assento ${ing.assento}</span>
        <span class="ticket-badge badge-pagamento">${ing.pagamento}</span>
        <span class="ticket-badge badge-preco">R$ ${parseFloat(ing.preco).toFixed(2)}</span>
      </div>
    </div>
  `).join('');
}

// Inicializa
carregarSelects();
renderLista();