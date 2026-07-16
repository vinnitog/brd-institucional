import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useAnimate,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { buildGmailComposeUrl } from "./emailLinks.mjs";
import "./styles.css";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;

const motionEase = [0.22, 1, 0.36, 1];
const revealItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: motionEase },
  },
};
const revealGroup = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.09 },
  },
};
const sectionViewport = { once: true, amount: 0.16 };

function RevealSection({ children, ...props }) {
  return (
    <m.section
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={revealGroup}
      {...props}
    >
      {children}
    </m.section>
  );
}

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

function IntelligenceTimeline() {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.45 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return undefined;

    const sequence = [
      [".chart-copy", { opacity: 1, y: 0 }, { duration: 0.34, ease: motionEase }],
    ];

    intelligenceData.forEach((_, index) => {
      const metric = `.metric-item:nth-child(${index + 1})`;

      sequence.push(
        [
          `${metric} .metric-name`,
          { opacity: 1, x: 0 },
          { duration: 0.24, at: "-0.04", ease: motionEase },
        ],
        [
          `${metric} .metric-fill`,
          { scaleX: 1 },
          { duration: 0.52, at: "-0.08", ease: motionEase },
        ],
        [
          `${metric} .metric-value`,
          { opacity: 1, y: 0 },
          { duration: 0.22, at: "-0.2", ease: motionEase },
        ],
      );
    });

    const controls = animate(sequence);
    return () => controls.stop();
  }, [animate, isInView, shouldReduceMotion]);

  const hiddenCopyStyle = shouldReduceMotion
    ? undefined
    : { opacity: 0, transform: "translateY(12px)" };
  const hiddenNameStyle = shouldReduceMotion
    ? undefined
    : { opacity: 0, transform: "translateX(-12px)" };
  const hiddenBarStyle = shouldReduceMotion ? undefined : { transform: "scaleX(0)" };
  const hiddenValueStyle = shouldReduceMotion
    ? undefined
    : { opacity: 0, transform: "translateY(8px)" };

  return (
    <m.div
      ref={scope}
      className="chart-panel"
      aria-label="Indicadores qualitativos do método BRD"
      variants={revealItem}
    >
      <div className="chart-copy" style={hiddenCopyStyle}>
        <span>Inteligência aplicada</span>
        <strong>Da análise preventiva ao plano de ação</strong>
      </div>
      <ul className="metric-list" aria-label="Indicadores qualitativos do método BRD">
        {intelligenceData.map((item) => (
          <li className="metric-item" key={item.name}>
            <span className="metric-name" style={hiddenNameStyle}>
              {item.name}
            </span>
            <span className="metric-track" aria-hidden="true">
              <span
                className="metric-fill"
                style={{ "--metric": `${item.value}%`, ...hiddenBarStyle }}
              />
            </span>
            <strong
              className="metric-value"
              style={hiddenValueStyle}
              aria-label={`${item.value} de 100`}
            >
              {item.value}
            </strong>
          </li>
        ))}
      </ul>
    </m.div>
  );
}

const teamPrinciples = [
  "Sócios presentes na estratégia",
  "Atendimento direto e responsável",
  "Leitura multidisciplinar do negócio",
];

