// index.js — Página Inicial
// Lê o localStorage e atualiza os quatro contadores numéricos da página inicial

document.getElementById('statFilmes').textContent =
  (JSON.parse(localStorage.getItem('filmes') || '[]')).length;

document.getElementById('statSalas').textContent =
  (JSON.parse(localStorage.getItem('salas') || '[]')).length;

document.getElementById('statSessoes').textContent =
  (JSON.parse(localStorage.getItem('sessoes') || '[]')).length;

document.getElementById('statIngressos').textContent =
  (JSON.parse(localStorage.getItem('ingressos') || '[]')).length;