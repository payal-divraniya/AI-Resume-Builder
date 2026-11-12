import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Palette } from "lucide-react";

import ResumeForm from "../components/resume/ResumeForm";
import ResumePreview from "../components/resume/ResumePreview";
import ThemeColorPicker from "../components/templates/ThemeColorPicker";
import AISuggestions from "../components/resume/AISuggestion";

import { useResume } from "../context/ResumeContext";

function CreateResume() {
  const { resume, resumes, isMongoLoaded, createResume } = useResume();
  const draftCreatedRef = useRef(false);

  // Direct visits to /create-resume should create a draft only after loading
  // confirms that the user has no existing resumes.
  useEffect(() => {
    if (
      isMongoLoaded &&
      resumes.length === 0 &&
      !resume &&
      !draftCreatedRef.current
    ) {
      draftCreatedRef.current = true;
      createResume();
    }
  }, [isMongoLoaded, resumes.length, resume, createResume]);

  const templateNames = {
    modern: "Modern",
    professional: "Professional",
    minimal: "Minimal",
    creative: "Creative",
  };

  const selectedTemplate = templateNames[resume?.selectedTemplate] || "Modern";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==========================================
          MAIN CREATE RESUME AREA
      ========================================== */}

      <div className="grid lg:grid-cols-2">
        {/* ==========================================
            LEFT FORM PANEL
        ========================================== */}

        <div className="border-r border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            {/* PAGE HEADING */}

            <div className="mb-7 sm:mb-8">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-wide text-blue-600 sm:text-xs">
                AI RESUME BUILDER
              </span>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:mt-4 sm:text-3xl lg:text-4xl">
                Create Your Resume
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Fill in your information and see your professional resume update
                instantly.
              </p>
            </div>

            {/* ==========================================
                SELECTED TEMPLATE
            ========================================== */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mb-8 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* TEMPLATE INFORMATION */}

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm sm:h-12 sm:w-12">
                    <Check size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Selected Template
                    </p>

                    <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                      {selectedTemplate}
                    </h2>
                  </div>
                </div>

                {/* CHANGE TEMPLATE */}

                <Link
                  to="/templates"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 sm:w-auto"
                >
                  Change Template
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* ==========================================
                THEME COLOR
            ========================================== */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Palette size={18} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900">
                    Theme Color
                  </h2>

                  <p className="text-xs leading-5 text-slate-500 sm:text-sm">
                    Customize your resume appearance.
                  </p>
                </div>
              </div>

              <ThemeColorPicker />
            </div>

            {/* ==========================================
                RESUME FORM
            ========================================== */}

            <ResumeForm />

            {/* ==========================================
                AI SUGGESTIONS
            ========================================== */}

            <AISuggestions />
          </div>
        </div>

        {/* ==========================================
            RIGHT PREVIEW PANEL
        ========================================== */}

        <div className="bg-slate-100">
          <div className="h-fit px-4 py-6 sm:px-6 sm:py-8 lg:sticky lg:top-20 lg:min-h-[calc(100vh-80px)] lg:px-8 lg:py-6">
            {/* PREVIEW HEADER */}

            <div className="mx-auto mb-4 flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Live Preview</p>

                <p className="text-xs text-slate-500">
                  {selectedTemplate} Template
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Auto Updating
              </span>
            </div>

            {/* RESUME PREVIEW */}

            <div className="mx-auto w-full max-w-3xl overflow-x-auto">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateResume;
