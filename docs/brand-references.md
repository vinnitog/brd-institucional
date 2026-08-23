# Referências De Marca BRD

Documento de acompanhamento criado durante o desenvolvimento do site institucional.

## Fontes Da Identidade

- Materiais institucionais fornecidos pelo escritório.
- Perfil oficial de referência: `https://www.instagram.com/brd.adv/`.

## Identidade Visual

- Marca: BRD Advocacia, também apresentada como BRD adv.
- Lema principal: "Guiados pela tradição. Impulsionados pela inovação."
- Cor principal observada em `Cor HEX - BRD.png`: roxo RGB `150, 74, 251`, equivalente a `#964AFB`.
- Cores recorrentes: preto profundo, branco, cinzas claros texturizados, roxo BRD e pequenos acentos de contraste.
- Tipografias fornecidas: DM Sans para interface e textos objetivos; Gupter para chamadas editoriais e tom institucional.
- Linguagem visual: composições minimalistas, alto contraste, textura discreta, linhas finas roxas, ritmo editorial e fotografias institucionais com tratamento roxo/preto.

## Assets Aproveitados No Projeto

- `public/assets/brand/logo-full-dark.png`: versão completa roxo/branco para fundos escuros.
- `public/assets/brand/logo-full-light.png`: versão completa para fundos claros.
- `public/assets/brand/icon-purple.png`: ícone institucional roxo.
- `public/assets/brand/hero-background.jpg`: wallpaper com lema e atmosfera visual da marca.
- `public/assets/brand/avatar.png`: avatar social oficial.
- `public/assets/brand/partners/*.jpg`: fotos otimizadas dos sócios a partir de `Instagram\sócios`.
- `public/fonts/DMSans-VariableFont_opsz,wght.ttf`: fonte principal.
- `public/fonts/Gupter-Regular.ttf`, `Gupter-Medium.ttf`, `Gupter-Bold.ttf`: fonte editorial.

## Dados De Contato E Presença Digital

- Localização institucional: Rua Sete de Setembro, n.° 1359, Senador Salgado Filho, Marília/SP, 17502-020.
- Telefone institucional: (14) 99832-5395.
- Presença oficial: Instagram, LinkedIn, YouTube e Facebook do BRD.
- E-mail institucional: `contato@brd.adv.br`.

## Conteúdo Institucional Extraído Das Referências

As imagens do Instagram e dos materiais de identidade indicam foco empresarial e consultivo, com os seguintes serviços:

- Recuperação de crédito: cobrança judicial e extrajudicial, negociação de dívidas, reestruturação de créditos e defesa contra cobranças indevidas.
- Auditorias: avaliação de processos, documentos e práticas empresariais, identificando riscos, irregularidades e oportunidades de melhoria.
- Adequação à LGPD: implementação e manutenção de políticas de privacidade e segurança, análise de operações empresariais e plano de conformidade.
- Encarregado de dados: atuação como DPO, gestão da privacidade, segurança da informação, incidentes e cumprimento das obrigações legais.
- Gestão de contratos: elaboração, revisão, acompanhamento e execução de termos contratuais.
- Assessoria para licitações: análise de editais, propostas, documentos, habilitação e julgamento.
- Treinamentos: palestras e capacitações para gestores e equipes.
- ESG: conformidade ambiental, social e de governança, responsabilidade socioambiental e mitigação de riscos.

## Direcao Aplicada Ao Site

- Primeira dobra com a marca no topo e imagem oficial como fundo, evitando repetição visual da assinatura e do lema. O lema permanece no HTML apenas como texto acessível para leitores de tela.
- Tom verbal sóbrio, empresarial e direto, evitando promessas exageradas.
- Estrutura pensada para conversão institucional: sobre, atuação, método e contato.
- Interface responsiva com hierarquia editorial forte, grid limpo, cards de atuação e uma leitura de "inteligência aplicada" feita em CSS acessível.
- Recharts foi avaliado na primeira implementação, mas ficou adiado até existir dado real de dashboard; para o site institucional, a versão CSS reduz bundle e melhora acessibilidade.

## Mascote BRD

- Conceito criado em 2026-05-21: dar vida ao "B" da marca para pontos de contato digitais, especialmente atendimento inicial e futuro chatbot.
- Asset principal: `public/assets/brand/brd-mascot-b.svg`, em vetor leve para uso no site, posts, materiais de apoio e interfaces conversacionais.
- Elementos visuais: olhos, bracos, sorriso e balao de conversa para comunicar proximidade sem infantilizar a advocacia.
- Paleta aplicada: roxo BRD `#964AFB`, roxo profundo `#35185A`, fundo claro `#F7F7F4` e preto institucional `#09070F`.
- Aplicacoes sugeridas: avatar do chatbot, widget de primeiro contato, estados de boas-vindas, posts de inteligencia juridica, videos curtos e fluxos de onboarding.
- Diretriz de uso: preferir versoes pequenas e pontuais; evitar substituir a assinatura oficial do escritorio pelo mascote em pecas formais.

## Ajustes Após Referências De Grandes Escritórios

Referências consultadas em 2026-05-21:

- Machado Meyer: navegação institucional com "Quem Somos", "Áreas de atuação", "Advogados", "Prêmios e Reconhecimentos", "Contato" e forte frente de "Inteligência Jurídica"; também destaca time, áreas, atualizações jurídicas e presença corporativa.
- Lefosse: navegação por "Expertises", "Advogados", "O Escritório", "Radar Lefosse" e "Contato"; usa mensagem direta de crescimento/decisão, números institucionais e organização ampla de áreas por especialidade.

Aplicação no BRD:

- A assinatura visual do site passou a priorizar `BRD adv.` em vez da versão "Bernardo Advogados Associados", reforçando o escritório como banca coletiva de sócios.
- A navegação passou a usar "Expertises", "Sócios" e "Inteligência", em linha com a arquitetura institucional de grandes escritórios.
- Foi adicionada uma seção de sócios com perfis sóbrios baseados nas referências locais disponíveis: Luís Bernardo Júnior, Letícia Barriento, André Luis e Fernanda Félix.
- Foi adicionada uma seção de inteligência jurídica inspirada nos hubs editoriais das referências, mas em formato inicial, sem simular publicações ou prêmios inexistentes.
- O rodapé passou a concentrar localização, rota no Google Maps, telefone, e-mail e redes sociais oficiais.
- Refinamentos posteriores reposicionaram o hero mobile, ajustaram a seção de sócios e adicionaram ícones minimalistas para rota e redes sociais.
