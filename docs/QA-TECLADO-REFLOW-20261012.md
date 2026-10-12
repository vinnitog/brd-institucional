# Teclado, reflow e contato fictício — 12/10/2026

Base 60112a234315c932d3bb1040f1c29ac6976c8bf0, checkout isolado.
Playwright 1.62.1 exato, Node 24.12.0, Edge headless 155.0.4283.45 e
Chromium headless 151.0.7922.34. Ambos passaram os onze casos; são duas
versões de Chromium/Blink, não homologação Firefox/Safari.

## Defeito reproduzido e correção

Com root font-size 32 px (aproximação de ampliação de texto 2×), viewport
1280×900 e fontes locais carregadas, o link LinkedIn ultrapassava a largura
útil do documento: scrollWidth 1298 para clientWidth 1280, extremidade direita
1298,31 px. O rótulo flex tinha largura mínima implícita e não quebrava a palavra.

A única mudança de produto foi min-width:0 e overflow-wrap:anywhere no span
de texto dos links sociais. Ícones aria-hidden, fonte, cor, destinatários,
conteúdo e links permanecem iguais. O rótulo conserva o texto integral e pode
quebrar quando necessário. A mesma regressão passou sem scroll horizontal;
apresentação normal desktop/mobile foi conferida em captura com animações
concluídas. Logs RED/GREEN: .tmp/qa-textscale-diagnostic.log e
.tmp/qa-textscale-after.log. Não houve redesenho ou redução de movimento.

## Casos automatizados

`scripts/qa-browser.mjs` executa onze casos em contexts independentes, com
reducedMotion reduce antes da abertura, exceto a prova de gráfico normal.

| Caso | Resultado |
| --- | --- |
| Desktop 1280×900 | Tab inicia pelo skip link; Enter foca main; diálogo inicia no fechamento; inert impede foco programático no fundo; Escape devolve foco ao toggle. |
| Menu mobile 390×844 | Enter abre; Tab alcança Sobre; ativação fecha menu e foca h2; Escape fecha primeiro diálogo e depois menu. O harness aguarda visibilidade e RAF de foco. |
| Reflow 320×568, 390×390, 640×450 | Sem overflow horizontal. Tab percorre o painel; Shift+Tab do fechamento volta ao submit, Tab retorna ao fechamento. Foco permanece dentro do diálogo e ao menos 32 px verticais do controle ficam visíveis (ou altura total se menor). |
| Texto raiz 2× e reduced motion | Sem overflow; gráfico legível e preenchimento sem transform. Viewport 640 simula espaço disponível menor; isso não equivale a zoom nativo. |
| Normal motion | Após scroll direto no gráfico, texto chega à opacidade final. Não há alegação de auditoria visual de todos os estados. |
| Contato inválido | Validação nativa foca Nome e não produz POST. |
| Sucesso fictício | Duplo requestSubmit gera um POST interceptado, feedback e limpeza dos campos. |
| HTTP 503 fictício | Um POST, recebimento incerto e campos preservados, sem popup/fallback Gmail. |
| Transporte pendente | Após 12 s retorna recebimento incerto, preserva campos; fechar/reabrir durante a tentativa não permite segundo POST. |

A primeira fixture era excessivamente restritiva ao exigir textarea inteiro
visível: em 320×568, 80 dos 120 px já eram visíveis e a linha de entrada estava
acessível. O critério foi corrigido para foco não totalmente obscurecido; não
se alterou o painel por esse resultado. O harness também aguarda commit/paint
de menu/foco em vez de inferir erro de uma leitura imediata antes do RAF.

## Isolamento e gates

Build e preview usam configFile:false/envFile:false e URLs example.test
explicitamente fictícias. Somente GET/HEAD na origem loopback são permitidos;
POST no endpoint fictício é interceptado, todas as outras requisições externas
são abortadas. Popup é substituído por contador. Nenhum Formspree/Gmail/e-mail,
conta, banco ou documento real foi acessado. Campos são dados sintéticos.

51/51 Node/DOM, onze casos browser em cada versão e builds normal/Pages aprovados; actionlint
do quality.yml e diffcheck limpos. Playwright está somente em devDependencies
(dois pacotes, audit zero); CI instala Chromium e executa as mesmas fixtures,
sem secrets/deploy. A execução remota e Chromium Linux ainda dependem da
publicação: resultados locais acima são Windows headless.

```powershell
npm.cmd ci
npm.cmd test
npx.cmd playwright install chromium
npm.cmd run test:browser
# Edge instalado também é suportado localmente:
$env:QA_BROWSER_CHANNEL='msedge'
npm.cmd run test:browser
# Caso específico, nunca substitui a suíte integral de homologação:
$env:QA_CASE_FILTER='root text'
node scripts/qa-browser.mjs --filter
Remove-Item Env:QA_CASE_FILTER
```

QA_CASE_FILTER só é usado com --filter explícito e falha se não seleciona casos.
O comando npm test:browser/CI sempre roda a suíte integral. Relatório
.tmp/qa-browser-20261012.json explicita false para
nativeZoomValidated/screenReaderValidated/realContactDelivered. Capturas locais
ignoradas: qa-desktop, qa-mobile e qa-textscale-20261012.png. A compilação de
fixtures fica em .tmp/qa-browser-build e não substitui o dist de publicação.

## Limites externos

Não se declara conformidade WCAG integral, leitor de tela, zoom nativo,
teclado/dispositivo móvel físico, recebimento pelo operador real ou contraste
humano de todas as combinações. Reflow e fonte raiz ampliada são aproximações
com CSS pixels; não certificam escala do sistema operacional. Os dados de
contato não persistem em banco/cache. Revisão/QA delegada segue AGENTS;
marca, tipografia, fotos, Motion, pins e sites de produção preservados.
