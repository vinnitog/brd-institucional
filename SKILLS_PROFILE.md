# Perfil Local Dos Skills

Este arquivo adapta os skills instalados em `.agents/skills/` ao contexto do site BRD. Leia-o antes de executar qualquer um deles.

## lgpd-audit

- Cenário padrão: B, retrofit de site institucional existente.
- Stack: React + Vite, hospedagem estática, sem autenticação ou banco neste repositório.
- Tratamento visível: formulário de contato com nome, e-mail, telefone opcional, assunto, mensagem e preferência de retorno.
- Endpoint: opcional e configurado por URL pública. Segredos e destinatário nunca pertencem ao bundle.
- Não detectados: analytics, cookies de marketing, pagamentos, decisões automatizadas ou área direcionada a menores.
- Prioridade: minimização, transparência no ponto de coleta, operador do formulário, retenção, direitos do titular e ausência de exposição acidental.
- Artefatos ficam em `.lgpd/`; documentos jurídicos permanecem em draft até revisão humana.

## lgpd-privacy-policy

- Produto: site institucional público da BRD Advocacia.
- Finalidade observável: responder à solicitação iniciada pelo visitante.
- Canal público disponível: `contato@brd.adv.br`.
- O site orienta a não enviar documentos ou dados sensíveis.
- Não inferir razão social, CNPJ, encarregado, operador, país de tratamento ou retenção.
- A política completa permanece em `.lgpd/policies/*-draft.md` até revisão jurídica.
- O front-end pode exibir aviso resumido e estritamente factual no ponto de coleta.

## impeccable

- Superfície: site institucional de advocacia; modo principal `Persuade`, com blocos `Read`.
- Refinamento, não rebrand. Preservar conteúdo factual, logos, fotos e tom sóbrio.
- Identidade fixa: roxo `#964AFB`, DM Sans no corpo e Gupter em títulos.
- Prioridades: clareza, confiança, acessibilidade, responsividade e primeiro contato seguro.
- Evitar promessas jurídicas, métricas apresentadas como resultados reais, excesso de cards, numeração decorativa e efeitos que infantilizem a marca.
- Movimento deve respeitar `prefers-reduced-motion` sem eliminar feedback útil.
- Conforme `AGENTS.md`, a validação normal usa build, testes e detector estático; browser local somente quando o usuário pedir.
