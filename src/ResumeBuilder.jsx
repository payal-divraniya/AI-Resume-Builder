import React, { useState } from "react";
// import {
//     Sparkles, Plus, Trash2, Download, Loader2, Mail, Phone,
//     MapPin, Linkedin, Globe, X, Target, RotateCcw
// } from "lucide-react";

/* ---------------------------------------------------------- helpers */

let uidCounter = 0;
const nextId = () => `id-${++uidCounter}-${Date.now().toString(36)}`;

async function callClaude(prompt) {
    // Frontend-only implementation. Do not put a secret AI API key in Vite client code.
    // Replace this with a call to your own backend when you add one.
    await new Promise((resolve) => setTimeout(resolve, 500));

    const lower = prompt.toLowerCase();

    if (lower.includes("rewrite this resume bullet point")) {
        const original = prompt.match(/Original bullet:\s*"([\\s\\S]*?)"/i)?.[1]?.trim() || "";
        if (!original) return "Delivered measurable improvements to key business outcomes.";
        const cleaned = original.replace(/^(worked on|helped with|responsible for|did)\\s+/i, "");
        return `Improved ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
    }

    if (lower.includes("suggest 3 realistic")) {
        const role = prompt.match(/Job title:\s*(.+)/i)?.[1]?.trim() || "Professional";
        return JSON.stringify([
            `Led ${role.toLowerCase()} initiatives that improved team efficiency by 20%`,
            `Collaborated with cross-functional teams to deliver projects 15% faster`,
            `Improved key workflows while maintaining high quality and stakeholder satisfaction`,
        ]);
    }

    if (lower.includes("write a concise, compelling 2-3 sentence")) {
        const title = prompt.match(/Target title:\s*(.+)/i)?.[1]?.trim() || "Professional";
        const skillText = prompt.match(/Skills:\s*(.+)/i)?.[1]?.trim() || "professional skills";
        return `${title} with a strong foundation in ${skillText}. Experienced in delivering practical solutions, collaborating with teams, and turning requirements into measurable results.`;
    }

    if (lower.includes("expert resume editor")) {
        return JSON.stringify([
            { section: "summary", note: "Add a measurable result to make the summary more specific." },
            { section: "skills", note: "Prioritize skills that directly match the target role." },
            { section: "experience", note: "Start bullets with strong action verbs and include outcomes." },
        ]);
    }

    if (lower.includes("ats resume matching assistant")) {
        const job = prompt.match(/Job description:\s*([\\s\\S]*)$/i)?.[1] || "";
        const resumeSkills = prompt.match(/Resume skills:\s*(.+)/i)?.[1]
            ?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) || [];

        const keywords = [...new Set(
            (job.match(/\\b[a-z][a-z+#.-]{2,}\\b/gi) || [])
                .map((k) => k.toLowerCase())
                .filter((k) => !["the", "and", "with", "for", "you", "your", "our", "this", "that"].includes(k))
        )];

        const missingKeywords = keywords
            .filter((k) => !resumeSkills.some((skill) => skill.includes(k) || k.includes(skill)))
            .slice(0, 8);

        return JSON.stringify({
            matchScore: Math.max(0, Math.min(100, 100 - missingKeywords.length * 7)),
            missingKeywords,
            notes: missingKeywords.length
                ? "Add relevant missing keywords only when they genuinely match your experience."
                : "Your listed skills have good keyword coverage for this job description.",
        });
    }

    return "";
}

function parseJSON(raw) {
    if (typeof raw !== "string") throw new Error("Invalid AI response");
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = cleaned.search(/[\\[{]/);
    const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
    return JSON.parse(slice);
}

function stripQuotes(s) {
    return s.trim().replace(/^["'“”]+|["'“”]+$/g, "");
}

const emptyExperience = () => ({
    id: nextId(),
    company: "",
    title: "",
    location: "",
    start: "",
    end: "",
    current: false,
    bullets: [""],
});

const emptyEducation = () => ({
    id: nextId(),
    school: "",
    degree: "",
    field: "",
    start: "",
    end: "",
    gpa: "",
});

const SAMPLE = {
    personalInfo: {
        name: "Priya Nakamura",
        title: "Senior Product Designer",
        email: "priya.nakamura@email.com",
        phone: "(415) 555-0182",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/priyanakamura",
        website: "priyanakamura.design",
    },
    summary:
        "Product designer with 7+ years shaping consumer and B2B tools. Known for turning ambiguous problems into shipped, measurable design systems.",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping", "React", "A/B Testing"],
    experience: [
        {
            id: nextId(),
            company: "Northwind Software",
            title: "Senior Product Designer",
            location: "Remote",
            start: "2021",
            end: "",
            current: true,
            bullets: [
                "Led redesign of onboarding flow, increasing activation by 24%",
                "Built and maintained a design system adopted by 6 product teams",
            ],
        },
        {
            id: nextId(),
            company: "Fieldstone Labs",
            title: "Product Designer",
            location: "Oakland, CA",
            start: "2018",
            end: "2021",
            current: false,
            bullets: ["Designed core booking flow used by 40,000+ monthly users"],
        },
    ],
    education: [
        {
            id: nextId(),
            school: "University of Washington",
            degree: "B.A.",
            field: "Human-Centered Design & Engineering",
            start: "2014",
            end: "2018",
            gpa: "",
        },
    ],
};

/* ---------------------------------------------------------- small UI bits */

function Field({ label, children }) {
    return (
        <label style={{ display: "block", marginBottom: 12 }}>
            <span
                style={{
                    display: "block",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                    marginBottom: 5,
                }}
            >
                {label}
            </span>
            {children}
        </label>
    );
}

const inputStyle = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid var(--line)",
    borderRadius: 6,
    padding: "8px 10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13.5,
    color: "var(--ink)",
    outline: "none",
};

function TextInput(props) {
    return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

function TextArea(props) {
    return (
        <textarea
            {...props}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5, ...(props.style || {}) }}
        />
    );
}

function Btn({ children, variant = "default", small, ...rest }) {
    const base = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: small ? 12 : 13,
        padding: small ? "5px 10px" : "8px 14px",
        borderRadius: 7,
        border: "1px solid transparent",
        cursor: "pointer",
        transition: "opacity .15s ease, transform .1s ease",
    };
    const variants = {
        default: { background: "var(--ink)", color: "var(--paper)" },
        brass: { background: "var(--brass)", color: "#1C1608" },
        ghost: { background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" },
        danger: { background: "transparent", color: "var(--red)", border: "1px solid transparent" },
    };
    return (
        <button
            {...rest}
            style={{ ...base, ...variants[variant], opacity: rest.disabled ? 0.55 : 1 }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {children}
        </button>
    );
}

function Card({ title, eyebrow, right, children }) {
    return (
        <section
            style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: 18,
                marginBottom: 16,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                    {eyebrow && (
                        <div
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 10,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--brass)",
                                marginBottom: 3,
                            }}
                        >
                            {eyebrow}
                        </div>
                    )}
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                        {title}
                    </h2>
                </div>
                {right}
            </div>
            {children}
        </section>
    );
}

/* ---------------------------------------------------------- annotation dot */

function AnnoDot({ notes, open, onToggle, side = "right" }) {
    if (!notes || notes.length === 0) return null;
    return (
        <div style={{ position: "absolute", top: 2, [side === "right" ? "right" : "left"]: -14, zIndex: 5 }}>
            <button
                onClick={onToggle}
                className="no-print"
                title="AI notes"
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "1.5px solid var(--red)",
                    background: "#FDF3F1",
                    color: "var(--red)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(-6deg)",
                }}
            >
                {notes.length}
            </button>
            {open && (
                <div
                    className="no-print"
                    style={{
                        position: "absolute",
                        top: 24,
                        [side === "right" ? "left" : "right"]: 0,
                        width: 220,
                        background: "#FFFDF8",
                        border: "1px solid var(--red)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        boxShadow: "3px 4px 0 rgba(178,58,46,0.15)",
                        transform: "rotate(-1deg)",
                    }}
                >
                    {notes.map((n, i) => (
                        <p
                            key={i}
                            style={{
                                fontFamily: "'Newsreader', serif",
                                fontStyle: "italic",
                                fontSize: 12.5,
                                color: "#7A2A20",
                                margin: i === 0 ? 0 : "6px 0 0",
                                lineHeight: 1.4,
                            }}
                        >
                            — {n}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ---------------------------------------------------------- gauge */

function Gauge({ value }) {
    const angle = (Math.min(100, Math.max(0, value)) / 100) * 180;
    const r = 54;
    const cx = 64, cy = 64;
    const toXY = (deg) => {
        const rad = (Math.PI * (180 - deg)) / 180;
        return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
    };
    const [ex, ey] = toXY(angle);
    const large = angle > 180 ? 1 : 0;
    return (
        <svg width="128" height="76" viewBox="0 0 128 76">
            <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" />
            <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`}
                fill="none"
                stroke="var(--brass)"
                strokeWidth="10"
                strokeLinecap="round"
            />
            <text x={cx} y={cy - 6} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="22" fontWeight="700" fill="var(--ink)">
                {value}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="0.08em" fill="var(--ink-soft)">
                MATCH
            </text>
        </svg>
    );
}

