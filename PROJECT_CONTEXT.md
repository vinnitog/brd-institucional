# PROJECT_CONTEXT.md - brd-institucional

Gerado em: 2026-05-20 22:25:12

## Descricao

Site institucional do escritório BRD Advocacia. A experiência deve comunicar tradição, inovação e profissionalismo com linguagem clara, visual moderno e elegante.

## Objetivo

Consolidar a identidade digital do escritório, ampliar sua visibilidade e oferecer um primeiro contato institucional seguro.

## Publico Alvo

Empresas, gestores e profissionais que buscam assessoria jurídica empresarial, preventiva ou contenciosa.

## Caracteristicas Informadas

- Interface visual: Sim
- Login/autenticacao: Nao
- Banco de dados: Nao
- Offline/PWA: Nao
- Mobile: Sim
- Dashboard/graficos: Sim
- API propria: Nao
- Integracoes externas: Nao
- Multiusuario: Nao

## Stack Escolhida

```text
React + Vite + Recharts
```

## Motivo Da Stack

Dashboards costumam ter componentes reutilizaveis, filtros, estados e graficos. React + Recharts cobre isso com baixo atrito.

## Alternativas Rejeitadas

HTML/CSS/JS vanilla: possivel, mas tende a ficar disperso com muitos widgets. Supabase: adiar ate existir necessidade clara de persistencia/autenticacao.

## Revisao Obrigatoria De Stack

Antes da primeira feature real, o `senior-dev` deve validar se a stack escolhida ainda faz sentido.

Se houver front-end, `ui-ux-expert` deve validar impacto visual e UX.

O `code-reviewer` deve apontar risco de stack inadequada, excesso de complexidade ou falta de base para evolucao.

Validacao em 2026-05-21: React + Vite continua adequado para o site institucional. Recharts foi adiado porque a primeira versao nao possui dados reais de dashboard; usar grafico estatico com biblioteca pesada prejudicava performance e acessibilidade.

## Workflow Padrao

