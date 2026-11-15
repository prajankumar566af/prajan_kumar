import { useCallback, useEffect, useRef, useState } from "react";
import * as L from "lucide-react";
import { api, parseError } from "./services/api";
import { useApi } from "./services/useApi";
import NeuralCanvas from "./components/NeuralCanvas";

const PROFILE_IMAGE = null; // e.g. "/profile.jpg" (put the file in /public) to replace the placeholder
const NAV = [["home", "Home"], ["about", "About"], ["skills", "Skills"], ["projects", "Projects"], ["experience", "Experience"], ["achievements", "Achievements"], ["contact", "Contact"]];
const ICONS = { code: L.Code2, globe: L.Globe, database: L.Database, brain: L.Brain, eye: L.Eye, terminal: L.Terminal, wrench: L.Wrench };
const EMAIL = "ballujaishree@gmail.com", LINKEDIN = "https://linkedin.com/in/jai-shree-p-ba6438374", GITHUB = "https://github.com/ballujaishree-lgtm";

/** Renders loading / error / empty states, then children(data). */
function Async({ state, children, empty = "Nothing has been added here yet." }) {
  if (state.loading) return <div className="grid"><div className="skel" /><div className="skel" /><div className="skel" /></div>;
  if (state.error) return <div className="state" role="alert">Could not load this section. Check that the API is running.<br /><button className="btn" style={{ marginTop: 14 }} onClick={state.reload}>Try again</button></div>;
  if (state.isEmpty) return <div className="state">{empty}</div>;
  return children(state.data);
}

function Section({ id, title, lead, alt, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (ref.current.querySelector(".reveal").classList.add("in"), io.disconnect()), { threshold: .12 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} className={alt ? "alt" : ""}>
      <div className="wrap reveal"><h2>{title}</h2>{lead && <p className="lead">{lead}</p>}{children}</div>
    </section>
  );
}

