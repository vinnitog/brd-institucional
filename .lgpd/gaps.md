# Gaps LGPD — BRD Institucional

Auditoria estática do front-end em 2026-08-22. Este documento não substitui avaliação jurídica ou auditoria da infraestrutura que recebe os contatos.

## Corrigidos

### P1 — Destinatário pessoal exposto no bundle

- **Risco**: contatos do site eram direcionados a um Gmail pessoal declarado no código público.
- **Correção**: o cliente usa apenas o e-mail institucional `contato@brd.adv.br`.
- **Base**: princípios da necessidade, transparência, segurança e prevenção (LGPD, art. 6º, III, VI, VII e VIII).

### P1 — Credencial potencialmente exposta pelo Vite

- **Risco**: `VITE_CONTACT_FORM_ACCESS_KEY` sugeria armazenar uma chave no bundle público.
- **Correção**: a chave e o campo de destino foram removidos do cliente. Credenciais e destinatário devem ser definidos no servidor.
- **Base**: medidas de segurança desde a concepção (LGPD, art. 46, § 2º).

### P2 — Transparência insuficiente no ponto de coleta

- **Risco**: o formulário alertava sobre dados sensíveis, mas não explicava de forma direta a finalidade ou o canal para direitos.
- **Correção**: aviso em camadas incluído junto ao envio, com finalidade, minimização e contato institucional.
- **Base**: transparência e acesso facilitado (LGPD, art. 6º, VI, e art. 9º).

### P2 — Duplicidade de transmissão

- **Risco**: após enviar a um endpoint, o fluxo também abria um rascunho no Gmail.
- **Correção**: o Gmail é usado apenas como alternativa quando não há endpoint configurado.
- **Base**: adequação e necessidade (LGPD, art. 6º, II e III).

## Pendentes de decisão humana

### P1 — Identificação formal do controlador e do encarregado

Confirmar razão social, CNPJ e canal do encarregado antes de publicar a política. O art. 9º, III e IV, exige identificação e contato do controlador.

### P1 — Operador, retenção e infraestrutura

Confirmar quem recebe o endpoint, onde os dados são armazenados, por quanto tempo e quais contratos regulam o operador. O código do front-end não permite concluir esses fatos.

### P2 — Processo de direitos do titular

Definir processo interno para confirmar, acessar, corrigir, eliminar ou bloquear dados e responder às demais solicitações do art. 18 da LGPD.
