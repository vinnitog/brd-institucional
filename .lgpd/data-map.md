# Mapa de Dados — BRD Advocacia

**Versão**: v0.1-draft
**Data**: 22/08/2026
**Owner global**: pendente de designação/validação

## Atividades de tratamento

### A001 — Primeiro contato institucional

| Campo | Valor |
|---|---|
| Slug | `a001-primeiro-contato` |
| Finalidade | Receber e responder a uma solicitação iniciada pelo visitante |
| Base legal | Candidata: art. 7º, V, quando houver procedimento preliminar a pedido do titular; validar em [`legal-basis.md`](./legal-basis.md#a001--primeiro-contato-institucional) |
| Titulares | Visitantes e potenciais clientes; serviço não direcionado a menores |
| Sensíveis? | Não solicitados; podem ser informados indevidamente no texto livre |
| Dados | Nome, e-mail, assunto, mensagem, telefone opcional e período de retorno opcional |
| Fonte | Coletados diretamente do titular |
| Sistemas | Memória do navegador; Gmail escolhido pelo visitante ou endpoint externo configurado |
| Operadores | Provedor de e-mail e eventual serviço do endpoint — pendentes de identificação |
| Transferência internacional | Pendente de validação dos operadores |
| Retenção | Pendente de definição e validação jurídica |
| Segurança observada | TLS depende da hospedagem; limites de tamanho; minimização; honeypot; sem persistência local |
| Alto risco? | Não pelos critérios observáveis; reavaliar se o canal passar a aceitar documentos ou dados sensíveis |
| Owner | Atendimento/privacidade — pendente de confirmação |

### A002 — Perfis institucionais dos sócios

| Campo | Valor |
|---|---|
| Slug | `a002-perfis-institucionais` |
| Finalidade | Apresentar publicamente a equipe e sua atuação profissional |
| Base legal | Pendente de evidência documental; ver [`legal-basis.md`](./legal-basis.md#a002--perfis-institucionais-dos-sócios) |
| Titulares | Sócios do escritório |
| Sensíveis? | Não identificados |
| Dados | Nome, fotografia, função e resumo profissional |
| Fonte | Materiais institucionais fornecidos ao projeto |
| Sistemas | Repositório Git e hospedagem estática |
| Operadores | GitHub/hospedagem, sujeito a validação contratual |
| Transferência internacional | Possível, conforme o provedor de hospedagem; validar |
| Retenção | Enquanto houver autorização e finalidade institucional; critério formal pendente |
| Segurança observada | Somente conteúdo aprovado deve ser versionado; repositório sem originais de alta resolução |
| Alto risco? | Não |
| Owner | Comunicação institucional — pendente de confirmação |

### A003 — Logs técnicos da hospedagem

| Campo | Valor |
|---|---|
| Slug | `a003-logs-hospedagem` |
| Finalidade | Segurança, disponibilidade e entrega técnica do site, se o provedor registrar acessos |
| Base legal | Pendente de confirmação da coleta e de LIA; candidata: art. 7º, IX |
| Titulares | Visitantes |
| Sensíveis? | Não esperados |
| Dados | Potencialmente IP, data/hora, user-agent e URL — confirmar com o provedor |
| Fonte | Observados automaticamente pela infraestrutura, se habilitados |
| Sistemas | GitHub Pages ou provedor efetivamente usado — validar |
| Operadores | Provedor de hospedagem |
| Transferência internacional | Possível; validar região e mecanismo aplicável |
| Retenção | Pendente de confirmação do provedor e do controlador |
| Segurança observada | Não verificável no repositório |
| Alto risco? | Não pelos fatos disponíveis |
| Owner | Infraestrutura/privacidade — pendente de confirmação |

## Checklist

- [x] Coletas e integrações visíveis no código foram inventariadas.
- [x] Dados sensíveis inesperados e menores foram sinalizados.
- [ ] Bases legais aprovadas pelo jurídico.
- [ ] Operadores, regiões e transferências confirmados.
- [ ] Retenção definida sem prazo indefinido.
- [ ] ROPA consolidado após as validações acima.
