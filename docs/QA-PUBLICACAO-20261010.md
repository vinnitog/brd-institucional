# Publicação, cache e primeiro contato — terceiro lote

Escopo somente leitura da publicação e QA local, sem novo frontend, backend,
endpoint ou configuração. O site Pages foi consultado em
`https://vinnitog.github.io/brd-institucional/` em 10/10/2026. A API de Pages
indica esse endereço sem CNAME; deployment aponta para HEAD
`240de3cd1479de7dd329065594543c5e97693658`. O estado verde não foi tomado como
prova dos arquivos: oito GETs foram comparados com o build local `build:pages`.

## Artefato observado

| Arquivo | Bytes HTTP decodificados | Conferência |
| --- | ---: | --- |
| HTML | 2.904 | Mesmo conteúdo/URLs após normalizar quebras de linha Windows |
| brd-mascot-b.svg | 3.634 | Mesmo texto após CRLF → LF |
| icon-purple.png | 46.487 | SHA256 exato |
| hero-background.jpg | 357.008 | SHA256 exato |
| DM Sans variável TTF | 238.984 | SHA256 exato |
| Gupter Bold TTF | 52.352 | SHA256 exato |
| index-BbgUeUBy.js | 319.431 | SHA256 exato |
| index-BvKc0EwJ.css | 21.726 | SHA256 exato |

8/8 HTTP 200, MIME coerente, `cache-control: max-age=600`, `age: 0` e
`last-modified: Sat, 10 Oct 2026 16:59:16 GMT`. HTML, SVG, TTF, JS e CSS tiveram
gzip; PNG/JPEG não informaram content-encoding. Hash JS
`d75b5a1239614d2022f86d994ef5753f2faf23f7508751b96a8b44a141ef401f` e CSS
`c5f6dbcc7ddc0ae1b100ccc0d423abb4af864b888671cc4322eb64b914841676`.

O checkout Windows usa CRLF: SVG local 3.711 bytes; HTML local 2.950 bytes,
incluindo um CR adicional que Vite preserva depois de `<div id="root"></div>`.
Normalizar apenas terminadores (`\r+\n` → `\n`) torna os textos iguais;
atributos/URLs/bundle e conteúdo permanecem intactos. Nenhum asset defasado
foi identificado nesta amostra. Não alteramos fonte para contornar um falso
desvio de hash causado pela plataforma.

## Performance: referência, não Web Vitals

Esses oito arquivos somam 1.042.526 bytes decodificados, não o total de uma
sessão: fotos, outras fontes e assets não foram enumerados.
Hero, fonte variável e bundle JS são os maiores itens da amostra. A página já
precarrega hero e fontes principais e usa LazyMotion com domAnimation importado
estaticamente; não se removeu
marca ou conteúdo para reduzir bytes. Formatos/resoluções podem ser avaliados
em lote específico com prova visual, mas tamanho isolado não demonstra um
defeito de LCP/INP. Não houve benchmark de rede/CPU ou claim de Web Vitals.

O cache observado é de dez minutos. Bundles têm URLs com hash; os assets
institucionais estáticos e o HTML não têm versionamento equivalente. Após nova
publicação, comparar HTML e seus assets efetivamente referenciados com o build
do commit publicado, considerando esse intervalo de cache e outras regiões.
Não houve service worker, purge de CDN ou alteração do workflow.

## Contato e gates

48/48 testes Node/DOM React reais aprovados e build Pages aprovado. A rodada
mantém limite de 12s, guarda de submissão, fechamento/reabertura, rascunho em
timeout/rede, sucesso válido e orientação de recebimento incerto. Sem endpoint
continua o compositor manual. Não submetemos o formulário no site publicado,
abrimos Gmail, enviamos e-mail nem consultamos dados de visitantes.

Este lote entrega evidência confirmatória, sem alegar uma melhoria de produto.
Fontes externas, dispositivo físico, navegador real da publicação, leitor de
tela manual e recebimento por provedor não são homologados por esses testes.