const partners = [
  {
    name: "Luís Bernardo Júnior",
    role: "Sócio fundador",
    focus: "Estratégia empresarial, governança e condução institucional do escritório.",
    image: "assets/brand/partners/luis.jpg",
  },
  {
    name: "Letícia Barriento",
    role: "Sócia",
    focus: "Comunicação institucional, inteligência jurídica e atuação consultiva.",
    image: "assets/brand/partners/leticia.jpg",
  },
  {
    name: "André Luis",
    role: "Sócio",
    focus: "Atuação empresarial com presença próxima e leitura prática dos desafios do cliente.",
    image: "assets/brand/partners/andre.jpg",
  },
  {
    name: "Fernanda Félix",
    role: "Sócia",
    focus: "Apoio estratégico em demandas consultivas, preventivas e de rotina empresarial.",
    image: "assets/brand/partners/fernanda.jpg",
  },
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


const mapUrl = "https://www.google.com/maps/search/?api=1&query=BRD%20Advogados%20Associados%20Rua%20Sete%20de%20Setembro%201359%20Mar%C3%ADlia%20SP";

const socialLinks = [
  { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/brd.adv/" },
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/company/bernardo-advogados-associados-brd/posts/?feedView=all",
  },
  { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/channel/UCBEoHdFSNDyOLZkpyo5bTLg" },
  {
    label: "Facebook",
    icon: "facebook",
    href: "https://www.facebook.com/people/Bernardo-Advogados-Associados/61570437647099/?mibextid=wwXIfr&rdid=546vsHgdDovVzc5O&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16ZTurjKJJ%2F%3Fmibextid%3DwwXIfr",
  },
];

const contactEmail = "contato@brd.adv.br";
const chatAnalysisEmail = "contato@brd.adv.br";
const contactEmailSubject = "Contato pelo site BRD";
const contactEmailBody = "Ola, equipe BRD.\n\nGostaria de conversar sobre uma demanda juridica da minha empresa.";
const chatFormEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT ?? "";
const chatFormAccessKey = import.meta.env.VITE_CONTACT_FORM_ACCESS_KEY ?? "";

const contactTopics = [
  "Recuperação de crédito",
  "Contratos",
  "LGPD e dados",
  "Licitações",
  "Auditorias",
  "ESG",
  "Outro assunto",
];

const initialChatForm = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
  schedule: "",
  company: "",
};

const FIELD_LIMITS = {
  name: 120,
  email: 160,
  phone: 32,
  topic: 60,
  message: 2000,
  schedule: 80,
};

function buildChatEmailBody(form) {
  return [
    "Olá, equipe BRD.",
    "",
    "Um novo contato foi iniciado pelo chatbot do site.",
    "",
    "Dados do contato",
    "----------------",
    `Nome: ${form.name}`,
    `E-mail: ${form.email}`,
    `Telefone: ${form.phone || "Não informado"}`,
    `Assunto principal: ${form.topic}`,
    `Melhor período para retorno: ${form.schedule || "Não informado"}`,
    "",
    "Resumo informado:",
    form.message,
    "",
    "Observação de segurança:",
    "A pessoa foi informada de que este canal não substitui consulta jurídica, não analisa documentos e não antecipa resultado. Também foi orientada a não enviar dados sensíveis pelo formulário.",
  ].join("\n");
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function EmailContactLink({ email, subject, body }) {
  return (
    <m.a
      className="email-contact-link"
      href={buildGmailComposeUrl(email, subject, body)}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <EmailIcon />
      <span>{email}</span>
    </m.a>
  );
}

function openGmailCompose(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s6.5-5.7 6.5-12a6.5 6.5 0 0 0-13 0c0 6.3 6.5 12 6.5 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function SocialIcon({ type }) {
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="16.4" cy="7.6" r="0.9" />
      </svg>
    );
  }

  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="7" width="16" height="10" rx="3" />
        <path d="m11 10 4 2-4 2v-4Z" />
      </svg>
    );
  }

  return <span aria-hidden="true">{type === "linkedin" ? "in" : "f"}</span>;
}

function LegalContactChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialChatForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.company) {
      setStatus("sent");
      setFeedback("Agradecemos seu contato!");
      setForm(initialChatForm);
      return;
    }

    setStatus("sending");
    setFeedback("");

    const cleaned = {
      name: form.name.trim().slice(0, FIELD_LIMITS.name),
      email: form.email.trim().slice(0, FIELD_LIMITS.email),
      phone: form.phone.trim().slice(0, FIELD_LIMITS.phone),
      topic: form.topic.trim().slice(0, FIELD_LIMITS.topic),
      message: form.message.trim().slice(0, FIELD_LIMITS.message),
      schedule: form.schedule.trim().slice(0, FIELD_LIMITS.schedule),
    };

    const emailBody = buildChatEmailBody(cleaned);
    const subject = `[Site BRD] Novo contato - ${cleaned.topic || "Atendimento inicial"}`;
    const gmailComposeUrl = buildGmailComposeUrl(chatAnalysisEmail, subject, emailBody);
    const payload = {
      ...(chatFormAccessKey ? { access_key: chatFormAccessKey } : {}),
      subject,
      to_email: chatAnalysisEmail,
      from_name: cleaned.name,
      reply_to: cleaned.email,
      name: cleaned.name,
      email: cleaned.email,
      phone: cleaned.phone,
      topic: cleaned.topic,
      schedule: cleaned.schedule,
      message: emailBody,
    };

    try {
      if (chatFormEndpoint) {
        const response = await fetch(chatFormEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Contact form request failed");
        }

        openGmailCompose(gmailComposeUrl);
        setStatus("sent");
        setFeedback("Agradecemos seu contato!");
        setForm(initialChatForm);
        return;
      }

      openGmailCompose(gmailComposeUrl);
      setStatus("sent");
      setFeedback("Agradecemos seu contato!");
      setForm(initialChatForm);
    } catch {
      setStatus("error");
      setFeedback(`Não foi possível enviar agora. Use o e-mail ${contactEmail} ou tente novamente em instantes.`);
    }
  };

  return (
    <div className={`legal-chat ${isOpen ? "is-open" : ""}`}>
      <m.button
        className="legal-chat-toggle"
        type="button"
        aria-controls="legal-chat-panel"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Fechar atendimento inicial" : "Abrir atendimento inicial"}
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="legal-chat-toggle-icon" aria-hidden="true">
          <img
            src={assetPath("assets/brand/brd-mascot-b.svg")}
            alt=""
            width="34"
            height="34"
            decoding="async"
            loading="lazy"
          />
        </span>
        <span>Fale comigo!</span>
      </m.button>

      <AnimatePresence>
        {isOpen ? (
          <m.aside
            id="legal-chat-panel"
            className="legal-chat-panel"
            aria-label="Atendimento inicial BRD"
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 28,
              scale: shouldReduceMotion ? 1 : 0.985,
            }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 18,
              scale: shouldReduceMotion ? 1 : 0.99,
            }}
            transition={{ duration: 0.26, ease: motionEase }}
          >
          <div className="legal-chat-header">
            <div>
              <span>Atendimento inicial</span>
              <strong>BRD Advocacia</strong>
            </div>
            <button type="button" aria-label="Fechar atendimento inicial" onClick={() => setIsOpen(false)}>
              <span aria-hidden="true">x</span>
            </button>
          </div>

          <div className="legal-chat-messages" aria-live="polite">
            <p>
              Posso registrar seu contato para a equipe entender o assunto e indicar o melhor
              caminho para uma reunião inicial.
            </p>
            <p>
              Este canal não substitui consulta jurídica, não analisa documentos e não antecipa resultado.
              Evite enviar dados sensíveis por aqui.
            </p>
          </div>

          <form className="legal-chat-form" onSubmit={handleSubmit} noValidate={false}>
            <div className="legal-chat-honeypot" aria-hidden="true">
              <label>
                Empresa
                <input
                  name="company"
                  value={form.company}
                  onChange={updateField}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
            <label>
              Nome
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
                autoComplete="name"
                maxLength={FIELD_LIMITS.name}
              />
            </label>
            <label>
              E-mail
              <input
                name="email"
                value={form.email}
                onChange={updateField}
                required
                type="email"
                autoComplete="email"
                maxLength={FIELD_LIMITS.email}
                inputMode="email"
              />
            </label>
            <label>
              Telefone, se preferir retorno por ligação
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                type="tel"
                autoComplete="tel"
                maxLength={FIELD_LIMITS.phone}
                inputMode="tel"
              />
            </label>
            <label>
              Assunto principal
              <select name="topic" value={form.topic} onChange={updateField} required>
                <option value="">Selecione</option>
                {contactTopics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </label>
            <label>
              Conte em poucas linhas o que aconteceu
              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                required
                rows="4"
                maxLength={FIELD_LIMITS.message}
                placeholder="Descreva o contexto, sem anexar documentos ou dados sensíveis."
              />
            </label>
            <label>
              Melhor período para retorno
              <input
                name="schedule"
                value={form.schedule}
                onChange={updateField}
                maxLength={FIELD_LIMITS.schedule}
                placeholder="Ex.: manhã, tarde ou dia específico"
              />
            </label>

            <button className="button button-primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Enviando..." : "Enviar para análise"}
            </button>
            <AnimatePresence mode="wait">
              {feedback ? (
                <m.p
                  className={`legal-chat-feedback ${status}`}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {feedback}
                </m.p>
              ) : null}
            </AnimatePresence>
          </form>
          </m.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.24,
  });

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        {!shouldReduceMotion ? (
          <m.div
            className="scroll-progress"
            style={{ scaleX: smoothScrollProgress }}
            aria-hidden="true"
          />
        ) : null}
        <m.header
          className="site-header"
          aria-label="Navegação principal"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: motionEase }}
        >
        <a className="brand" href="#inicio" aria-label="BRD Advocacia">
          <img
            src={assetPath("assets/brand/logo-full-dark.png")}
            alt="BRD Advocacia"
            width="148"
            height="44"
            decoding="async"
            fetchpriority="high"
          />
        </a>
        <m.button
          className="menu-toggle"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
          whileTap={{ scale: 0.94 }}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </m.button>
        <nav id="main-navigation" className={isMenuOpen ? "is-open" : ""}>
          <a href="#sobre" onClick={closeMenu}>Sobre</a>
          <a href="#socios" onClick={closeMenu}>Sócios</a>
          <a href="#expertises" onClick={closeMenu}>Expertises</a>
          <a href="#inteligencia" onClick={closeMenu}>Inteligência</a>
          <a href="#contato" onClick={closeMenu}>Contato</a>
        </nav>
        </m.header>

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <m.div className="hero-content" initial="hidden" animate="visible" variants={revealGroup}>
            <m.h1 id="hero-title" variants={revealItem}>
              Decisões jurídicas com visão de negócio.
            </m.h1>
            <p className="sr-only">Guiados pela tradição. Impulsionados pela inovação.</p>
            <m.div className="hero-actions" aria-label="Ações principais" variants={revealItem}>
              <m.a
                className="button button-primary"
                href="#contato"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Falar com o escritório
              </m.a>
              <m.a
                className="button button-ghost"
                href="#expertises"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver expertises
              </m.a>
            </m.div>
          </m.div>
        </section>

        <RevealSection className="intro-band" aria-label="Resumo institucional">
          <m.div variants={revealItem}>
            <span>Atuação</span>
            <strong>Consultiva, preventiva e contenciosa</strong>
          </m.div>
          <m.div variants={revealItem}>
            <span>Perfil</span>
            <strong>Banca empresarial com sócios próximos</strong>
          </m.div>
          <m.div variants={revealItem}>
            <span>Foco</span>
            <strong>Segurança jurídica para decisões relevantes</strong>
          </m.div>
        </RevealSection>

        <RevealSection className="section split" id="sobre">
          <m.div className="section-copy" variants={revealItem}>
            <p className="eyebrow">O escritório</p>
            <h2>Uma banca construída por sócios que atuam junto ao cliente.</h2>
          </m.div>
          <m.div className="body-copy" variants={revealItem}>
            <p>
              O BRD une experiência jurídica, governança e uma leitura prática dos desafios
              empresariais. O escritório preserva o rigor técnico da advocacia tradicional e
              aplica inovação onde ela melhora velocidade, clareza e tomada de decisão.
            </p>
            <p>
              A assinatura BRD adv. reforça uma instituição coletiva: Luís Bernardo idealizou o
              escritório, mas a entrega é feita com os demais sócios, em uma atuação coordenada,
              próxima e multidisciplinar.
            </p>
          </m.div>
        </RevealSection>

        <RevealSection className="section partners" id="socios">
          <m.div className="section-heading partners-heading" variants={revealItem}>
            <p className="eyebrow">Sócios</p>
            <h2>Perfis que combinam proximidade, técnica e visão empresarial.</h2>
            <p>
              A seção parte das referências institucionais disponíveis e apresenta o time com
              sobriedade, sem antecipar currículos ou credenciais ainda não documentadas no site.
            </p>
          </m.div>
          <m.div className="partners-layout" variants={revealGroup}>
            <m.div className="partners-intro" variants={revealItem}>
              <img
                src={assetPath("assets/brand/icon-purple.png")}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width="72"
                height="72"
              />
              <ul className="team-list" aria-label="Princípios dos sócios BRD">
                {teamPrinciples.map((principle) => (
                  <li key={principle}>{principle}</li>
                ))}
              </ul>
            </m.div>
            <m.div className="partners-grid" variants={revealGroup}>
              {partners.map((partner) => (
                <m.article
                  className="partner-card"
                  key={partner.name}
                  variants={revealItem}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.24, ease: motionEase }}
                >
                  <div className="partner-photo">
                    <img
                      src={assetPath(partner.image)}
                      alt={`Foto de ${partner.name}`}
                      loading="lazy"
                      decoding="async"
                      width="280"
                      height="280"
                    />
                  </div>
                  <div>
                    <span>{partner.role}</span>
                    <h3>{partner.name}</h3>
                    <p>{partner.focus}</p>
                  </div>
                </m.article>
              ))}
            </m.div>
          </m.div>
        </RevealSection>

        <RevealSection className="section" id="expertises">
          <m.div className="section-heading" variants={revealItem}>
            <p className="eyebrow">Expertises</p>
            <h2>Especialização jurídica conectada aos setores que movem empresas.</h2>
          </m.div>
          <m.div className="services-grid" variants={revealGroup}>
            {services.map((service, index) => (
              <m.article
                className="service-card"
                key={service.title}
                variants={revealItem}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.22, ease: motionEase }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </m.article>
            ))}
          </m.div>
        </RevealSection>

        <RevealSection className="section method" id="metodo">
          <m.div className="section-copy" variants={revealItem}>
            <p className="eyebrow">Método BRD</p>
            <h2>Tradição jurídica com operação inteligente.</h2>
          </m.div>
          <m.div className="method-layout" variants={revealGroup}>
            <m.div className="pillars-grid" variants={revealGroup}>
              {pillars.map((pillar) => (
                <m.article
                  className="pillar"
                  key={pillar.title}
                  variants={revealItem}
                  whileHover={{ x: 5 }}
                >
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </m.article>
              ))}
            </m.div>
            <IntelligenceTimeline />
          </m.div>
        </RevealSection>

        <RevealSection className="section intelligence" id="inteligencia">
          <m.div className="section-heading" variants={revealItem}>
            <p className="eyebrow">Inteligência jurídica</p>
            <h2>Atualização, análise e prevenção para decisões que importam.</h2>
          </m.div>
          <m.div className="insights-grid" variants={revealGroup}>
            {insights.map((insight) => (
              <m.article
                className="insight-card"
                key={insight.title}
                variants={revealItem}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.22, ease: motionEase }}
              >
                <span>{insight.label}</span>
                <h3>{insight.title}</h3>
                <a href="#contato">Conversar sobre o tema</a>
              </m.article>
            ))}
          </m.div>
        </RevealSection>

        <RevealSection className="section identity">
          <m.div className="identity-mark" variants={revealItem}>
            <img
              src={assetPath("assets/brand/icon-purple.png")}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width="250"
              height="250"
            />
          </m.div>
          <m.div variants={revealItem}>
            <p className="eyebrow">Identidade</p>
            <h2>Elegância sóbria, ritmo digital e presença institucional.</h2>
            <p>
              A presença visual do BRD foi pensada para comunicar confiança, clareza e
              atualidade, mantendo uma linguagem institucional consistente em todos os pontos
              de contato.
            </p>
          </m.div>
        </RevealSection>


        <RevealSection
          className="contact"
          id="contato"
          aria-labelledby="contact-title"
        >
          <m.div variants={revealItem}>
            <p className="eyebrow">Contato</p>
            <h2 id="contact-title">Vamos conversar sobre o próximo passo jurídico da sua empresa.</h2>
          </m.div>
          <m.div className="contact-actions" variants={revealItem}>
            <EmailContactLink email={contactEmail} subject={contactEmailSubject} body={contactEmailBody} />
          </m.div>
        </RevealSection>
      </main>

      <m.footer initial="hidden" whileInView="visible" viewport={sectionViewport} variants={revealGroup}>
        <m.div className="footer-brand" variants={revealItem}>
          <img
            src={assetPath("assets/brand/logo-full-light.png")}
            alt="BRD Advocacia"
            loading="lazy"
            decoding="async"
            width="172"
            height="52"
          />
          <p>Advocacia empresarial em Marília/SP, com atuação consultiva, preventiva e contenciosa.</p>
        </m.div>
        <m.div className="footer-grid" variants={revealItem}>
          <address>
            <span className="footer-kicker">Localização</span>
            Rua Sete de Setembro, n.° 1359<br />
            Senador Salgado Filho<br />
            Marília/SP, 17502-020
          </address>
          <div>
            <a
              className="footer-route"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPinIcon />
              <span>Como chegar</span>
            </a>
            <a href="tel:+5514998325395">(14) 99832-5395</a>
          </div>
          <div>
            <span className="footer-kicker">Redes sociais</span>
            <nav className="footer-social" aria-label="Redes sociais do BRD">
              {socialLinks.map((social) => (
                <a className="social-link" key={social.label} href={social.href} target="_blank" rel="noreferrer">
                  <SocialIcon type={social.icon} />
                  <span>{social.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </m.div>
      </m.footer>

      <LegalContactChat />
      </MotionConfig>
    </LazyMotion>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
