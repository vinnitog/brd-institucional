import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;

const services = [
  {
    title: "Recuperação de crédito",
    text: "Cobrança judicial e extrajudicial, negociação de dívidas e defesa contra cobranças indevidas com foco em eficiência e preservação comercial.",
  },
  {
    title: "Auditorias",
    text: "Avaliação de processos, documentos e práticas empresariais para identificar riscos, irregularidades e oportunidades de melhoria.",
  },
  {
    title: "Adequação à LGPD",
    text: "Implementação e manutenção de políticas de privacidade e segurança, com análise das operações e plano de conformidade.",
  },
  {
    title: "Encarregado de dados",
    text: "Atuação como DPO, gestão de privacidade, incidentes de segurança, cumprimento de obrigações legais e proteção de dados.",
  },
  {
    title: "Gestão de contratos",
    text: "Elaboração, revisão e acompanhamento contratual para reduzir riscos, proteger interesses e manter conformidade legal.",
  },
  {
    title: "Assessoria para licitações",
    text: "Apoio em editais, propostas, documentos e fases de habilitação e julgamento para ampliar oportunidades de negócio.",
  },
  {
    title: "Treinamentos",
    text: "Palestras e capacitações para gestores e equipes com conhecimento jurídico estratégico para decisões mais seguras.",
  },
  {
    title: "ESG",
    text: "Conformidade ambiental, social e de governança, revisão de licenças e estruturação de responsabilidade socioambiental.",
  },
];

const pillars = [
  { title: "Tradição", text: "Rigor técnico, linguagem precisa e respeito ao método jurídico." },
  { title: "Inovação", text: "Tecnologia, dados e processos para dar velocidade ao que exige decisão." },
  { title: "Estratégia", text: "Atuação preventiva e consultiva, com visão de negócio." },
  { title: "Presença", text: "Acompanhamento próximo, claro e responsável em cada etapa." },
];

const intelligenceData = [
  { name: "Prevenção", value: 88 },
  { name: "Conformidade", value: 92 },
  { name: "Eficiência", value: 84 },
  { name: "Governança", value: 90 },
];

const teamPrinciples = [
  "Sócios presentes na estratégia",
  "Atendimento direto e responsável",
  "Leitura multidisciplinar do negócio",
];

