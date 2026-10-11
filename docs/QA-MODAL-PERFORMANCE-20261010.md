# Modal, performance e limites da fila final

## Defeito confirmado e corrigido

O diálogo de contato declarava aria-modal e fazia trap de Tab, mas os elementos
de fundo permaneciam expostos à navegação assistiva e ao foco programático.
A nova regressão DOM React/Vite SSR falhou antes da correção (inert ausente).
Quando o diálogo abre, os irmãos do contêiner do atendimento recebem inert e
aria-hidden. Fechamento/desmontagem restaura exatamente os valores prévios;
StrictMode não deixa atributos residuais. O atendimento/controle de fechamento
continua fora desse isolamento, preservando foco inicial e guardas de envio.

49/49 Node/DOM reais, builds normal e Pages, verify123 e diffcheck aprovados.
O novo teste comprova isolamento, foco inicial, fechamento, reabertura,
desmontagem e preservação de atributo aria-hidden previamente definido.
Os três testes reais anteriores conservam quota temporal12s, rascunho, guarda,
sucesso e ausência de popup automático. Nenhum POST real ou Gmail foi aberto.
JSDOM verifica contratos e atributos, sem homologar leitor de tela humano ou o
comportamento nativo de inert em dispositivos físicos.

## Motion: experimento descartado

O baseline importa domAnimation estaticamente. Separar somente esse módulo via
import() gerou entry309320B e chunk11467B, total320787B frente319431B anteriores
(+1356B e uma requisição). O chunk seria solicitado imediatamente e o conteúdo
com initialhidden dependeria dele; falha de rede introduziria risco de leitura.
Esse protótipo foi removido e não integra o commit. Mantemos o carregamento
síncrono e reducedMotionuser; não se alega lazy loading ou ganho de Web Vitals.
Uma troca futura exigiria arquitetura visible-first/fail-open e prova de atraso
e falha do chunk, em vez de tratar a divisão em si como melhoria.

## Cache, offline e avaliações externas

PROJECT_CONTEXT declara Offline/PWA:Nao. Não existe service worker, registro,
manifesto PWA ou persistência do formulário; nenhuma biblioteca/cache foi ativada
para preencher um item histórico. As URLs JS/CSS já têm hash Vite. Headers Pages
de600s e comparação do build publicado estão em QA-PUBLICACAO-20261010.md.
Sem controle da hospedagem não alteramos TTL/purge/DNS; conferir o commit servido
depois do deploy permanece uma verificação externa, nunca presumida pelo CI.

Não há defeito comprovado adicional nos testes de menu, skip link, viewport,
Escape e feedback. Avaliação assistiva humana, zoom físico e recebimento pelo
operador do formulário continuam pendentes; não foram substituídos por claims
automatizados. Marca, fontes, fotos, conteúdo, transportes e pins permanecem.