function Nav({ resume }) {
  const [open, setOpen] = useState(false), [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  const file = resume.data?.file;
  return (
    <nav className="glass"><div className="wrap">
      <a href="#home" className="logo" aria-label="JSP, back to top">JSP</a>
      <div className={`links ${open ? "open" : ""}`}>
        {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="btn primary" href={file || undefined} download aria-disabled={!file} title={file ? "Download resume" : "Resume not uploaded yet"}><L.Download size={16} />Resume</a>
      </div>
      <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <L.X /> : <L.Menu />}</button>
    </div></nav>
  );
}

function Hero() {
  const d = (n) => ({ className: "in-seq", style: { animationDelay: `${n}ms` } });
  return (
    <header id="home" className="hero"><NeuralCanvas />
      <div className="wrap">
        <div>
          <div {...d(0)}><span className="status glass"><i />Currently working as an ML Intern @ Flyrank.</span></div>
          <h1 {...d(120)}>Hi, I'm Jaishree.<span>Building Intelligent Solutions Through AI &amp; Machine Learning.</span></h1>
          <p className="sub in-seq" style={{ animationDelay: "260ms" }}>Computer Science and AI/ML undergraduate passionate about Machine Learning, Computer Vision, and building technology that solves real-world problems.</p>
          <div className="cta in-seq" style={{ animationDelay: "380ms" }}>
            <a className="btn primary" href="#projects">Explore My Projects</a><a className="btn" href="#contact">Contact Me</a>
          </div>
        </div>
        <div className="portrait in-seq" style={{ animationDelay: "300ms" }}>
          {PROFILE_IMAGE ? <img src={PROFILE_IMAGE} alt="Jai Shree P" /> : <><b>JSP</b><small>Replace with your photograph</small></>}
        </div>
      </div>
      <a href="#about" className="scroll" aria-label="Scroll to About"><L.ChevronDown /></a>
    </header>
  );
}

function About({ resume }) {
  const r = resume.data, perf = r?.academic_performance || [];
  const delta = perf.length > 1 ? (perf.at(-1).sgpa - perf[0].sgpa).toFixed(2) : null;
  return (
    <Section id="about" title="Beyond the Code">
      <div className="two">
        <div className="about">
          <p>I am Jaishree, a second-year B.Tech student specializing in Computer Science and Engineering with Artificial Intelligence and Machine Learning at Jain University.</p>
          <p>I am passionate about Artificial Intelligence, Machine Learning, and emerging technologies. I have hands-on experience developing individual projects involving web development, computer vision, and AI-based applications.</p>
          <p>I am currently working as a Machine Learning Intern at Flyrank, where I am developing my technical knowledge and practical skills.</p>
          <p>I aspire to become a skilled Machine Learning Engineer and contribute to innovative technology solutions.</p>
          <div className="card" style={{ marginTop: 24 }}><h3 style={{ marginBottom: 8 }}>Career objective</h3>
            <p style={{ margin: 0 }}>To build a successful career as a Machine Learning Engineer by continuously developing my technical expertise, gaining practical industry experience, and applying Artificial Intelligence and Machine Learning techniques to solve real-world problems.</p></div>
        </div>
        <div className="card">
          <h3>Education</h3>
          <div className="facts" style={{ marginTop: 18 }}>
            <div><span>Degree</span><b>B.Tech, CSE (AIML)</b></div><div><span>University</span><b>Jain University</b></div>
            <div><span>Status</span><b>Currently pursuing, second year</b></div><div><span>Internship</span><b>ML Intern, Flyrank</b></div>
          </div>
          <div className="sgpa">
            {resume.loading ? <div className="skel" style={{ height: 90 }} /> : resume.error ? <p className="err">Academic results could not be loaded.</p> : perf.map((p) => (
              <div key={p.semester}><div className="row"><span>{p.semester}</span><b>SGPA {Number(p.sgpa).toFixed(2)}</b></div><div className="bar"><i style={{ width: `${p.sgpa * 10}%` }} /></div></div>
            ))}
            {delta > 0 && <p className="up">+{delta} SGPA from first to second semester</p>}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Skills() {
  const s = useApi(api.skills);
  return (
    <Section id="skills" alt title="Technical skills" lead="The languages, frameworks and tools I use in my projects.">
      <Async state={s}>{(cats) => <div className="grid">{cats.map((c) => { const I = ICONS[c.icon] || L.Sparkles; return (
        <div className="card skill" key={c.id}><h3><I size={20} />{c.name}</h3><ul>{c.skills.map((k) => <li key={k.id}>{k.name}</li>)}</ul></div>); })}</div>}</Async>
      <div className="soft">{[["Communication", "Explaining ideas clearly"], ["Teamwork", "Building with others"], ["Problem-solving", "Breaking hard problems down"]].map(([a, b]) => <div key={a}><b>{a}</b>{b}</div>)}</div>
    </Section>
  );
}

const Links = ({ p }) => (
  <div className="links2">
    <a className="btn" href={p.github_url || undefined} target="_blank" rel="noreferrer" aria-disabled={!p.github_url}><L.Github size={16} />{p.github_url ? "GitHub" : "GitHub soon"}</a>
    <a className="btn" href={p.live_demo_url || undefined} target="_blank" rel="noreferrer" aria-disabled={!p.live_demo_url}><L.ExternalLink size={16} />{p.live_demo_url ? "Live demo" : "Demo soon"}</a>
  </div>
);

function ProjectModal({ slug, onClose }) {
  const st = useApi(useCallback(() => api.project(slug), [slug]));
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [onClose]);
  const p = st.data;
  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="Project details">
      <div className="card sheet" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close"><L.X size={18} /></button>
        {st.loading ? <div className="skel" style={{ height: 320 }} /> : st.error ? <div className="state">Could not load this project.</div> : <>
          <div className="cover" style={{ background: p.cover_gradient }}>{String(p.number).padStart(2, "0")}</div>
          <div className="body"><h3 style={{ fontSize: "1.6rem" }}>{p.title}</h3><p>{p.description}</p>
            <div className="badges">{p.technologies.map((t) => <span className="badge" key={t}>{t}</span>)}</div><Links p={p} /></div></>}
      </div>
    </div>
  );
}

function Projects() {
  const s = useApi(api.projects), [open, setOpen] = useState(null);
  return (
    <Section id="projects" title="Projects" lead="Applications I have built across web development and computer vision.">
      <Async state={s}>{(list) => <div className="grid">{list.map((p) => (
        <article className="card proj" key={p.id}>
          <div className="cover" style={{ background: p.cover_gradient || "var(--bg2)" }}>{String(p.number).padStart(2, "0")}</div>
          <div className="body"><h3>{p.title}</h3><p>{p.short_description}</p>
            <div className="badges">{p.technologies.map((t) => <span className="badge" key={t}>{t}</span>)}</div>
            <div className="links2"><button className="btn primary" onClick={() => setOpen(p.slug)}>View details</button></div></div>
        </article>))}</div>}</Async>
      {open && <ProjectModal slug={open} onClose={() => setOpen(null)} />}
    </Section>
  );
}

function Experience() {
  const s = useApi(api.experience);
  return (
    <Section id="experience" alt title="Experience">
      <Async state={s} empty="Experience will appear here once added in the admin.">{(list) => list.map((e) => (
        <div className="tl" key={e.id}><div className="card exp">
          <span className="live">{e.is_current ? "● " : ""}{e.status_label}</span>
          <h3>{e.position}</h3><b style={{ color: "var(--s)" }}>{e.organization}</b><p>{e.description}</p>
          <div className="badges">{["Machine Learning", "Python"].map((t) => <span className="badge" key={t}>{t}</span>)}</div>
        </div></div>))}</Async>
    </Section>
  );
}

function Achievements() {
  const a = useApi(api.achievements), c = useApi(api.certifications);
  return (
    <Section id="achievements" title="Hackathons &amp; certifications">
      <Async state={a}>{(list) => list.map((h) => (
        <div className="card feat" key={h.id}><h3 style={{ fontSize: "1.5rem" }}>{h.title}</h3><b style={{ color: "var(--s)" }}>{h.project_name}</b>
          <dl>{[["Problem statement ID", h.problem_statement_id], ["Theme", h.theme], ["Category", h.category], ["Team", h.team_name], ["Team ID", h.team_id]].filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <p style={{ color: "var(--t2)" }}>{h.description}</p></div>))}</Async>
      <Async state={c} empty="Certifications will appear here once added.">{(list) => list.map((x) => (
        <div className="card cert" key={x.id}>
          <div className="ph">{x.certificate_file ? <img src={x.certificate_file} alt={`${x.title} certificate`} /> : "Certificate image placeholder"}</div>
          <div><h3>{x.title}</h3><b style={{ color: "var(--s)" }}>{x.issuer}</b><p style={{ color: "var(--t2)", margin: "10px 0 16px" }}>{x.description}</p>
            <a className="btn" href={x.credential_url || undefined} target="_blank" rel="noreferrer" aria-disabled={!x.credential_url}><L.BadgeCheck size={16} />{x.credential_url ? "View credential" : "Credential link soon"}</a></div>
        </div>))}</Async>
    </Section>
  );
}

function Interests() {
  return (
    <section className="interests"><div className="wrap"><h2 style={{ fontSize: "1.8rem" }}>Away from the keyboard</h2>
      <div className="pills">{["Writing", "Drawing", "Listening to Music", "Playing Badminton"].map((i) => <span key={i}>{i}</span>)}</div></div></section>
  );
}

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };
function Contact() {
  const [f, setF] = useState(EMPTY), [errs, setErrs] = useState({}), [status, setStatus] = useState({ s: "idle" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const check = () => {
    const e = {};
    if (f.name.trim().length < 2) e.name = "Enter your name (2+ characters).";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (f.subject.trim().length < 3) e.subject = "Add a subject (3+ characters).";
    if (f.message.trim().length < 10) e.message = "Write at least 10 characters.";
    return e;
  };
  const submit = async (ev) => {
    ev.preventDefault();
    const e = check(); setErrs(e); if (Object.keys(e).length) return;
    setStatus({ s: "sending" });
    try { const r = await api.sendContact(f); setStatus({ s: "ok", m: r.detail }); setF(EMPTY); }
    catch (err) { const p = parseError(err); setErrs(Object.fromEntries(Object.entries(p.fieldErrors).map(([k, v]) => [k, [].concat(v)[0]]))); setStatus({ s: "err", m: p.message }); }
  };
  const field = (k, label, Tag = "input", extra = {}) => (
    <label>{label}<Tag value={f[k]} onChange={set(k)} aria-invalid={!!errs[k]} {...extra} />{errs[k] && <span className="err">{errs[k]}</span>}</label>);
  return (
    <Section id="contact" alt title="Have an Idea? Let's Build Something Intelligent." lead="I'm always interested in connecting with people, exploring new technologies, and collaborating on meaningful projects.">
      <div className="contact-grid">
        <div className="chan">
          {[[L.Mail, "Email", EMAIL, `mailto:${EMAIL}`], [L.Linkedin, "LinkedIn", "jai-shree-p", LINKEDIN], [L.Github, "GitHub", "ballujaishree-lgtm", GITHUB]].map(([I, a, b, h]) => (
            <a className="card" key={a} href={h} target={a === "Email" ? undefined : "_blank"} rel="noreferrer"><I color="#54C8FF" /><span><b>{a}</b><br /><span style={{ color: "var(--t2)", fontSize: ".9rem" }}>{b}</span></span></a>))}
        </div>
        <form className="card" onSubmit={submit} noValidate>
          {field("name", "Name", "input", { autoComplete: "name" })}{field("email", "Email", "input", { type: "email", autoComplete: "email" })}
          {field("subject", "Subject")}{field("message", "Message", "textarea", { rows: 5 })}
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} name="website" />
          <button className="btn primary" disabled={status.s === "sending"} style={{ justifySelf: "start" }}><L.Send size={16} />{status.s === "sending" ? "Sending…" : "Send message"}</button>
          {status.s === "ok" && <p className="note ok" role="status">{status.m}</p>}
          {status.s === "err" && <p className="note bad" role="alert">{status.m}</p>}
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer><div className="wrap">
      <div><b className="logo" style={{ color: "var(--t)" }}>JSP – Jaishree P</b><p>Designed with curiosity. Built with technology.</p><small>© {new Date().getFullYear()} Jai Shree P</small></div>
      <nav aria-label="Footer">{NAV.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
      <div className="soc"><a href={GITHUB} aria-label="GitHub"><L.Github /></a><a href={LINKEDIN} aria-label="LinkedIn"><L.Linkedin /></a><a href={`mailto:${EMAIL}`} aria-label="Email"><L.Mail /></a></div>
    </div></footer>
  );
}

export default function App() {
  const resume = useApi(api.resume); // a 404 here just means no resume record yet
  return (<><Nav resume={resume} /><main><Hero /><About resume={resume} /><Skills /><Projects /><Experience /><Achievements /><Interests /><Contact /></main><Footer /></>);
}
