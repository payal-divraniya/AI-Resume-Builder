import { Link } from "react-router-dom";
import { ArrowRight, Check, FileText, Sparkles } from "lucide-react";

import { useResume } from "../context/ResumeContext";

function Templates() {
  const { resume, updateResume } = useResume();

  const templates = [
    {
      id: "modern",
      name: "Modern",
      description:
        "A clean and modern design perfect for frontend developers and tech professionals.",
      color: "blue",
      preview: {
        accent: "bg-blue-600",
        heading: "text-blue-600",
        line: "bg-blue-100",
      },
    },
    {
      id: "professional",
      name: "Professional",
      description:
        "A structured and polished layout designed for corporate and professional roles.",
      color: "indigo",
      preview: {
        accent: "bg-indigo-600",
        heading: "text-indigo-600",
        line: "bg-indigo-100",
      },
    },
    {
      id: "minimal",
      name: "Minimal",
      description:
        "A simple, elegant and distraction-free resume focused on your content.",
      color: "slate",
      preview: {
        accent: "bg-slate-700",
        heading: "text-slate-700",
        line: "bg-slate-200",
      },
    },
    {
      id: "creative",
      name: "Creative",
      description:
        "A visually attractive design for developers, designers and creative professionals.",
      color: "purple",
      preview: {
        accent: "bg-purple-600",
        heading: "text-purple-600",
        line: "bg-purple-100",
      },
    },
  ];

  const handleSelectTemplate = (templateId) => {
    if (!resume) return;
    updateResume({
      ...resume,
      selectedTemplate: templateId,
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ==========================================
          HERO
      ========================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl sm:h-64 sm:w-64" />

        <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-purple-100/60 blur-3xl sm:h-64 sm:w-64" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          {/* BADGE */}

          <div className="mb-5 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-600 sm:px-4 sm:text-sm">
            <Sparkles size={15} className="shrink-0" />
            <span>PROFESSIONAL RESUME TEMPLATES</span>
          </div>

          {/* HEADING */}

          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Choose a Resume Template
            <span className="block text-blue-600">That Gets You Noticed</span>
          </h1>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-lg sm:leading-7">
            Select a professionally designed template and create a modern resume
            that highlights your skills, experience and projects.
          </p>
        </div>
      </section>

      {/* ==========================================
          TEMPLATE GRID
      ========================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* SECTION HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 sm:text-sm">
              4 Professional Designs
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-3xl">
              Pick your favorite style
            </h2>

            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              You can change your template anytime.
            </p>
          </div>

          <Link
            to="/create-resume"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 sm:w-auto"
          >
            Create Resume
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* ==========================================
            TEMPLATE CARDS
        ========================================== */}

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {templates.map((template) => {
            const isSelected = resume?.selectedTemplate === template.id;

            return (
              <div
                key={template.id}
                className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-slate-200"
                }`}
              >
                {/* ==================================
                    TEMPLATE PREVIEW
                ================================== */}

                <div className="relative bg-slate-100 p-4 sm:p-8">
                  {/* SELECTED BADGE */}

                  {isSelected && (
                    <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-md sm:right-6 sm:top-6 sm:px-3 sm:text-xs">
                      <Check size={13} />
                      Selected
                    </div>
                  )}

                  {/* MINI RESUME */}

                  <div className="mx-auto aspect-[1/1.414] w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
                    <div className="p-4 sm:p-8">
                      {/* RESUME HEADER */}

                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <div
                            className={`mb-2 h-3 w-24 rounded sm:h-4 sm:w-32 ${template.preview.accent}`}
                          />

                          <div className="h-2 w-36 rounded bg-slate-800 sm:w-48" />

                          <div className="mt-2 h-1.5 w-24 rounded bg-slate-300 sm:h-2 sm:w-32" />
                        </div>

                        <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200 sm:h-12 sm:w-12" />
                      </div>

                      <div className="mt-4 h-px bg-slate-200 sm:mt-5" />

                      {/* SUMMARY */}

                      <div className="mt-4 sm:mt-6">
                        <div
                          className={`mb-3 h-2 w-20 rounded sm:h-2.5 sm:w-24 ${template.preview.accent}`}
                        />

                        <div className="space-y-2">
                          <div className="h-1.5 w-full rounded bg-slate-200 sm:h-2" />
                          <div className="h-1.5 w-11/12 rounded bg-slate-200 sm:h-2" />
                          <div className="h-1.5 w-4/5 rounded bg-slate-200 sm:h-2" />
                        </div>
                      </div>

                      {/* EXPERIENCE */}

                      <div className="mt-5 sm:mt-7">
                        <div
                          className={`mb-3 h-2 w-24 rounded sm:h-2.5 sm:w-28 ${template.preview.accent}`}
                        />

                        <div className="mb-3 sm:mb-4">
                          <div className="flex justify-between gap-2">
                            <div className="h-1.5 w-24 rounded bg-slate-700 sm:h-2 sm:w-28" />

                            <div className="h-1.5 w-12 shrink-0 rounded bg-slate-200 sm:h-2 sm:w-16" />
                          </div>

                          <div className="mt-2 h-1.5 w-20 rounded bg-slate-300 sm:h-2 sm:w-24" />

                          <div className="mt-3 space-y-1.5">
                            <div className="h-1 w-full rounded bg-slate-200 sm:h-1.5" />
                            <div className="h-1 w-11/12 rounded bg-slate-200 sm:h-1.5" />
                            <div className="h-1 w-4/5 rounded bg-slate-200 sm:h-1.5" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between gap-2">
                            <div className="h-1.5 w-20 rounded bg-slate-700 sm:h-2 sm:w-24" />

                            <div className="h-1.5 w-12 shrink-0 rounded bg-slate-200 sm:h-2 sm:w-16" />
                          </div>

                          <div className="mt-2 h-1.5 w-24 rounded bg-slate-300 sm:h-2 sm:w-28" />

                          <div className="mt-3 space-y-1.5">
                            <div className="h-1 w-full rounded bg-slate-200 sm:h-1.5" />
                            <div className="h-1 w-10/12 rounded bg-slate-200 sm:h-1.5" />
                          </div>
                        </div>
                      </div>

                      {/* SKILLS */}

                      <div className="mt-5 sm:mt-7">
                        <div
                          className={`mb-3 h-2 w-16 rounded sm:h-2.5 sm:w-20 ${template.preview.accent}`}
                        />

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <div
                            className={`h-4 w-11 rounded sm:h-5 sm:w-14 ${template.preview.line}`}
                          />

                          <div
                            className={`h-4 w-16 rounded sm:h-5 sm:w-20 ${template.preview.line}`}
                          />

                          <div
                            className={`h-4 w-13 rounded sm:h-5 sm:w-16 ${template.preview.line}`}
                          />

                          <div
                            className={`h-4 w-10 rounded sm:h-5 sm:w-12 ${template.preview.line}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==================================
                    TEMPLATE INFO
                ================================== */}

                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                        {template.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {template.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${template.preview.accent} text-white sm:h-10 sm:w-10`}
                    >
                      <FileText size={18} />
                    </div>
                  </div>

                  {/* SELECT BUTTON */}

                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={17} />
                        Selected Template
                      </>
                    ) : (
                      <>
                        Use This Template
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          BOTTOM CTA
      ========================================== */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Sparkles size={26} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-3xl">
            Ready to build your resume?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Choose a template and let our AI help you improve your resume
            content.
          </p>

          <Link
            to="/create-resume"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg sm:w-auto"
          >
            Start Creating
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Templates;
