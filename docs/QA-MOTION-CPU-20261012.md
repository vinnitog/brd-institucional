# Ensaio de movimento sob CPU reduzida — 12/10/2026

Edge headless 155.0.4283.45, Playwright 1.62.1, viewport 1280×900. Build
isolado com envFile:false e URLs de contato fictícias. Context novo por
amostra, somente GET/HEAD na origem loopback; nenhum POST foi permitido.
Janela coordenada com os outros projetos para evitar benchmarks concorrentes.

Warmup normal foi excluído; três amostras por preferência de movimento.
Emulation.setCPUThrottlingRate rate 4 atua no renderer do laboratório, não
simula nem homologa aparelho físico, rede, GPU ou SLA.

## Janela observada

Após carregar a página e fontes, aguarda 800 ms fora da medição. Observa
scroll instantâneo em cinco regiões e abertura/fechamento do diálogo, com
650 ms por passo. O gráfico é centralizado e sua fração vertical visível
precisa exceder 45% (obtido 100%); texto final com opacidade 1 e diálogo
fechado em todas as amostras. O primeiro protótipo por anchors não garantia
que o gráfico entrasse no viewport, falhou e foi descartado; a prova funcional
de scroll direto confirmou legibilidade sem mudança no aplicativo.

| Preferência | Amostra | Janela ms | Long tasks | Soma ms | Máxima ms | Gaps rAF >50 ms | p95 intervalo rAF ms |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Normal | 0 | 4639 | 2 | 272 | 214 | 3 | 16,7 |
| Normal | 1 | 4619 | 1 | 199 | 199 | 3 | 16,7 |
| Normal | 2 | 4644 | 2 | 291 | 232 | 2 | 22,3 |
| Reduced | 0 | 4590 | 2 | 290 | 236 | 1 | 5,7 |
| Reduced | 1 | 4588 | 1 | 201 | 201 | 1 | 5,7 |
| Reduced | 2 | 4583 | 1 | 200 | 200 | 1 | 5,7 |

## Decisão e limites

Preservar Motion, seus imports síncronos e a apresentação atual. Tarefas
longas de magnitude semelhante aparecem com reduced motion: essa janela
agrega layout, scroll, DOM, imagens e outras tarefas, sem isolamento causal
ou tracing suficiente para atribuí-las ao efeito. Não se inventou split,
redução visual ou orçamento gzip para produzir um ganho sem evidência.

Intervalos requestAnimationFrame em headless não são FPS exibidos em um
monitor. Soma de long tasks não é CPU total ou memória; viewport desktop
não homologa mobile; caches/decodificação e carga residual do host podem
variar. Não há LCP/INP de produção, energia, pico de memória ou comparação
antes/depois de uma otimização de Motion, pois ela não foi implementada.

```powershell
# Execute sem outros benchmarks ou builds concorrentes:
$env:QA_BROWSER_CHANNEL='msedge'
node scripts/qa-motion.mjs
```

Evidência local ignorada .tmp/qa-motion-20261012.json e respectivo log.
O benchmark não roda no CI: métricas de tempo são diagnósticas, não gates
numéricos em runner compartilhado. Futuro ajuste de movimento exige perfil
causal estável, regressão de legibilidade/keyboard e comparação no mesmo
hardware/fixture, sem inferir condições reais deste ensaio sintético.
