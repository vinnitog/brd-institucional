import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

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
    text: "Apoio completo em editais, propostas, documentos e fases de habilitação e julgamento para ampliar oportunidades de negócio.",
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

function App() {
  return (
    <>
      <header className="site-header" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="BRD Advocacia">
          <img src="/assets/brand/logo-full-dark.png" alt="BRD Advocacia" />
        </a>
        <nav>
          <a href="#sobre">Sobre</a>
          <a href="#atuacao">Atuação</a>
          <a href="#metodo">Método</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
          <p className="eyebrow">Advogados Associados</p>
          <h1 id="hero-title">BRD Advocacia</h1>
            <p className="hero-lead">Guiados pela tradição. Impulsionados pela inovação.</p>
            <div className="hero-actions" aria-label="Ações principais">
              <a className="button button-primary" href="#contato">
                Falar com o escritório
              </a>
              <a className="button button-ghost" href="#atuacao">
                Ver áreas de atuação
              </a>
            </div>
          </div>
        </section>

        <section className="intro-band" aria-label="Resumo institucional">
          <div>
            <span>Atuação empresarial</span>
            <strong>consultiva, preventiva e contenciosa</strong>
          </div>
          <div>
            <span>Marca</span>
            <strong>precisa, contemporânea e humana</strong>
          </div>
          <div>
            <span>Foco</span>
            <strong>segurança jurídica para decisão</strong>
          </div>
        </section>

        <section className="section split" id="sobre">
          <div className="section-copy">
            <p className="eyebrow">Quem somos</p>
              <h2>Um escritório para empresas que precisam decidir com clareza.</h2>
          </div>
          <div className="body-copy">
            <p>
              A BRD une experiência jurídica, governança e uma leitura prática dos desafios
              empresariais. O escritório nasce com uma identidade firme: preservar o que o
              direito tem de mais sólido e aplicar inovação onde ela melhora a resposta ao cliente.
            </p>
            <p>
              O resultado é uma advocacia objetiva, visualmente contemporânea e orientada a risco,
              conformidade, contratos, dados, crédito e desenvolvimento empresarial.
            </p>
          </div>
        </section>

        <section className="section" id="atuacao">
          <div className="section-heading">
            <p className="eyebrow">Áreas de atuação</p>
            <h2>Serviços jurídicos com critério, processo e visão de negócio.</h2>
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
            <p className="eyebrow">Metodo BRD</p>
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

        <section className="section identity">
          <div className="identity-mark">
            <img src="/assets/brand/icon-purple.png" alt="" aria-hidden="true" />
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
        <img src="/assets/brand/logo-full-light.png" alt="BRD Advocacia" />
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
