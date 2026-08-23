# BRD Advocacia — Site Institucional

Site institucional responsivo da BRD Advocacia, criado para apresentar o escritório, suas áreas de atuação, o time e os canais oficiais de contato com uma experiência sóbria e acessível.

## Destaques

- Identidade visual própria com fontes e assets locais.
- Conteúdo institucional organizado para leitura rápida.
- Formulário de primeiro contato com minimização de dados e orientação de privacidade.
- Navegação responsiva, foco visível e suporte a preferência por movimento reduzido.
- Animações leves com carregamento sob demanda.
- Deploy automatizado no GitHub Pages.

## Tecnologias

- React 19
- Vite 7
- Motion for React
- CSS responsivo sem biblioteca de componentes
- Node.js Test Runner

## Como executar

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local do projeto.

## Validação

No Windows, use o comando preferencial do projeto:

```powershell
.\test.cmd
npm.cmd run build
```

Em outros ambientes:

```bash
npm test
npm run build
```

## Configuração opcional do formulário

Sem configuração, o formulário abre um rascunho no Gmail para o visitante revisar e enviar ao e-mail institucional. Para integrar um serviço próprio, configure a URL pública do endpoint e a URL da política já revisada e publicada:

```env
VITE_CONTACT_FORM_ENDPOINT=https://seu-endpoint-publico.example/contact
VITE_PRIVACY_POLICY_URL=https://seu-dominio.example/politica-de-privacidade
```

O envio direto só é ativado quando as duas URLs existem. O destinatário e qualquer credencial devem permanecer no servidor. Variáveis `VITE_*` são incluídas no bundle do navegador e nunca devem conter segredos.

## Estrutura

```text
src/                  componentes, conteúdo e estilos
public/               fontes e assets otimizados
unit/                 testes automatizados
docs/                 decisões e referências de marca
.lgpd/                artefatos de auditoria e rascunhos de privacidade
.agents/skills/        skills locais de LGPD e design
```

## Privacidade e segurança

O estado atual dos arquivos não contém credenciais, chaves privadas ou destinatários pessoais. O rascunho de política em `.lgpd/` exige revisão jurídica e não deve ser publicado como documento oficial antes da validação dos campos pendentes. Antes de tornar um repositório existente público, audite também o histórico Git.

## Créditos dos skills

- [lgpd-skills](https://github.com/goul4rt/lgpd-skills), usado na auditoria e no rascunho de privacidade.
- [Impeccable](https://github.com/pbakaus/impeccable), usado na auditoria técnica e no refinamento do front-end.

As licenças e os avisos dos arquivos incorporados estão em [`third_party/`](third_party/).

Os elementos de marca e as imagens institucionais pertencem à BRD Advocacia e não são licenciados para reutilização fora deste projeto.
