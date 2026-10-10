# Correções de tooling — 10/10/2026

## Escopo e versões

Checkout isolado `brd-institucional`, branch `codex/second-lot-20261010`, base
main `c4f0e8cf43698c61568b189877f75b27ad6c35a1`. O fluxo de contato corrigido
no lote anterior está preservado; não foram editados fontes, estilos, assets,
testes, workflows, endpoint, destinatário ou `.env`. O checkout original mantém
suas quatro alterações locais da migração. Biblioteca/pin permanecem
`bd46a3d293aec0c85bdc5a1be6b1a2c6477438a7`; verify aprovou 123 bindings.

| Pacote resolvido | Antes | Depois |
| --- | --- | --- |
| vite | 7.3.3 | 7.3.7 |
| esbuild e binários opcionais por plataforma | 0.27.7 | 0.28.2 |
| postcss | 8.5.15 | 8.5.29 |
| nanoid | 3.3.12 | 3.3.20 |
| source-map-js | 1.2.1 | 1.2.2 |
| React / React DOM | 19.2.6 | 19.2.6 |
| Motion | 12.42.2 | 12.42.2 |
| JSDOM | 26.1.0 | 26.1.0 |

Vite continua na major 7; a faixa direta foi elevada a `^7.3.7`, registrando
o piso corrigido. Esbuild 0.28.2 está na faixa explicitamente suportada pelo
Vite 7.3.7 (`^0.27.0 || ^0.28.0`); as outras três transitivas foram atualizadas
dentro das faixas existentes. Não houve overrides, nova dependência direta,
`npm audit fix`, `--force` ou mudança de major React/Motion. Tailwind não faz
parte deste repositório e não foi introduzido.

Fontes primárias: [advisory do mantenedor Vite sobre caminhos Windows](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff),
[release Vite 7.3.7](https://github.com/vitejs/vite/releases/tag/v7.3.7),
[release PostCSS 8.5.29](https://github.com/postcss/postcss/releases/tag/8.5.29)
e [release esbuild 0.28.2](https://github.com/evanw/esbuild/releases/tag/v0.28.2).
Os metadados oficiais `npm view` das versões corrigidas conferiram engines e
faixas de dependências. O requisito de Node do Vite não mudou neste patch:
20.19+ / 22.12+; CI já usa Node 22 e o ensaio local usou 24.12.0.

## Gates

| Gate | Resultado |
| --- | --- |
| npm ci | Exit 0, instalação reproduzível |
| npm test | 48/48, zero falhas/cancelados/skips |
| build normal | Exit 0, três execuções medidas |
| build:pages | Exit 0, 435 módulos |
| npm audit --json | 0; baseline 5 (4 altos, 1 baixo), todos dev |
| npm audit --omit=dev --json | 0 |
| verify da biblioteca fixada | 123 bindings |
| git diff --check | Aprovado |

A suíte mantém os cenários reais de formulário em DOM fictício e os relógios
simulados de transporte: deadline, tentativa duplicada, fechamento/reabertura,
resposta tardia, campo preservado, sucesso/erro e ausência de fallback/retry.
O harness utiliza `envFile: false`, endpoint/política fictícios e intercepta
fetch/janelas; nenhum contato real foi enviado. Os testes anteriores de layout,
links, assets e Pages também foram aprovados. Não foi criado teste que apenas
repete a declaração de versões.

## Artefatos e medidas

O build normal foi medido três vezes antes e depois, sem mudar fontes/config:

| Medida | Antes | Depois |
| --- | --- | --- |
| Wall clock (ms) | 4702.42 / 4169.45 / 4225.02 | 4895.67 / 4057.50 / 4069.14 |
| Mediana wall clock | 4225.02 | 4069.14 |
| JS bytes / gzip | 319413 / 104053 | 319413 / 104053 |
| CSS bytes / gzip | 21636 / 5343 | 21636 / 5343 |

Os dois artefatos são idênticos em SHA-256 antes/depois:

- JS: `b2bc2187a20e816160e6f62e1740016e94f2445b8af6c3f3a1bc87a521a92f1a`.
- CSS: `eb5889d3847d2b2ee42bee055d2bd8b9124e27d0a2bda093181cb577466ad273`.

Não houve custo de bundle neste caso. A diferença de -155.88 ms na mediana
(-3.7%) pertence a uma amostra pequena em máquina compartilhada; não comprova
ganho de performance de build ou carregamento. A entrega é correção do tooling.
O build Pages também passou com a base `/brd-institucional/`.

Logs ignorados em `.tmp`: `tooling-{vite-install,transitive-update,ci,tests,pages}.log`,
`tooling-audit-{before,final,prod}.json`, `tooling-build-{before,after}.json`,
logs individuais de build e `tooling-bundle.json`. Artefatos comparados estão
em `tooling-assets-before` e `tooling-assets-after`.

## Revisão, limites e rollback

Papéis aplicados: senior-dev/clean-code para escopo mínimo; code-reviewer para
faixas, lock e fronteiras do formulário; qa-senior/qa-automate para regressão
proporcional e evidências. Skills pertinentes já lidas da biblioteca fixada,
junto das regras e perfil local. A revisão independente do responsável ocorre
antes da publicação. Não foi alterada a biblioteca, pin ou regra genérica.

Não há alteração visual ou de conteúdo; contexto/setup Impeccable desta sessão
não foi repetido. Nenhum navegador, endpoint real, serviço pago, deploy ou
documento pessoal foi utilizado. Os avisos anteriores de Motion (`use client`)
e movimento reduzido no harness continuam não impeditivos. Os documentos LGPD
e a configuração opcional de coleta permanecem com os limites já registrados.

Audit é fotografia do registro na data; resultado zero não certifica segurança
total. Node 22/CI remoto ainda deve executar após publicação; os testes locais
usaram Node 24. O implementador deixou diff sem staging/commit/push.
Rollback: reverter o futuro commit de dependências/documentos e executar npm ci,
testes e builds. Não existe schema, dado ou configuração de transporte a migrar.

## Revisão independente final

Diff, contrato de versões/lock, faixas suportadas, gates e equivalência dos artefatos conferidos por revisor independente antes da publicação. npm ls confirmou Vite7.3.7/esbuild0.28.2/PostCSS8.5.29 sem dependências inválidas; não foram encontrados bloqueadores.