const insights = [
  {
    label: "Dados e tecnologia",
    title: "LGPD como rotina de governança, não como documento isolado.",
  },
  {
    label: "Negócios",
    title: "Contratos revisados com visão de risco, prazo e operação.",
  },
  {
    label: "Empresas",
    title: "Crédito, crise e conformidade tratados antes do litígio.",
  },
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="site-header" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="BRD Advocacia">
          <img src={assetPath("assets/brand/logo-full-dark.png")} alt="BRD Advocacia" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav id="main-navigation" className={isMenuOpen ? "is-open" : ""}>
          <a href="#sobre" onClick={closeMenu}>Sobre</a>
          <a href="#expertises" onClick={closeMenu}>Expertises</a>
          <a href="#equipe" onClick={closeMenu}>Equipe</a>
          <a href="#inteligencia" onClick={closeMenu}>Inteligência</a>
          <a href="#contato" onClick={closeMenu}>Contato</a>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow">Advocacia empresarial</p>
            <img className="hero-logo" src={assetPath("assets/brand/logo-full-dark.png")} alt="BRD Advocacia" />
            <h1 id="hero-title">Decisões jurídicas com visão de negócio.</h1>
            <p className="hero-lead">Guiados pela tradição. Impulsionados pela inovação.</p>
            <div className="hero-actions" aria-label="Ações principais">
              <a className="button button-primary" href="#contato">
                Falar com o escritório
              </a>
              <a className="button button-ghost" href="#expertises">
                Ver expertises
              </a>
            </div>
          </div>
        </section>

        <section className="intro-band" aria-label="Resumo institucional">
          <div>
            <span>Atuação</span>
            <strong>consultiva, preventiva e contenciosa</strong>
          </div>
          <div>
            <span>Perfil</span>
            <strong>banca empresarial com sócios próximos</strong>
          </div>
          <div>
            <span>Foco</span>
            <strong>segurança jurídica para decisões relevantes</strong>
          </div>
        </section>

        <section className="section split" id="sobre">
          <div className="section-copy">
            <p className="eyebrow">O escritório</p>
            <h2>Uma banca construída por sócios que atuam junto ao cliente.</h2>
          </div>
          <div className="body-copy">
            <p>
              A BRD une experiência jurídica, governança e uma leitura prática dos desafios
              empresariais. O escritório preserva o rigor técnico da advocacia tradicional e
              aplica inovação onde ela melhora velocidade, clareza e tomada de decisão.
            </p>
            <p>
              A assinatura BRD adv. reforça uma instituição coletiva: Luís Bernardo idealizou o
              escritório, mas a entrega é feita com os demais sócios, em uma atuação coordenada,
              próxima e multidisciplinar.
            </p>
          </div>
        </section>

        <section className="section team" id="equipe">
          <div className="team-panel">
            <div>
              <p className="eyebrow">Nosso time</p>
              <h2>Estratégia compartilhada, responsabilidade individual.</h2>
            </div>
            <ul className="team-list" aria-label="Princípios do time BRD">
              {teamPrinciples.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="expertises">
          <div className="section-heading">
            <p className="eyebrow">Expertises</p>
            <h2>Especialização jurídica conectada aos setores que movem empresas.</h2>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section method" id="metodo">
          <div className="section-copy">
            <p className="eyebrow">Método BRD</p>
            <h2>Tradição jurídica com operação inteligente.</h2>
          </div>
          <div className="method-layout">
            <div className="pillars-grid">
              {pillars.map((pillar) => (
                <article className="pillar" key={pillar.title}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              ))}
            </div>
            <div className="chart-panel" aria-label="Indicadores qualitativos do método BRD">
              <div className="chart-copy">
                <span>Inteligência aplicada</span>
                <strong>da análise preventiva ao plano de ação</strong>
              </div>
              <ul className="metric-list" aria-label="Indicadores qualitativos do método BRD">
                {intelligenceData.map((item) => (
                  <li className="metric-item" key={item.name} style={{ "--metric": `${item.value}%` }}>
                    <span>{item.name}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section intelligence" id="inteligencia">
          <div className="section-heading">
            <p className="eyebrow">Inteligência jurídica</p>
            <h2>Atualização, análise e prevenção para decisões que importam.</h2>
          </div>
          <div className="insights-grid">
            {insights.map((insight) => (
              <article className="insight-card" key={insight.title}>
                <span>{insight.label}</span>
                <h3>{insight.title}</h3>
                <a href="#contato">Conversar sobre o tema</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section identity">
          <div className="identity-mark">
            <img src={assetPath("assets/brand/icon-purple.png")} alt="" aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">Identidade</p>
            <h2>Elegância sóbria, ritmo digital e presença institucional.</h2>
            <p>
              O visual do site segue a marca oficial: preto profundo, branco, roxo BRD,
              textura sutil e tipografia com contraste entre a firmeza editorial da Gupter
              e a clareza contemporânea da DM Sans.
            </p>
          </div>
        </section>

        <section className="contact" id="contato" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">Contato</p>
            <h2 id="contact-title">Vamos conversar sobre o próximo passo jurídico da sua empresa.</h2>
          </div>
          <div className="contact-actions">
            <a className="button button-primary" href="https://www.instagram.com/brd.adv/" target="_blank" rel="noreferrer">
              Abrir Instagram
            </a>
            <a className="button button-light" href="mailto:contato@brd.adv.br">
              Enviar e-mail
            </a>
          </div>
        </section>
      </main>

      <footer>
        <img src={assetPath("assets/brand/logo-full-light.png")} alt="BRD Advocacia" />
        <p>Guiados pela tradição. Impulsionados pela inovação.</p>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