Integracao Trello preparada em 16/10/2026: o repositorio e o site permanecem
publicos. O workflow local develop.yml usa bootstrap SSH somente leitura de
brd-ci, fixado em commit, sem chamada a reusable privado e sem publicar seu
codigo. O provedor e o adaptador ficam protegidos em /var/lib antes do agente.
Desenvolvimento, QA e publicacao usam runners separados. QA nao recebe chaves
do provedor nem tokens de escrita; o publicador nao executa codigo do produto.
Patches e commits de integracao sao conferidos por hash antes da publicacao.
Gemini faz a triagem no brd-ops; Terra implementa com deadline, documentos
verificados, revisao e testes. PRs trello/* podem entrar em develop somente
apos testes; main depende de aprovacao humana. Conflitos de integracao param
como falha tecnica. Este adaptador usa Terra sem escalonamento pago automatico
para Sol; falhas tecnicas preservam o diagnostico para recuperacao.
Ativacao depende da publicacao dos workflows, dos secrets e do opt-in no
brd-ops. A label "Pode publicar no GitHub" autoriza publicar o conteudo do card
no repositorio publico; ela nao substitui a triagem de produto. O Pages e a
hospedagem nao foram alterados por esta integracao.

1. `senior-dev`
2. `ui-ux-expert`, quando houver front-end
3. `code-reviewer`
4. `qa-senior`
5. `qa-automate`
6. Validacao final com testes e diff
7. Commit/push em `develop` e PR `develop -> main`

## Comandos De Validacao

```powershell
.\test.cmd
npm.cmd test
git diff --check
```

## Notas De Escopo

- Trabalhar sempre em `develop`.
- Nunca fazer push direto para `main`.
- Preservar alteracoes existentes do usuario.
- Fazer staging explicito por arquivo.
- Manter documentacao de contexto versionada neste arquivo.

## Primeiro contato — limite de espera em 10/10/2026

Quando o endpoint opcional estiver configurado junto de política HTTPS, o POST
possui limite programado de 12 segundos, abort best effort e retorno por race
mesmo se o transporte ignorar cancelamento. Timeout e erro de rede conservam os
campos e comunicam recebimento incerto, orientando confirmar com a equipe antes
de reenviar. Uma guarda síncrona impede tentativas simultâneas, inclusive ao
fechar/reabrir o painel; fechar o painel não cancela a tentativa em andamento.
Sem endpoint, o fluxo continua sendo somente rascunho manual no Gmail. Não houve
ativação de endpoint, alteração de destinatário ou envio real. Evidência local:
48 testes, builds normal/Pages e detector Impeccable sem ocorrências. Limites e
decisões em `docs/QA-CONTATO-20261010.md`.

## Tooling — correções compatíveis em 10/10/2026

Etapa final de acessibilidade: o fundo agora recebe inert/aria-hidden enquanto o
diálogo de atendimento está aberto, com restauração exata no fechamento/unmount.
Regressão RED→GREEN,49Node/DOM e builds normal/Pages aprovados. Um protótipo de
splitdomAnimation acrescentou bytes/request e foi descartado; Motion permanece
síncrono. Offline/PWA continuaNao, sem service worker ou persistência de dados.
Evidências e limites externos em `docs/QA-MODAL-PERFORMANCE-20261010.md`.

Entrega de fontes: DM Sans variável e Gupter Regular/Bold recebem WOFF2 completos
locais, preservando TTF e fallback, glifos, métricas e tabelas de variação/licença.
342840→142372bytes (58,47% de economia), sem claim de Web Vitals. Preloads
acompanham o formato preferido. 51Node/DOM, builds normal/Pages e HTTPloopback
byteequal/MIME aprovados; reprodução e limites em `docs/QA-FONTES-20261010.md`.

Vite foi atualizado de 7.3.3 para 7.3.7 e suas transitivas esbuild, PostCSS,
nanoid e source-map-js receberam versões corrigidas dentro das faixas suportadas.
Audit completo e de produção: zero avisos (baseline: cinco avisos dev).
React 19.2.6, Motion 12.42.2 e JSDOM 26.1.0 permanecem iguais; não houve edição
de UI, CSS, destinatário, endpoint ou configuração de contato. Após npm ci, os
48 testes e builds normal/Pages passaram. JS/CSS do build normal são idênticos
em bytes/hash/gzip ao baseline. Evidências e limites:
`docs/QA-DEPENDENCIAS-20261010.md`.

## Teclado e reflow — 12/10/2026

Uma ampliação fictícia do texto raiz em 2× reproduziu overflow horizontal de
18,31 px no LinkedIn do rodapé. O rótulo flex agora quebra quando necessário,
conservando texto, ícone, marca e apresentação normal. Onze casos Playwright
completam as regressões DOM: skip link, foco/inert/Escape, menu mobile,
Tab/Shift+Tab no diálogo, reflow 320/390/640 px, gráfico legível e contato
sucesso/erro/timeout com POST exclusivamente interceptado. 51 Node/DOM, builds
normal/Pages e actionlint aprovados; Playwright 1.62.1 é dev-only e o CI adiciona
a mesma prova funcional sem secrets/deploy. Não equivale a leitor de tela,
zoom nativo, aparelho físico ou recebimento real. Evidências e limites em
`docs/QA-TECLADO-REFLOW-20261012.md`.

## Diagnóstico de movimento — 12/10/2026

Três amostras por preferência normal/reduced, mais warmup excluído, foram
executadas no mesmo Edge 155, viewport 1280×900 e throttle de CPU do renderer
4×, com janela coordenada entre projetos. Scroll, gráfico realmente visível
e abertura/fechamento do diálogo permaneceram legíveis/funcionais. As tarefas
longas observadas foram semelhantes nos dois modos; a janela não isola
animação de layout, imagens e outras tarefas. Motion foi preservado, sem
split, redução visual ou orçamento gzip artificial. Não é medida de aparelho
físico, FPS exibidos, Web Vitals de produção ou SLA. Reprodução e dados em
`docs/QA-MOTION-CPU-20261012.md`; benchmark diagnóstico fica fora do CI.

