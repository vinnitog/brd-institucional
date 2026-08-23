# Discovery LGPD — BRD Institucional

**Data**: 22/08/2026
**Escopo**: arquivos versionados do front-end; infraestrutura externa e processos internos não foram auditados.

## Arquitetura observada

- React + Vite com hospedagem estática via GitHub Pages.
- Sem banco, autenticação, API própria, aplicativo mobile ou área restrita no repositório.
- Endpoint externo de formulário é opcional e só pode ser ativado junto de uma URL de política revisada.
- Sem SDKs de analytics, pixels, cookies de marketing ou uso de `localStorage` no código auditado.

## Tratamentos visíveis

1. Primeiro contato: nome, e-mail, assunto e mensagem; telefone e período para retorno opcionais.
2. Perfis institucionais dos sócios: nome, imagem, função e resumo profissional.
3. Logs técnicos potenciais da hospedagem: dependem da configuração do provedor e precisam ser confirmados.

## Operadores e ambiente

- GitHub Pages aparece no workflow de deploy; conta, região, logs e termos aplicáveis precisam ser validados.
- Provedor de e-mail e eventual serviço do formulário não estão definidos no repositório.
- Retenção, acessos internos, incidentes anteriores, contratos com operadores e processo de direitos do titular não podem ser comprovados pelo front-end.

## Controles observados

- Campos limitados por tamanho e telefone opcional.
- Aviso para não enviar documentos ou dados sensíveis.
- Honeypot básico contra spam.
- Nenhuma credencial ou destinatário pessoal no estado atual do front-end.
- Destinatário e credenciais do endpoint devem permanecer no servidor.

## Limites

Este discovery não comprova conformidade organizacional, contratos, retenção, segurança de e-mail ou controles do endpoint. Essas evidências dependem da equipe e do jurídico do controlador.
