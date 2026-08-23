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

