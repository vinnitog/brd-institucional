# Contato com espera limitada — 10/10/2026

## Escopo

Branch isolada `codex/institucional-contact-timeout-20261010`, base de revisão
`81dd6fa30d337420671c18671ea19008bcfd5892` (main). Develop
`cd095e9bc90d4c06756df2122e95c7bdf2199a25` é ancestral; seu conteúdo foi preservado.
O checkout original e suas quatro alterações locais da migração permanecem
intactos. Pin da biblioteca: `bd46a3d293aec0c85bdc5a1be6b1a2c6477438a7`.

O POST antes aguardava `fetch` sem deadline. Uma implementação de transporte que
nunca resolve mantinha a promessa e o formulário em envio indefinidamente.
O harness local `.tmp/contact-red.mjs`, usando a versão anterior do Git e fetch
fictício pendente, falhou ao exigir término após a janela simulada. Os testes
versionados novos exercitam o deadline e o formulário React real.

## Comportamento

- `CONTACT_TIMEOUT_MS` define 12.000 ms. `AbortController` sinaliza cancelamento
  e `Promise.race` encerra a espera mesmo quando o transporte ignora o sinal.
  O timer é limpo em `finally` em sucesso, erro e timeout.
- O retorno é `{ status: 'error', reason: 'timeout' }` no deadline. Resposta ou
  rejeição tardia não alteram esse resultado nem confirmam sucesso na UI. A
  comparação de prazo também rejeita sucesso observado após o deadline antes
  de o callback do timer ser executado.
- Uma ref bloqueia outra submissão antes de o React atualizar o botão; `finally`
  libera a guarda quando a tentativa termina. A guarda pertence ao componente,
  que permanece montado quando apenas o painel fecha. Fechar não aborta o POST.
- Timeout/rede preservam o rascunho e exibem alerta sobre recebimento incerto.
  Não se afirma que nada foi enviado nem se incentiva retry imediato. Antes de
  nova tentativa manual, a mensagem orienta confirmar recebimento com a equipe.
- Não há retry automático, fallback para outro transporte ou abertura do Gmail
  depois de falha quando o endpoint está ativo. Sem endpoint, o rascunho manual
  do Gmail e seu tratamento de popup continuam iguais.

Nome, e-mail, destinatário, payload, campos opcionais, limites e honeypot mantêm
os contratos anteriores. Não houve configuração de endpoint ou `.env`, mudança
de canal, envio real ou armazenamento adicional. Os documentos LGPD continuam
draft: operador, retenção, controlador e base legal aguardam revisão própria
antes de ativar coleta real. A tarefa não amplia finalidade ou aprova esses dados.

## Testes e gates

| Verificação | Resultado |
| --- | --- |
| `npm.cmd ci` | Exit 0; instalação reproduzível do lockfile atualizado |
| `npm.cmd test` | 48/48, zero falhas, cancelados ou skips |
| `npm.cmd run build` | Exit 0, 435 módulos |
| `npm.cmd run build:pages` | Exit 0 |
| Bootstrap verify com caminho explícito da biblioteca fixada | 123 bindings aprovados |
| Impeccable detector, uma execução final em `src/main.jsx` | `[]`, exit 0 |
| `git diff --check` | Aprovado |
| `npm.cmd audit --omit=dev --json` | Zero alertas de produção |
| Audit completo | 5 avisos existentes no tooling: 1 baixo e 4 altos |

Os 40 testes anteriores continuam aprovados. Cinco novos casos de transporte
usam relógio simulado do runner Node: 11.999/12.000 ms, fetch que ignora abort,
rejeição durante cancelamento, resolve/reject tardios, resposta observada após
prazo sem timer executado, timer limpo depois de sucesso/erro, único transporte
e rascunho sem endpoint.

