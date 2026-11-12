import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Sparkles,
  WandSparkles,
  Palette,
  Download,
  Brain,
  Zap,
  ShieldCheck,
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Suggestions",
      description:
        "Analyze your resume and get personalized suggestions for your summary, skills, projects, experience and education.",
    },
    {
      icon: WandSparkles,
      title: "AI Rewrite",
      description:
        "Improve your resume content with professional, ATS-friendly wording while keeping your original information.",
    },
    {
      icon: Palette,
      title: "Professional Templates",
      description:
        "Choose from modern, professional, minimal and creative resume designs.",
    },
    {
      icon: Download,
      title: "PDF Download",
      description:
        "Download your completed resume as a professional PDF ready for job applications.",
    },
    {
      icon: Zap,
      title: "Live Preview",
      description:
        "See your resume update instantly while you add or edit your information.",
    },
    {
      icon: ShieldCheck,
      title: "Easy Resume Management",
      description:
        "Create, edit, duplicate and manage multiple resumes directly from your dashboard.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose a Template",
      description:
        "Select a professional resume design that matches your career style.",
    },
    {
      number: "02",
      title: "Add Your Information",
      description:
        "Enter your personal information, education, experience, skills and projects.",
    },
    {
      number: "03",
      title: "Improve With AI",
      description:
        "Analyze your resume and use AI suggestions and rewriting tools to improve your content.",
    },
    {
      number: "04",
      title: "Download & Apply",
      description:
        "Download your finished resume as a PDF and start applying for jobs.",
    },
  ];

  const templates = [
    {
      name: "Modern",
      description: "Clean & modern",
      accent: "bg-blue-600",
    },
    {
      name: "Professional",
      description: "Corporate & polished",
      accent: "bg-indigo-600",
    },
    {
      name: "Minimal",
      description: "Simple & elegant",
      accent: "bg-slate-700",
    },
    {
      name: "Creative",
      description: "Bold & attractive",
      accent: "bg-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        {/* Background Effects */}

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-14">
            {/* HERO CONTENT */}

            <div>
              <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 sm:px-4 sm:text-sm">
                <Sparkles size={16} />
                <span>AI-POWERED RESUME BUILDER</span>
              </div>

              <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build a Resume That
                <span className="block text-blue-400">Gets You Noticed.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Create a professional, ATS-friendly resume with beautiful
                templates, AI-powered suggestions and instant live preview.
              </p>

              {/* CTA BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/create-resume"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 hover:shadow-xl"
                >
                  Create My Resume
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/templates"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <FileText size={18} />
                  Explore Templates
                </Link>
              </div>

              {/* TRUST POINTS */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle size={16} className="shrink-0 text-green-400" />
                  AI Suggestions
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle size={16} className="shrink-0 text-green-400" />
                  Live Preview
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle size={16} className="shrink-0 text-green-400" />
                  PDF Download
                </div>
              </div>
            </div>

            {/* HERO RESUME VISUAL */}

            <div className="relative mt-4 px-2 sm:mt-0 sm:px-0">
              {/* Glow */}

              <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-3xl" />

              {/* Resume Card */}

              <div className="relative mx-auto w-[calc(100%-1.5rem)] max-w-md rotate-0 rounded-2xl border border-white/10 bg-white p-4 shadow-2xl sm:w-full sm:rotate-1 sm:p-7">
                {/* Resume Header */}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="h-3 w-24 rounded bg-blue-600 sm:w-28" />

                    <div className="mt-3 h-5 w-36 rounded bg-slate-800 sm:w-44" />

                    <div className="mt-2 h-3 w-24 rounded bg-slate-300 sm:w-28" />
                  </div>

                  <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 sm:h-14 sm:w-14" />
                </div>

                <div className="mt-5 h-px bg-slate-200" />

                {/* Summary */}

                <div className="mt-6">
                  <div className="mb-3 h-3 w-24 rounded bg-blue-600" />

                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-slate-200" />

                    <div className="h-2 w-11/12 rounded bg-slate-200" />

                    <div className="h-2 w-4/5 rounded bg-slate-200" />
                  </div>
                </div>

                {/* Experience */}

                <div className="mt-7">
                  <div className="mb-3 h-3 w-28 rounded bg-blue-600" />

                  <div className="flex items-center justify-between gap-3">
                    <div className="h-3 w-28 rounded bg-slate-700 sm:w-32" />

                    <div className="h-2 w-14 shrink-0 rounded bg-slate-300 sm:w-16" />
                  </div>

                  <div className="mt-2 h-2 w-24 rounded bg-slate-300" />

                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded bg-slate-200" />

                    <div className="h-2 w-10/12 rounded bg-slate-200" />
                  </div>
                </div>

                {/* Skills */}

                <div className="mt-7">
                  <div className="mb-3 h-3 w-20 rounded bg-blue-600" />

                  <div className="flex flex-wrap gap-2">
                    <span className="h-6 w-14 rounded bg-blue-50 sm:w-16" />
                    <span className="h-6 w-16 rounded bg-blue-50 sm:w-20" />
                    <span className="h-6 w-12 rounded bg-blue-50 sm:w-14" />
                    <span className="h-6 w-16 rounded bg-blue-50 sm:w-18" />
                  </div>
                </div>

                {/* AI Badge */}

                <div className="absolute -bottom-4 left-2 flex max-w-[calc(100%-1rem)] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-xl sm:-bottom-5 sm:-left-5 sm:px-4 sm:py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Sparkles size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      AI Suggestions
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      Resume improved
                    </p>
                  </div>
                </div>

                {/* Score Badge */}

                <div className="absolute -right-2 -top-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-xl sm:-right-5 sm:-top-5 sm:px-4 sm:py-3">
                  <p className="text-xs font-semibold text-slate-500">
                    Resume Score
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-blue-600">
                    85
                    <span className="text-sm text-slate-400">/100</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURES
      ========================================== */}

      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Powerful Features
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need to Build a Better Resume
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              A complete resume-building experience designed to help you create
              professional resumes faster.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS
      ========================================== */}

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Build Your Resume in Four Steps
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-5 text-4xl font-black text-blue-100">
                  {step.number}
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          TEMPLATE SHOWCASE
      ========================================== */}

      <div className="hidden md:block">
        <section className="bg-slate-950 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-blue-400">
                  Resume Templates
                </span>

                <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                  Choose a Style That Fits You
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Start with a professional design and customize your resume
                  from there.
                </p>
              </div>

              <Link
                to="/templates"
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-400 transition hover:text-blue-300 sm:self-auto"
              >
                View All Templates
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
              {templates.map((template) => (
                <Link key={template.name} to="/templates" className="group">
                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                    {/* Mini Preview */}

                    <div className="bg-slate-100 p-4 sm:p-5">
                      <div className="aspect-[1/1.35] rounded-lg bg-white p-4 shadow-md sm:p-5">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              className={`h-2.5 w-20 rounded ${template.accent}`}
                            />

                            <div className="mt-2 h-3 w-24 rounded bg-slate-800 sm:w-28" />

                            <div className="mt-2 h-2 w-14 rounded bg-slate-300 sm:w-16" />
                          </div>

                          <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200 sm:h-8 sm:w-8" />
                        </div>

                        <div className="mt-5 h-px bg-slate-200" />

                        <div className="mt-5">
                          <div
                            className={`h-2 w-16 rounded ${template.accent}`}
                          />

                          <div className="mt-3 space-y-2">
                            <div className="h-1.5 w-full rounded bg-slate-200" />
                            <div className="h-1.5 w-11/12 rounded bg-slate-200" />
                            <div className="h-1.5 w-4/5 rounded bg-slate-200" />
                          </div>
                        </div>

                        <div className="mt-6">
                          <div
                            className={`h-2 w-20 rounded ${template.accent}`}
                          />

                          <div className="mt-3 space-y-2">
                            <div className="h-1.5 w-full rounded bg-slate-200" />
                            <div className="h-1.5 w-10/12 rounded bg-slate-200" />
                            <div className="h-1.5 w-8/12 rounded bg-slate-200" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-slate-900">
                        {template.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ==========================================
          AI SECTION
      ========================================== */}

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-blue-600">
            <div className="grid items-center lg:grid-cols-2">
              <div className="p-6 sm:p-12 lg:p-14">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Sparkles size={24} />
                </div>

                <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  Let AI Help You Write a Stronger Resume
                </h2>

                <p className="mt-4 text-sm leading-7 text-blue-100 sm:text-base">
                  Analyze your resume, improve your professional summary,
                  enhance project descriptions and strengthen your experience
                  and education sections.
                </p>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3 text-sm text-white">
                    <CheckCircle size={17} className="mt-0.5 shrink-0" />
                    <span>AI Resume Analysis</span>
                  </li>

                  <li className="flex items-start gap-3 text-sm text-white">
                    <CheckCircle size={17} className="mt-0.5 shrink-0" />
                    <span>Section-wise AI Rewrite</span>
                  </li>

                  <li className="flex items-start gap-3 text-sm text-white">
                    <CheckCircle size={17} className="mt-0.5 shrink-0" />
                    <span>Resume Score & ATS Recommendations</span>
                  </li>

                  <li className="flex items-start gap-3 text-sm text-white">
                    <CheckCircle size={17} className="mt-0.5 shrink-0" />
                    <span>Apply Suggestions Directly</span>
                  </li>
                </ul>

                <Link
                  to="/create-resume"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-lg transition hover:bg-blue-50 sm:w-auto"
                >
                  Try AI Resume Builder
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* AI VISUAL */}

              <div className="hidden p-10 lg:block">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
                      <Sparkles size={19} />
                    </div>

                    <div>
                      <p className="font-bold text-white">AI Resume Analysis</p>

                      <p className="text-xs text-blue-100">
                        Analysis completed
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-blue-100">Resume Score</p>

                    <p className="mt-2 text-6xl font-black text-white">85</p>

                    <p className="text-sm text-blue-100">out of 100</p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      "Professional Summary",
                      "Skills",
                      "Projects",
                      "Experience",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center justify-between gap-3 rounded-lg bg-white/10 px-4 py-3"
                      >
                        <span className="text-sm text-white">{item}</span>

                        <span className="shrink-0 text-sm font-bold text-white">
                          {18 - index}/20
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FINAL CTA
      ========================================== */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <FileText size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ready to Build Your Resume?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Choose a professional template, add your information and use AI to
            create a resume you're confident sending to employers.
          </p>

          <Link
            to="/create-resume"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl sm:w-auto"
          >
            Create Your Resume
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
