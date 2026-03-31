// programacao.js — Listagem de Sessões Disponíveis

const getSessoes = () => JSON.parse(localStorage.getItem('sessoes') || '[]');
const getFilmes = () => JSON.parse(localStorage.getItem('filmes') || '[]');

function formatDT(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function carregarFiltros() {
  const filmes = getFilmes();
  const sel = document.getElementById('filtroFilme');

  sel.innerHTML = '<option value="">Todos os filmes</option>' +
    filmes.map(f => `<option value="${f.id}">${f.titulo}</option>`).join('');
}

function renderSessoes() {
  let sessoes = getSessoes();

  const filtroFilme = document.getElementById('filtroFilme').value;
  const filtroIdioma = document.getElementById('filtroIdioma').value;
  const filtroFormato = document.getElementById('filtroFormato').value;

  if (filtroFilme) sessoes = sessoes.filter(s => s.filmeId == filtroFilme);
  if (filtroIdioma) sessoes = sessoes.filter(s => s.idioma === filtroIdioma);
  if (filtroFormato) sessoes = sessoes.filter(s => s.formato === filtroFormato);

  const grid = document.getElementById('gridSessoes');
  const count = sessoes.length;
  document.getElementById('countSessoes').textContent =
    `${count} sessão${count !== 1 ? 'ões' : ''}`;

  if (!sessoes.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-wrap">
          <div class="empty-icon-big">🎬</div>
          <div class="empty-title">Nenhuma sessão encontrada</div>
          <p class="empty-sub">Cadastre sessões para vê-las aqui.</p>
          <a href="cadastro-sessoes.html" class="btn-outline-gold">Cadastrar Sessão</a>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = sessoes.map((s, i) => `
<div class="col-md-6 col-lg-4 mb-4">
    <div class="card bg-dark border-secondary h-100 shadow-sm">
        
        <div style="height: 4px; background: linear-gradient(90deg, #f5c842, #e63946);"></div>

        <div class="card-body d-flex flex-column">
            <h4 class="text-warning mb-3" style="font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px;">
                ${s.filmeNome || s.filme}
            </h4>

            <p class="text-light mb-1 small">🏟️ <strong>Sala:</strong> ${s.salaNome || s.sala}</p>
            <p class="text-light mb-3 small">⏱️ <strong>Horário:</strong> ${formatDT(s.dataHora)}</p>

            <div class="d-flex gap-2 mt-auto">
                <span class="badge border border-secondary text-light px-2 py-1">${s.idioma}</span>
                <span class="badge border border-secondary text-light px-2 py-1">${s.formato}</span>
            </div>
        </div>

        <div class="card-footer bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
            <div>
                <small class="text-muted d-block text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">Ingresso</small>
                <span class="text-warning fw-bold fs-5">R$ ${parseFloat(s.preco).toFixed(2)}</span>
            </div>
            
            <a href="venda-ingressos.html?sessao=${s.id}" class="btn btn-warning btn-sm fw-bold px-3 py-2 text-dark" style="letter-spacing: 1px;">
                COMPRAR
            </a>
        </div>
    </div>
</div>
`).join('');
}

// Inicializa
carregarFiltros();
renderSessoes();