Três cenários DOM carregam o entrypoint React real pelo Vite SSR, com JSDOM e
`React.act`. O endpoint/política são URLs fictícias injetadas apenas na configuração
em memória do teste; `envFile: false` impede carregar `.env` no harness. Cada
cenário monta e desmonta sua própria árvore React e prepara os campos/requisição;
os casos também são aprovados isoladamente por filtro de nome. Fetch e abertura de janela são interceptados; nenhum tráfego
externo é permitido. Cobertura: dois submits no mesmo turno geram um POST; fechar
o painel conserva a tentativa; timeout libera o botão e preserva valores ao
reabrir; resolve tardio não troca o alerta; nova tentativa manual funciona depois
do término; sucesso limpa os campos; erro de rede mantém o rascunho e libera a guarda.

`jsdom` 26.1 é a única nova dependência direta, exclusivamente de desenvolvimento,
para tornar a regressão de UI executável por `npm test` em clone limpo/CI, sem
depender de outro projeto, Playwright ou navegador local. Entradas anteriores de
runtime/tooling no lockfile permanecem com as mesmas versões. A versão suporta
Node 18+; CI usa Node 22, e o ensaio local usou Node 24.12.0. Fontes:
[release JSDOM 26.1](https://github.com/jsdom/jsdom/releases/tag/26.1.0) e
[MockTimers do Node](https://nodejs.org/docs/latest-v22.x/api/test.html#class-mocktimers).

Logs ignorados: `.tmp/contact-tests.log`, `.tmp/contact-dom.log`,
`.tmp/contact-ci.log`, `.tmp/contact-build.log`, `.tmp/contact-pages.log`,
`.tmp/contact-impeccable.json`, `.tmp/contact-audit.json`,
`.tmp/contact-production-audit.json` e `.tmp/contact-red.log`.

## Revisão e limites

Skills pertinentes lidas da biblioteca fixada: `senior-dev`, `clean-code`,
`diagnosing-bugs`, `code-reviewer`, `qa-senior`, `qa-automate`,
`javascript-testing-patterns`, `ui-ux-expert`, `accessibility-compliance`,
`impeccable` (harden/craft-floor) e `lgpd-legal-basis`, junto do perfil local e
dos documentos LGPD existentes. O contexto Impeccable já tinha sido executado
uma vez pelo responsável (`SCOPED_EXISTING_ALLOWED`) e não foi repetido.
Nenhum token, estilo, asset, identidade ou layout foi alterado.

Deadline limita a espera da interface, não comprova cancelamento no servidor ou
ausência de recebimento. Abort é best effort; scheduler/aba suspensa podem atrasar
o processamento do timer. Não há idempotência contratada com o operador remoto,
logo confirmação humana precede qualquer retry de resultado incerto.

JSDOM verifica estado, eventos e semântica do alerta; não comprova
geometria, contraste renderizado, animação, leitor de tela ou conformidade WCAG
completa. Preferência de movimento reduzido e observers/RAF são adaptados no
harness para eliminar dependência de layout. Nenhum navegador ou endpoint real
foi utilizado. Avisos de Motion sobre movimento reduzido e diretivas `use client`
no build não impediram os gates. Os 5 alertas completos vêm de Vite/esbuild/
PostCSS/nanoid/source-map-js anteriores, sem aviso atribuído ao novo JSDOM;
remediação do tooling continua um lote separado.

Revisões independentes de código/QA aprovaram transporte, guarda, alerta e limites.
A primeira revisão identificou dependência entre os cenários DOM; a correção
isola montagem/desmontagem, estado e preenchimento por caso. A revisão final
confirmou esse ajuste, `envFile: false` e reabertura durante envio, sem bloqueadores.
Os três casos passaram individualmente por filtro e os 48 passaram em conjunto.
O workflow `quality.yml` executa instalação, testes e os dois builds em pushes
para `develop` e PRs para `main`, com Node 22 e permissão somente de leitura.
Antes deste lote os testes automáticos rodavam apenas no fluxo Pages após push
em `main`. O novo job não publica, envia contatos ou usa credenciais de transporte.
Publicação segue o fluxo do projeto; o implementador deixou diff sem
staging/commit/push. Rollback: reverter o futuro commit de código;
não existem migrações de dados ou alterações de configuração a desfazer.