/* ---------------------------------------------------------- main app */

export default function ResumeBuilder() {
    const [personalInfo, setPersonalInfo] = useState({
        name: "", title: "", email: "", phone: "", location: "", linkedin: "", website: "",
    });
    const [summary, setSummary] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillDraft, setSkillDraft] = useState("");
    const [experience, setExperience] = useState([emptyExperience()]);
    const [education, setEducation] = useState([emptyEducation()]);

    const [feedback, setFeedback] = useState({});
    const [openNote, setOpenNote] = useState(null);
    const [loading, setLoading] = useState({});
    const [errorMsg, setErrorMsg] = useState("");

    const [jobDescription, setJobDescription] = useState("");
    const [tailorResult, setTailorResult] = useState(null);

    const setLoad = (key, val) => setLoading((l) => ({ ...l, [key]: val }));

    const showError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(""), 4500);
    };

    const loadSample = () => {
        setPersonalInfo(SAMPLE.personalInfo);
        setSummary(SAMPLE.summary);
        setSkills(SAMPLE.skills);
        setExperience(SAMPLE.experience);
        setEducation(SAMPLE.education);
    };

    const resetAll = () => {
        setPersonalInfo({ name: "", title: "", email: "", phone: "", location: "", linkedin: "", website: "" });
        setSummary("");
        setSkills([]);
        setExperience([emptyExperience()]);
        setEducation([emptyEducation()]);
        setFeedback({});
        setTailorResult(null);
    };

    /* ---- experience ops ---- */
    const updateExp = (id, patch) =>
        setExperience((exps) => exps.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    const addExp = () => setExperience((exps) => [...exps, emptyExperience()]);
    const removeExp = (id) => setExperience((exps) => exps.filter((e) => e.id !== id));

    const addBullet = (expId) =>
        updateExp(expId, {
            bullets: [...experience.find((e) => e.id === expId).bullets, ""],
        });
    const updateBullet = (expId, idx, value) => {
        const exp = experience.find((e) => e.id === expId);
        const bullets = exp.bullets.map((b, i) => (i === idx ? value : b));
        updateExp(expId, { bullets });
    };
    const removeBullet = (expId, idx) => {
        const exp = experience.find((e) => e.id === expId);
        updateExp(expId, { bullets: exp.bullets.filter((_, i) => i !== idx) });
    };

    /* ---- education ops ---- */
    const updateEdu = (id, patch) =>
        setEducation((eds) => eds.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    const addEdu = () => setEducation((eds) => [...eds, emptyEducation()]);
    const removeEdu = (id) => setEducation((eds) => eds.filter((e) => e.id !== id));

    /* ---- skills ops ---- */
    const addSkill = () => {
        const v = skillDraft.trim();
        if (v && !skills.includes(v)) setSkills((s) => [...s, v]);
        setSkillDraft("");
    };
    const removeSkill = (v) => setSkills((s) => s.filter((x) => x !== v));

    /* ---- AI actions ---- */
    const improveBullet = async (expId, idx) => {
        const exp = experience.find((e) => e.id === expId);
        const bulletText = exp.bullets[idx];
        if (!bulletText.trim()) return;
        const key = `bullet-${expId}-${idx}`;
        setLoad(key, true);
        try {
            const prompt = `Rewrite this resume bullet point to be more impactful: start with a strong action verb, quantify impact where plausible, keep it to one line (under 25 words). Respond with ONLY the rewritten bullet text, no quotes, no preamble.\n\nRole: ${exp.title || "Unspecified role"} at ${exp.company || "the company"}\nOriginal bullet: "${bulletText}"`;
            const out = await callClaude(prompt);
            updateBullet(expId, idx, stripQuotes(out));
        } catch (e) {
            showError("Couldn't reach the AI just now — try again in a moment.");
        } finally {
            setLoad(key, false);
        }
    };

    const suggestBullets = async (expId) => {
        const exp = experience.find((e) => e.id === expId);
        const key = `suggest-${expId}`;
        setLoad(key, true);
        try {
            const prompt = `Suggest 3 realistic, impactful resume bullet points for this role. Each should start with an action verb and include a plausible quantified outcome. Respond with ONLY a JSON array of 3 strings, no fences, no preamble.\n\nJob title: ${exp.title || "Professional"}\nCompany: ${exp.company || "a company"}`;
            const out = await callClaude(prompt);
            const arr = parseJSON(out);
            const existing = exp.bullets.filter((b) => b.trim());
            updateExp(expId, { bullets: [...existing, ...arr.map(stripQuotes)] });
        } catch (e) {
            showError("Couldn't generate suggestions — try again.");
        } finally {
            setLoad(key, false);
        }
    };

    const generateSummary = async () => {
        setLoad("summary", true);
        try {
            const prompt = `Write a concise, compelling 2-3 sentence professional resume summary (no first-person "I"), based on this candidate's background. Respond with ONLY the summary text, no quotes, no preamble.\n\nTarget title: ${personalInfo.title || "Professional"}\nSkills: ${skills.join(", ") || "general professional skills"}\nExperience:\n${experience
                .map((e) => `${e.title || "Role"} at ${e.company || "Company"}: ${e.bullets.filter(Boolean).join("; ")}`)
                .join("\n")}`;
            const out = await callClaude(prompt);
            setSummary(stripQuotes(out));
        } catch (e) {
            showError("Couldn't reach the AI just now — try again in a moment.");
        } finally {
            setLoad("summary", false);
        }
    };

    const getFeedback = async () => {
        setLoad("feedback", true);
        try {
            const sectionTags = [
                '"summary"',
                '"skills"',
                ...experience.map((e) => `"experience-${e.id}"`),
                ...education.map((e) => `"education-${e.id}"`),
            ].join(", ");
            const prompt = `You are an expert resume editor. Review this resume content and give at most 5 concise, specific improvement notes (each under 18 words), each tagged to one section. Valid section tags: ${sectionTags}.\n\nTitle: ${personalInfo.title}\nSummary: ${summary}\nSkills: ${skills.join(", ")}\nExperience:\n${experience
                .map((e) => `- [experience-${e.id}] ${e.title} at ${e.company}: ${e.bullets.filter(Boolean).join(" | ")}`)
                .join("\n")}\nEducation:\n${education.map((e) => `- [education-${e.id}] ${e.degree} ${e.field} at ${e.school}`).join("\n")}\n\nRespond with ONLY a JSON array, no fences, no preamble, shaped exactly like: [{"section":"summary","note":"..."}]`;
            const out = await callClaude(prompt);
            const arr = parseJSON(out);
            const grouped = {};
            arr.forEach((item) => {
                if (!item || !item.section || !item.note) return;
                grouped[item.section] = grouped[item.section] || [];
                grouped[item.section].push(item.note);
            });
            setFeedback(grouped);
        } catch (e) {
            showError("Couldn't get AI feedback right now — try again shortly.");
        } finally {
            setLoad("feedback", false);
        }
    };

    const tailorToJob = async () => {
        if (!jobDescription.trim()) return;
        setLoad("tailor", true);
        try {
            const allBullets = experience.flatMap((e) => e.bullets.filter(Boolean));
            const prompt = `You are an ATS resume matching assistant. Compare this resume to the job description and return ONLY JSON (no fences, no preamble) in this exact shape: {"matchScore": <integer 0-100>, "missingKeywords": ["...","..."], "notes": "<one short sentence>"}.\n\nResume title: ${personalInfo.title}\nResume skills: ${skills.join(", ")}\nResume summary: ${summary}\nResume experience bullets: ${allBullets.join(" | ")}\n\nJob description:\n${jobDescription}`;
            const out = await callClaude(prompt);
            setTailorResult(parseJSON(out));
        } catch (e) {
            showError("Couldn't analyze the job description — try again.");
        } finally {
            setLoad("tailor", false);
        }
    };

    const toggleNote = (key) => setOpenNote((cur) => (cur === key ? null : key));

    const downloadPdf = () => window.print();

    const fmtRange = (start, end, current) =>
        [start, current ? "Present" : end].filter(Boolean).join(" — ");

    return (
        <div style={{ background: "var(--desk)", minHeight: "100%", fontFamily: "'Space Grotesk', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        :root {
          --desk: #1C1F1A;
          --desk-soft: #262A23;
          --paper: #F6F3EA;
          --paper-line: #E3DCC8;
          --panel: #F4F2EC;
          --line: #D9D4C6;
          --ink: #221F1A;
          --ink-soft: #6E675A;
          --red: #B23A2E;
          --brass: #A47C2B;
        }
        .app-shell input::placeholder, .app-shell textarea::placeholder { color: #A8A296; }
        .skill-chip { transition: opacity .15s ease; }
        .paper-section { position: relative; }
        @media (max-width: 900px) {
          .app-shell { grid-template-columns: 1fr !important; }
          .app-shell > div:last-child { position: static !important; }
        }
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible !important; }
          .print-area { position: absolute !important; top: 0; left: 0; width: 100%; box-shadow: none !important; transform: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>

            {/* header */}
            <div
                className="no-print"
                style={{
                    borderBottom: "1px solid var(--desk-soft)",
                    padding: "16px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* <FileEdit size={22} color="var(--brass)" /> */}
                    <div>
                        <div style={{ color: "var(--paper)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>Fair Copy</div>
                        <div style={{ color: "#9A9587", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>AI-assisted resume builder</div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Btn variant="ghost" small onClick={loadSample} style={{ color: "#D9D4C6", borderColor: "#3A3E33" }}>
                        <RotateCcw size={13} /> Load sample
                    </Btn>
                    <Btn variant="ghost" small onClick={resetAll} style={{ color: "#D9D4C6", borderColor: "#3A3E33" }}>
                        Clear all
                    </Btn>
                    <Btn variant="brass" small onClick={getFeedback} disabled={loading.feedback}>
                        {/* {loading.feedback ? <Loader2 size={13} className="spin" /> : <Sparkles size={13} />} */}
                        Get AI feedback
                    </Btn>
                    <Btn small onClick={downloadPdf}>
                        <Download size={13} /> Download PDF
                    </Btn>
                </div>
            </div>

            {errorMsg && (
                <div className="no-print" style={{ background: "#3A2420", color: "#F1B9AE", fontSize: 12.5, padding: "8px 28px" }}>
                    {errorMsg}
                </div>
            )}

            {/* main grid */}
            <div
                className="app-shell"
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(340px, 1fr) minmax(360px, 640px)",
                    gap: 24,
                    padding: 28,
                    alignItems: "start",
                }}
            >
                {/* -------- LEFT: workspace -------- */}
                <div className="no-print">
                    <Card title="Contact" eyebrow="01 — Basics">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <Field label="Full name">
                                <TextInput value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} placeholder="Jordan Ellis" />
                            </Field>
                            <Field label="Headline / Title">
                                <TextInput value={personalInfo.title} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} placeholder="Software Engineer" />
                            </Field>
                            <Field label="Email">
                                <TextInput value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="jordan@email.com" />
                            </Field>
                            <Field label="Phone">
                                <TextInput value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="(555) 012-3456" />
                            </Field>
                            <Field label="Location">
                                <TextInput value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} placeholder="Austin, TX" />
                            </Field>
                            <Field label="LinkedIn">
                                <TextInput value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} placeholder="linkedin.com/in/you" />
                            </Field>
                            <Field label="Website">
                                <TextInput value={personalInfo.website} onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })} placeholder="yoursite.com" />
                            </Field>
                        </div>
                    </Card>

                    <Card
                        title="Summary"
                        eyebrow="02 — Pitch"
                        right={
                            <Btn variant="brass" small onClick={generateSummary} disabled={loading.summary}>
                                {/* {loading.summary ? <Loader2 size={13} className="spin" /> : <Wand2 size={13} />} */}
                                {summary ? "Rewrite" : "Generate"}
                            </Btn>
                        }
                    >
                        <TextArea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A short, punchy summary of who you are professionally..." />
                    </Card>

                    <Card title="Experience" eyebrow="03 — Track record" right={<Btn variant="ghost" small onClick={addExp}><Plus size={13} /> Add role</Btn>}>
                        {experience.map((exp, i) => (
                            <div key={exp.id} style={{ borderTop: i === 0 ? "none" : "1px dashed var(--line)", paddingTop: i === 0 ? 0 : 14, marginTop: i === 0 ? 0 : 14 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    <Field label="Company">
                                        <TextInput value={exp.company} onChange={(e) => updateExp(exp.id, { company: e.target.value })} placeholder="Acme Corp" />
                                    </Field>
                                    <Field label="Job title">
                                        <TextInput value={exp.title} onChange={(e) => updateExp(exp.id, { title: e.target.value })} placeholder="Product Manager" />
                                    </Field>
                                    <Field label="Location">
                                        <TextInput value={exp.location} onChange={(e) => updateExp(exp.id, { location: e.target.value })} placeholder="Remote" />
                                    </Field>
                                    <Field label="Dates">
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                            <TextInput value={exp.start} onChange={(e) => updateExp(exp.id, { start: e.target.value })} placeholder="2022" style={{ width: "45%" }} />
                                            <span style={{ color: "var(--ink-soft)" }}>–</span>
                                            <TextInput value={exp.current ? "Present" : exp.end} disabled={exp.current} onChange={(e) => updateExp(exp.id, { end: e.target.value })} placeholder="2024" style={{ width: "45%" }} />
                                        </div>
                                    </Field>
                                </div>
                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-soft)", marginBottom: 10 }}>
                                    <input type="checkbox" checked={exp.current} onChange={(e) => updateExp(exp.id, { current: e.target.checked })} />
                                    I currently work here
                                </label>

                                <span style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 6 }}>
                                    Bullet points
                                </span>
                                {exp.bullets.map((b, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                        <TextInput value={b} onChange={(e) => updateBullet(exp.id, idx, e.target.value)} placeholder="Led a project that improved..." />
                                        <button
                                            title="Improve with AI"
                                            onClick={() => improveBullet(exp.id, idx)}
                                            disabled={loading[`bullet-${exp.id}-${idx}`]}
                                            style={{ background: "none", border: "1px solid var(--line)", borderRadius: 6, width: 32, color: "var(--brass)", cursor: "pointer" }}
                                        >
                                            {loading[`bullet-${exp.id}-${idx}`] ? <Loader2 size={13} className="spin" style={{ margin: "auto" }} /> : <Sparkles size={13} style={{ margin: "auto" }} />}
                                        </button>
                                        <button onClick={() => removeBullet(exp.id, idx)} title="Remove" style={{ background: "none", border: "none", color: "var(--ink-soft)", cursor: "pointer", width: 24 }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                    <Btn variant="ghost" small onClick={() => addBullet(exp.id)}><Plus size={12} /> Bullet</Btn>
                                    <Btn variant="ghost" small onClick={() => suggestBullets(exp.id)} disabled={loading[`suggest-${exp.id}`]}>
                                        {loading[`suggest-${exp.id}`] ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />}
                                        Suggest bullets
                                    </Btn>
                                    {experience.length > 1 && (
                                        <Btn variant="danger" small onClick={() => removeExp(exp.id)} style={{ marginLeft: "auto" }}>
                                            <Trash2 size={12} /> Remove role
                                        </Btn>
                                    )}
                                </div>
                            </div>
                        ))}
                    </Card>

                    <Card title="Education" eyebrow="04 — Background" right={<Btn variant="ghost" small onClick={addEdu}><Plus size={13} /> Add school</Btn>}>
                        {education.map((edu, i) => (
                            <div key={edu.id} style={{ borderTop: i === 0 ? "none" : "1px dashed var(--line)", paddingTop: i === 0 ? 0 : 14, marginTop: i === 0 ? 0 : 14 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    <Field label="School">
                                        <TextInput value={edu.school} onChange={(e) => updateEdu(edu.id, { school: e.target.value })} placeholder="State University" />
                                    </Field>
                                    <Field label="Degree">
                                        <TextInput value={edu.degree} onChange={(e) => updateEdu(edu.id, { degree: e.target.value })} placeholder="B.S." />
                                    </Field>
                                    <Field label="Field of study">
                                        <TextInput value={edu.field} onChange={(e) => updateEdu(edu.id, { field: e.target.value })} placeholder="Computer Science" />
                                    </Field>
                                    <Field label="Dates">
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                            <TextInput value={edu.start} onChange={(e) => updateEdu(edu.id, { start: e.target.value })} placeholder="2016" style={{ width: "45%" }} />
                                            <span style={{ color: "var(--ink-soft)" }}>–</span>
                                            <TextInput value={edu.end} onChange={(e) => updateEdu(edu.id, { end: e.target.value })} placeholder="2020" style={{ width: "45%" }} />
                                        </div>
                                    </Field>
                                </div>
                                {education.length > 1 && (
                                    <Btn variant="danger" small onClick={() => removeEdu(edu.id)}><Trash2 size={12} /> Remove</Btn>
                                )}
                            </div>
                        ))}
                    </Card>

                    <Card title="Skills" eyebrow="05 — Toolkit">
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <TextInput
                                value={skillDraft}
                                onChange={(e) => setSkillDraft(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
                                placeholder="Type a skill and press Enter"
                            />
                            <Btn variant="ghost" small onClick={addSkill}><Plus size={13} /></Btn>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {skills.map((s) => (
                                <span key={s} className="skill-chip" style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 999, padding: "4px 10px", fontSize: 12 }}>
                                    {s}
                                    <X size={11} style={{ cursor: "pointer", color: "var(--ink-soft)" }} onClick={() => removeSkill(s)} />
                                </span>
                            ))}
                            {skills.length === 0 && <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>No skills added yet.</span>}
                        </div>
                    </Card>

                    <Card title="Tailor to a job" eyebrow="06 — ATS match">
                        <TextArea rows={5} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste a job description to see your match score and missing keywords..." />
                        <div style={{ marginTop: 10 }}>
                            <Btn variant="brass" small onClick={tailorToJob} disabled={loading.tailor || !jobDescription.trim()}>
                                {loading.tailor ? <Loader2 size={13} className="spin" /> : <Target size={13} />}
                                Analyze match
                            </Btn>
                        </div>
                        {tailorResult && (
                            <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
                                <Gauge value={tailorResult.matchScore ?? 0} />
                                <div style={{ flex: 1, minWidth: 180 }}>
                                    {tailorResult.notes && <p style={{ fontSize: 12.5, color: "var(--ink)", margin: "0 0 8px" }}>{tailorResult.notes}</p>}
                                    {tailorResult.missingKeywords && tailorResult.missingKeywords.length > 0 && (
                                        <>
                                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)", marginBottom: 5 }}>Missing keywords</div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                                {tailorResult.missingKeywords.map((k) => (
                                                    <span key={k} style={{ fontSize: 11, background: "#FBF1DD", border: "1px solid #E3CE97", color: "#7A5A17", borderRadius: 999, padding: "3px 8px" }}>{k}</span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* -------- RIGHT: paper preview -------- */}
                <div style={{ position: "sticky", top: 20 }}>
                    <div
                        className="print-area"
                        style={{
                            background: "var(--paper)",
                            borderRadius: 3,
                            padding: "44px 46px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.35), 0 22px 44px rgba(0,0,0,0.45)",
                            transform: "rotate(0.4deg)",
                            fontFamily: "'Newsreader', serif",
                            color: "var(--ink)",
                            minHeight: 500,
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: 18 }}>
                            <h1 style={{ fontSize: 27, fontWeight: 600, margin: 0, letterSpacing: "0.01em" }}>
                                {personalInfo.name || "Your Name"}
                            </h1>
                            {personalInfo.title && (
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-soft)", marginTop: 4 }}>
                                    {personalInfo.title}
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 14px", marginTop: 10, fontSize: 11.5, color: "var(--ink-soft)" }}>
                                {personalInfo.email && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Mail size={11} />{personalInfo.email}</span>}
                                {personalInfo.phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Phone size={11} />{personalInfo.phone}</span>}
                                {personalInfo.location && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{personalInfo.location}</span>}
                                {personalInfo.linkedin && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Linkedin size={11} />{personalInfo.linkedin}</span>}
                                {personalInfo.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Globe size={11} />{personalInfo.website}</span>}
                            </div>
                        </div>

                        {summary && (
                            <div className="paper-section" style={{ marginBottom: 20 }}>
                                <AnnoDot notes={feedback.summary} open={openNote === "summary"} onToggle={() => toggleNote("summary")} />
                                <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{summary}</p>
                            </div>
                        )}

                        {experience.some((e) => e.company || e.title) && (
                            <div style={{ marginBottom: 20 }}>
                                <SectionHeading>Experience</SectionHeading>
                                {experience.map((exp) =>
                                    exp.company || exp.title ? (
                                        <div key={exp.id} className="paper-section" style={{ marginBottom: 14 }}>
                                            <AnnoDot notes={feedback[`experience-${exp.id}`]} open={openNote === `experience-${exp.id}`} onToggle={() => toggleNote(`experience-${exp.id}`)} />
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                                                <span style={{ fontWeight: 600, fontSize: 14.5 }}>{exp.title || "Job Title"}{exp.company ? `, ${exp.company}` : ""}</span>
                                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--ink-soft)" }}>{fmtRange(exp.start, exp.end, exp.current)}</span>
                                            </div>
                                            {exp.location && <div style={{ fontSize: 11.5, color: "var(--ink-soft)", fontStyle: "italic", marginBottom: 4 }}>{exp.location}</div>}
                                            <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                                                {exp.bullets.filter(Boolean).map((b, i) => (
                                                    <li key={i} style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 2 }}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}

                        {education.some((e) => e.school || e.degree) && (
                            <div style={{ marginBottom: 20 }}>
                                <SectionHeading>Education</SectionHeading>
                                {education.map((edu) =>
                                    edu.school || edu.degree ? (
                                        <div key={edu.id} className="paper-section" style={{ marginBottom: 8 }}>
                                            <AnnoDot notes={feedback[`education-${edu.id}`]} open={openNote === `education-${edu.id}`} onToggle={() => toggleNote(`education-${edu.id}`)} />
                                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                                                <span style={{ fontSize: 13.5 }}>
                                                    <strong>{edu.degree}{edu.field ? `, ${edu.field}` : ""}</strong> — {edu.school}
                                                </span>
                                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--ink-soft)" }}>{fmtRange(edu.start, edu.end, false)}</span>
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}

                        {skills.length > 0 && (
                            <div className="paper-section">
                                <AnnoDot notes={feedback.skills} open={openNote === "skills"} onToggle={() => toggleNote("skills")} />
                                <SectionHeading>Skills</SectionHeading>
                                <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>{skills.join("  ·  ")}</p>
                            </div>
                        )}

                        {!personalInfo.name && !summary && skills.length === 0 && !experience.some((e) => e.company) && (
                            <p style={{ textAlign: "center", color: "var(--ink-soft)", fontStyle: "italic", fontSize: 13, marginTop: 40 }}>
                                Fill in the form on the left — your resume will take shape here as you type.
                            </p>
                        )}
                    </div>
                    <p className="no-print" style={{ textAlign: "center", fontSize: 11, color: "#7C7768", marginTop: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                        Red circles mark AI editorial notes · nothing here is saved between sessions
                    </p>
                </div>
            </div>

            <style>{`.spin { animation: spin 0.9s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function SectionHeading({ children }) {
    return (
        <div
            style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--brass)",
                borderBottom: "1px solid var(--paper-line)",
                paddingBottom: 4,
                marginBottom: 8,
            }}
        >
            {children}
        </div>
    );
}