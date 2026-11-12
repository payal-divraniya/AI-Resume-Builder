import { useCallback, useState } from "react";
import { Sparkles, CheckCircle, WandSparkles } from "lucide-react";

import { useResume } from "../../context/ResumeContext";
import Toast from "../Toast";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function AISuggestions() {
  const { resume, updatePersonalInfo, updateResume } = useResume();

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [analysisProvider, setAnalysisProvider] = useState("");
  const [rewriteProviders, setRewriteProviders] = useState({});
  const [rewriteLoading, setRewriteLoading] = useState({});
  const [rewriteResults, setRewriteResults] = useState({});
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const closeToast = useCallback(() => {
    setToast({ message: "", type: "success" });
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ANALYZE RESUME WITH TIMEOUT + RESPONSE VALIDATION
  const analyzeResume = async () => {
    if (loading) return;

    if (!resume) {
      showToast("Your resume is still loading. Please try again.", "error");
      return;
    }

    const controller = new AbortController();
    let timeoutId;

    try {
      setLoading(true);
      setSuggestions(null);
      setAnalysisProvider("");
      timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("resumeAI_token") || ""}`,
        },
        body: JSON.stringify(resume),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `AI analysis failed (${response.status}).`,
        );
      }

      if (!data.suggestions || typeof data.suggestions !== "object") {
        throw new Error(
          "The server responded, but no suggestions were returned. Check the backend response format.",
        );
      }

      setSuggestions(data.suggestions);
      setAnalysisProvider(data.provider || "unknown");
      showToast(
        data.provider === "local"
          ? "Offline resume suggestions generated."
          : "Resume analyzed successfully!",
      );
    } catch (error) {
      console.error("AI analysis error:", error);
      setSuggestions(null);

      if (error.name === "AbortError") {
        showToast(
          "AI analysis timed out after 120 seconds. Check your backend and Groq API.",
          "error",
        );
      } else {
        showToast(
          error.message ||
            "AI analysis failed. Please check your backend server.",
          "error",
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // AI REWRITE
  const rewriteWithAI = async (type, content, key) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 70000);
    try {
      setRewriteLoading((prev) => ({
        ...prev,
        [key]: true,
      }));

      setRewriteResults((prev) => ({
        ...prev,
        [key]: null,
      }));

      const response = await fetch(`${API_BASE_URL}/api/ai/rewrite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("resumeAI_token") || ""}`,
        },
        body: JSON.stringify({
          type,
          content,
          targetRole: resume?.personalInfo?.jobTitle || "",
        }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "AI rewrite failed.");
      }

      if (!data.rewritten) {
        throw new Error("AI did not return rewritten content.");
      }

      setRewriteResults((prev) => ({
        ...prev,
        [key]: data.rewritten,
      }));
      setRewriteProviders((prev) => ({
        ...prev,
        [key]: data.provider || "unknown",
      }));

      showToast(
        data.provider === "local"
          ? "Local offline rewrite completed."
          : "AI rewrite completed successfully!",
      );
    } catch (error) {
      console.error(`Groq ${type} rewrite error:`, error);

      showToast(
        error.name === "AbortError"
          ? "Rewrite timed out. Please try again."
          : error.message ||
              "AI rewrite failed. Please check that the backend is running.",
        "error",
      );
    } finally {
      clearTimeout(timeoutId);
      setRewriteLoading((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  };

  // APPLY SUMMARY
  const applySummary = () => {
    const suggested = suggestions?.summary?.suggested;

    if (!suggested) {
      showToast("No summary suggestion is available.", "error");
      return;
    }

    updatePersonalInfo("summary", suggested);
    showToast("AI summary applied successfully!");
  };

  // APPLY REWRITTEN SUMMARY
  const applyRewrittenSummary = () => {
    const rewritten = rewriteResults.summary;

    if (!rewritten) return;

    updatePersonalInfo("summary", rewritten);

    setRewriteResults((prev) => ({
      ...prev,
      summary: null,
    }));

    showToast("Rewritten summary applied successfully!");
  };

  // APPLY SKILLS
  const applySkills = () => {
    const suggested = suggestions?.skills?.suggested;

    if (!suggested?.length) return;

    const currentSkills = resume.skills || [];

    const updatedSkills = suggested
      .map((skillName) => {
        const normalizedName = String(skillName || "").trim();
        const existingSkill = currentSkills.find((skill) => {
          const existingName = typeof skill === "string" ? skill : skill?.name;
          return (
            String(existingName || "")
              .trim()
              .toLowerCase() === normalizedName.toLowerCase()
          );
        });

        return {
          ...(existingSkill && typeof existingSkill === "object"
            ? existingSkill
            : {}),
          id:
            existingSkill?.id ||
            `skill-${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name: normalizedName,
          level: existingSkill?.level || "Intermediate",
        };
      })
      .filter((skill) => skill.name);

    updateResume({
      ...resume,
      skills: updatedSkills,
    });

    showToast("AI skills suggestions applied successfully!");
  };

  // APPLY PROJECT SUGGESTIONS
  const applyProjects = () => {
    const suggested = suggestions?.projects?.suggested;

    if (!suggested?.length) return;

    const updatedProjects = (resume.projects || []).map((project) => {
      const suggestedProject = suggested.find(
        (item) => String(item.id) === String(project.id),
      );

      if (!suggestedProject) return project;

      return {
        ...project,
        name: suggestedProject.name || project.name,
        technologies: suggestedProject.technologies || project.technologies,
        description: suggestedProject.description || project.description,
        projectUrl: project.projectUrl,
        githubUrl: project.githubUrl,
      };
    });

    updateResume({
      ...resume,
      projects: updatedProjects,
    });

    showToast("AI project suggestions applied successfully!");
  };

  // APPLY EXPERIENCE SUGGESTIONS
  const applyExperience = () => {
    const suggested = suggestions?.experience?.suggested;

    if (!suggested?.length) return;

    const updatedExperience = (resume.experience || []).map((experience) => {
      const suggestedExperience = suggested.find(
        (item) => String(item.id) === String(experience.id),
      );

      if (!suggestedExperience) return experience;

      return {
        ...experience,
        jobTitle: suggestedExperience.jobTitle || experience.jobTitle,
        company: experience.company,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: suggestedExperience.description || experience.description,
      };
    });

    updateResume({
      ...resume,
      experience: updatedExperience,
    });

    showToast("AI experience suggestions applied successfully!");
  };

  // APPLY EDUCATION SUGGESTIONS
  const applyEducation = () => {
    const suggested = suggestions?.education?.suggested;

    if (!suggested?.length) return;

    const updatedEducation = (resume.education || []).map((education) => {
      const suggestedEducation = suggested.find(
        (item) => String(item.id) === String(education.id),
      );

      if (!suggestedEducation) return education;

      return {
        ...education,
        degree: suggestedEducation.degree || education.degree,
        institution: education.institution,
        startYear: education.startYear,
        endYear: education.endYear,
        description: suggestedEducation.description || education.description,
      };
    });

    updateResume({
      ...resume,
      education: updatedEducation,
    });

    showToast("AI education suggestions applied successfully!");
  };

  // APPLY REWRITTEN PROJECT
  const applyRewrittenProject = (projectId) => {
    const key = `project-${projectId}`;
    const rewritten = rewriteResults[key];

    if (!rewritten) return;

    const updatedProjects = (resume.projects || []).map((project) =>
      String(project.id) === String(projectId)
        ? {
            ...project,
            name: rewritten.name || project.name,
            technologies: rewritten.technologies || project.technologies,
            description: rewritten.description || project.description,
            projectUrl: project.projectUrl,
            githubUrl: project.githubUrl,
          }
        : project,
    );

    updateResume({
      ...resume,
      projects: updatedProjects,
    });

    setRewriteResults((prev) => ({
      ...prev,
      [key]: null,
    }));

    showToast("Rewritten project applied successfully!");
  };

  // APPLY REWRITTEN EXPERIENCE
  const applyRewrittenExperience = (experienceId) => {
    const key = `experience-${experienceId}`;
    const rewritten = rewriteResults[key];

    if (!rewritten) return;

    const updatedExperience = (resume.experience || []).map((experience) =>
      String(experience.id) === String(experienceId)
        ? {
            ...experience,
            jobTitle: rewritten.jobTitle || experience.jobTitle,
            company: experience.company,
            location: experience.location,
            startDate: experience.startDate,
            endDate: experience.endDate,
            description: rewritten.description || experience.description,
          }
        : experience,
    );

    updateResume({
      ...resume,
      experience: updatedExperience,
    });

    setRewriteResults((prev) => ({
      ...prev,
      [key]: null,
    }));

    showToast("Rewritten experience applied successfully!");
  };

  // APPLY REWRITTEN EDUCATION
  const applyRewrittenEducation = (educationId) => {
    const key = `education-${educationId}`;
    const rewritten = rewriteResults[key];

    if (!rewritten) return;

    const updatedEducation = (resume.education || []).map((education) =>
      String(education.id) === String(educationId)
        ? {
            ...education,
            degree: rewritten.degree || education.degree,
            institution: education.institution,
            startYear: education.startYear,
            endYear: education.endYear,
            description: rewritten.description || education.description,
          }
        : education,
    );

    updateResume({
      ...resume,
      education: updatedEducation,
    });

    setRewriteResults((prev) => ({
      ...prev,
      [key]: null,
    }));

    showToast("Rewritten education applied successfully!");
  };

  // GUARD: MongoDB resume data may still be loading on first render.
  if (!resume) {
    return (
      <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-lg">
            <Sparkles size={25} className="animate-pulse" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Preparing Your Resume
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Your saved resume is loading. AI suggestions will be available as
            soon as your resume is ready.
          </p>
          <span className="mt-5 h-1.5 w-40 animate-pulse rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
        </div>
      </section>
    );
  }

  // TAILWIND CLASSES
  const resultCard =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

  const resultTitle = "flex items-center gap-3 border-b border-slate-100 pb-4";

  const resultTitleIcon =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600";

  const currentBox = "mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4";

  const suggestedBox =
    "mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4";

  const recommendationBox =
    "mt-5 rounded-xl border border-slate-200 bg-white p-4";

  const applyButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

  const rewriteButton =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60";

  const rewriteResult =
    "mt-4 rounded-xl border border-purple-200 bg-purple-50/60 p-4";

  const itemBlock = "rounded-xl border border-slate-200 bg-white p-4";

  // REUSABLE LIST
  const renderList = (items, color = "blue") => (
    <ul className="mt-3 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2 text-sm leading-6 text-slate-700">
          <span
            className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
              color === "amber"
                ? "bg-amber-500"
                : color === "purple"
                  ? "bg-purple-500"
                  : "bg-blue-500"
            }`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  // REUSABLE REWRITE CARD
  const renderRewriteResult = (key, title, fields, onApply) => {
    const rewritten = rewriteResults[key];

    if (!rewritten) return null;

    return (
      <div className={rewriteResult}>
        <div className="flex items-center gap-2 text-purple-700">
          <WandSparkles size={17} />
          <strong className="text-sm font-bold">{title}</strong>
        </div>

        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {fields.map(({ label, field }) => (
            <p key={field}>
              <strong>{label}:</strong> {rewritten[field] || "Not provided"}
            </p>
          ))}
        </div>

        <button
          type="button"
          className={`${applyButton} mt-4`}
          onClick={onApply}
        >
          <CheckCircle size={16} />
          Apply Rewrite
        </button>
      </div>
    );
  };

  return (
    <section className="mt-10 space-y-6">
      {/* TOAST NOTIFICATION */}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-bold tracking-wider text-blue-600 shadow-sm">
              AI POWERED
            </span>

            <h2 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
              AI Resume Suggestions
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Get personalized suggestions, improve your resume content, and
              rewrite sections with AI.
            </p>
            {analysisProvider && (
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Suggestion source:{" "}
                {analysisProvider === "local"
                  ? "Local rule-based engine (offline)"
                  : analysisProvider === "groq"
                    ? "Groq AI"
                    : "Provider unavailable"}
              </p>
            )}
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Sparkles size={27} />
          </div>
        </div>
      </div>

      {/* ANIMATED ANALYZE BUTTON */}
      <button
        type="button"
        onClick={analyzeResume}
        disabled={loading || !resume}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading && (
          <span className="absolute inset-0 animate-pulse bg-white/10" />
        )}
        {loading ? (
          <>
            <span className="relative h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span className="relative">Analyzing Your Resume...</span>
            <span className="relative animate-pulse">✦</span>
          </>
        ) : (
          <>
            <Sparkles
              size={19}
              className="transition duration-300 group-hover:rotate-12 group-hover:scale-110"
            />
            <span>
              {resume ? "Analyze Resume with AI" : "Preparing Resume..."}
            </span>
          </>
        )}
      </button>

      {/* ANIMATED ANALYSIS STATUS */}
      {loading && (
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-indigo-100 bg-linear-to-br from-white via-blue-50 to-purple-50 p-6 shadow-sm sm:p-8">
          <div className="absolute -right-10 -top-10 h-36 w-36 animate-pulse rounded-full bg-purple-200/40 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-36 w-36 animate-pulse rounded-full bg-blue-200/40 blur-3xl" />
          <div className="relative flex flex-col items-center text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-indigo-200/50" />
              <span className="absolute inset-2 animate-spin rounded-full border-2 border-dashed border-indigo-300" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                <Sparkles size={25} className="animate-pulse" />
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              AI Is Reviewing Your Resume
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Checking your professional summary, skills, projects, experience,
              education, and ATS readiness.
            </p>
            <div className="mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full w-2/5 animate-pulse rounded-full bg-linear-to-r from-blue-600 to-purple-600" />
            </div>
            <p className="mt-3 animate-pulse text-xs font-semibold text-indigo-700">
              Please wait while we receive the analysis...
            </p>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {suggestions && (
        <div className="space-y-6">
          {/* RESUME SCORE */}
          {suggestions.score && (
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="border-b border-blue-100 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className={resultTitleIcon}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      AI Resume Score
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Overall analysis of your resume
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-blue-600">
                    {suggestions.score.overall}
                  </span>
                  <span className="mb-2 text-sm font-semibold text-slate-400">
                    / 100
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Your overall resume score
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Professional Summary", "summary"],
                    ["Skills", "skills"],
                    ["Projects", "projects"],
                    ["Experience", "experience"],
                    ["Education", "education"],
                  ].map(([label, key]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 ${
                        key === "education" ? "sm:col-span-2" : ""
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-600">
                        {label}
                      </span>
                      <strong className="text-sm font-bold text-blue-600">
                        {suggestions.score[key] ?? 0}/20
                      </strong>
                    </div>
                  ))}
                </div>

                {suggestions.score.strengths?.length > 0 && (
                  <div className="mt-6 rounded-xl border border-green-100 bg-green-50/60 p-4">
                    <strong className="text-sm font-bold text-green-800">
                      Strengths
                    </strong>
                    <ul className="mt-3 space-y-2">
                      {suggestions.score.strengths.map((item, index) => (
                        <li
                          key={index}
                          className="flex gap-2 text-sm leading-6 text-slate-700"
                        >
                          <CheckCircle
                            size={16}
                            className="mt-1 shrink-0 text-green-600"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestions.score.improvements?.length > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                    <strong className="text-sm font-bold text-amber-800">
                      Areas to Improve
                    </strong>
                    {renderList(suggestions.score.improvements, "amber")}
                  </div>
                )}

                {suggestions.score.ats?.length > 0 && (
                  <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                    <strong className="text-sm font-bold text-purple-800">
                      ATS Recommendations
                    </strong>
                    {renderList(suggestions.score.ats, "purple")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUMMARY */}
          {suggestions.summary && (
            <div className={resultCard}>
              <div className={resultTitle}>
                <div className={resultTitleIcon}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Professional Summary
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Improve your professional introduction
                  </p>
                </div>
              </div>

              <div className={currentBox}>
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Current
                </span>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {suggestions.summary.current || "No summary added yet."}
                </p>
              </div>

              <div className={suggestedBox}>
                <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  AI Suggested
                </span>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {suggestions.summary.suggested}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className={applyButton}
                  onClick={applySummary}
                >
                  <CheckCircle size={16} />
                  Apply Suggestion
                </button>

                <button
                  type="button"
                  className={rewriteButton}
                  onClick={() =>
                    rewriteWithAI(
                      "summary",
                      resume.personalInfo?.summary || "",
                      "summary",
                    )
                  }
                  disabled={rewriteLoading.summary}
                >
                  <WandSparkles size={16} />
                  {rewriteLoading.summary
                    ? "Rewriting..."
                    : "AI Rewrite Summary"}
                </button>
              </div>

              {rewriteResults.summary && (
                <div className={rewriteResult}>
                  <div className="flex items-center gap-2 text-purple-700">
                    <WandSparkles size={17} />
                    <strong className="text-sm font-bold">
                      {rewriteProviders.summary === "local"
                        ? "Local Rule-Based Rewrite"
                        : rewriteProviders.summary === "groq"
                          ? "Groq Rewrite"
                          : "Provider unavailable"}
                    </strong>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {rewriteResults.summary}
                  </p>

                  <button
                    type="button"
                    className={`${applyButton} mt-4`}
                    onClick={applyRewrittenSummary}
                  >
                    <CheckCircle size={16} />
                    Apply Rewrite
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SKILLS */}
          {suggestions.skills && (
            <div className={resultCard}>
              <div className={resultTitle}>
                <div className={resultTitleIcon}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Skills Suggestions
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Improve your technical skill section
                  </p>
                </div>
              </div>

              {suggestions.skills.current?.length > 0 && (
                <div className={currentBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Current Skills
                  </span>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {suggestions.skills.current.join(", ")}
                  </p>
                </div>
              )}

              {suggestions.skills.suggested?.length > 0 && (
                <div className={suggestedBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Verified Skills (ATS Formatting)
                  </span>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Existing skills are standardized and grouped without adding
                    technologies you have not confirmed.
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {suggestions.skills.suggested.map((skill, index) => (
                      <li
                        key={index}
                        className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.skills.suggestions?.length > 0 && (
                <div className={recommendationBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    AI Recommendations
                  </span>
                  {renderList(suggestions.skills.suggestions)}
                </div>
              )}

              {suggestions.skills.suggested?.length > 0 && (
                <button
                  type="button"
                  className={`${applyButton} mt-4`}
                  onClick={applySkills}
                >
                  <CheckCircle size={16} />
                  Apply Skills Suggestion
                </button>
              )}
            </div>
          )}

          {/* PROJECTS */}
          {suggestions.projects && (
            <div className={resultCard}>
              <div className={resultTitle}>
                <div className={resultTitleIcon}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Project Suggestions
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Improve your project descriptions and impact
                  </p>
                </div>
              </div>

              {suggestions.projects.current?.length > 0 && (
                <div className={currentBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Current Projects
                  </span>
                  <div className="mt-3 space-y-3">
                    {suggestions.projects.current.map((project, index) => (
                      <div key={project.id || index} className={itemBlock}>
                        <p className="text-sm font-bold text-slate-900">
                          {project.name}
                        </p>
                        {project.technologies && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            <strong>Technologies:</strong>{" "}
                            {project.technologies}
                          </p>
                        )}
                        {project.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            <strong>Description:</strong> {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.projects.suggested?.length > 0 && (
                <div className={suggestedBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    AI Suggested Projects
                  </span>
                  <div className="mt-3 space-y-3">
                    {suggestions.projects.suggested.map((project, index) => (
                      <div
                        key={project.id || index}
                        className="rounded-xl border border-blue-100 bg-white p-4"
                      >
                        <p className="text-sm font-bold text-slate-900">
                          {project.name}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          <strong>Technologies:</strong> {project.technologies}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          <strong>Description:</strong> {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.projects.suggestions?.length > 0 && (
                <div className={recommendationBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    AI Recommendations
                  </span>
                  {renderList(suggestions.projects.suggestions)}
                </div>
              )}

              {suggestions.projects.suggested?.length > 0 && (
                <button
                  type="button"
                  className={`${applyButton} mt-4`}
                  onClick={applyProjects}
                >
                  <CheckCircle size={16} />
                  Apply Project Suggestion
                </button>
              )}

              {/* INDIVIDUAL PROJECT REWRITE */}
              {(resume.projects || []).length > 0 && (
                <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 sm:p-5">
                  <h4 className="text-sm font-bold text-slate-900">
                    Rewrite Individual Project
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Improve each project's wording separately with AI.
                  </p>

                  <div className="mt-4 space-y-3">
                    {resume.projects.map((project) => {
                      const key = `project-${project.id}`;

                      return (
                        <div
                          key={project.id}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <strong className="block text-sm text-slate-900">
                                {project.name || "Untitled Project"}
                              </strong>
                              <span className="mt-1 block text-xs text-slate-500">
                                AI can improve this project's wording.
                              </span>
                            </div>

                            <button
                              type="button"
                              className={rewriteButton}
                              onClick={() =>
                                rewriteWithAI("project", project, key)
                              }
                              disabled={rewriteLoading[key]}
                            >
                              <WandSparkles size={15} />
                              {rewriteLoading[key]
                                ? "Rewriting..."
                                : "AI Rewrite Project"}
                            </button>
                          </div>

                          {renderRewriteResult(
                            key,
                            rewriteProviders[key] === "local"
                              ? "Local Rule-Based Rewrite"
                              : rewriteProviders[key] === "groq"
                                ? "Groq Rewrite"
                                : "Provider unavailable",
                            [
                              { label: "Project Name", field: "name" },
                              {
                                label: "Technologies",
                                field: "technologies",
                              },
                              {
                                label: "Description",
                                field: "description",
                              },
                            ],
                            () => applyRewrittenProject(project.id),
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXPERIENCE */}
          {suggestions.experience && (
            <div className={resultCard}>
              <div className={resultTitle}>
                <div className={resultTitleIcon}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Experience Suggestions
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Make your professional experience stronger
                  </p>
                </div>
              </div>

              {suggestions.experience.current?.length > 0 && (
                <div className={currentBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Current Experience
                  </span>
                  <div className="mt-3 space-y-3">
                    {suggestions.experience.current.map((experience, index) => (
                      <div key={experience.id || index} className={itemBlock}>
                        <p className="text-sm leading-6 text-slate-700">
                          <strong>Job Title:</strong> {experience.jobTitle}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          <strong>Company:</strong> {experience.company}
                        </p>
                        {experience.location && (
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            <strong>Location:</strong> {experience.location}
                          </p>
                        )}
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          <strong>Dates:</strong> {experience.startDate} -{" "}
                          {experience.endDate}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          <strong>Description:</strong> {experience.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.experience.suggested?.length > 0 && (
                <div className={suggestedBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    AI Suggested Experience
                  </span>
                  <div className="mt-3 space-y-3">
                    {suggestions.experience.suggested.map(
                      (experience, index) => (
                        <div
                          key={experience.id || index}
                          className="rounded-xl border border-blue-100 bg-white p-4"
                        >
                          <p className="text-sm leading-6 text-slate-700">
                            <strong>Job Title:</strong> {experience.jobTitle}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            <strong>Company:</strong> {experience.company}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            <strong>Description:</strong>{" "}
                            {experience.description}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {suggestions.experience.suggestions?.length > 0 && (
                <div className={recommendationBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    AI Recommendations
                  </span>
                  {renderList(suggestions.experience.suggestions)}
                </div>
              )}

              {suggestions.experience.suggested?.length > 0 && (
                <button
                  type="button"
                  className={`${applyButton} mt-4`}
                  onClick={applyExperience}
                >
                  <CheckCircle size={16} />
                  Apply Experience Suggestion
                </button>
              )}

              {/* INDIVIDUAL EXPERIENCE REWRITE */}
              {(resume.experience || []).length > 0 && (
                <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 sm:p-5">
                  <h4 className="text-sm font-bold text-slate-900">
                    Rewrite Individual Experience
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Improve each experience entry separately with AI.
                  </p>

                  <div className="mt-4 space-y-3">
                    {resume.experience.map((experience) => {
                      const key = `experience-${experience.id}`;

                      return (
                        <div
                          key={experience.id}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <strong className="block text-sm text-slate-900">
                                {experience.jobTitle || "Untitled Experience"}
                              </strong>
                              <span className="mt-1 block text-xs text-slate-500">
                                {experience.company || "Company not added"}
                              </span>
                            </div>

                            <button
                              type="button"
                              className={rewriteButton}
                              onClick={() =>
                                rewriteWithAI("experience", experience, key)
                              }
                              disabled={rewriteLoading[key]}
                            >
                              <WandSparkles size={15} />
                              {rewriteLoading[key]
                                ? "Rewriting..."
                                : "AI Rewrite Experience"}
                            </button>
                          </div>

                          {renderRewriteResult(
                            key,
                            rewriteProviders[key] === "local"
                              ? "Local Rule-Based Rewrite"
                              : rewriteProviders[key] === "groq"
                                ? "Groq Rewrite"
                                : "Provider unavailable",
                            [
                              { label: "Job Title", field: "jobTitle" },
                              {
                                label: "Description",
                                field: "description",
                              },
                            ],
                            () => applyRewrittenExperience(experience.id),
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDUCATION */}
          {suggestions.education && (
            <div className={resultCard}>
              <div className={resultTitle}>
                <div className={resultTitleIcon}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Education Suggestions
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Improve how your education is presented
                  </p>
                </div>
              </div>

              {suggestions.education.current?.length > 0 && (
                <div className={currentBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Current Education
                  </span>
                  <div className="mt-3 space-y-3">
                    {suggestions.education.current.map((education, index) => (
                      <div key={education.id || index} className={itemBlock}>
                        <p className="text-sm leading-6 text-slate-700">
                          <strong>Degree:</strong> {education.degree}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          <strong>Institution:</strong> {education.institution}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          <strong>Years:</strong> {education.startYear} -{" "}
                          {education.endYear}
                        </p>
                        {education.description && (
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            <strong>Description:</strong>{" "}
                            {education.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.education.suggested?.length > 0 && (
                <div className={suggestedBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    AI Suggested Education
                  </span>
                  <div className="mt-3 space-y-3">
                    {suggestions.education.suggested.map((education, index) => (
                      <div
                        key={education.id || index}
                        className="rounded-xl border border-blue-100 bg-white p-4"
                      >
                        <p className="text-sm leading-6 text-slate-700">
                          <strong>Degree:</strong> {education.degree}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          <strong>Institution:</strong> {education.institution}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          <strong>Description:</strong> {education.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.education.suggestions?.length > 0 && (
                <div className={recommendationBox}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    AI Recommendations
                  </span>
                  {renderList(suggestions.education.suggestions)}
                </div>
              )}

              {suggestions.education.suggested?.length > 0 && (
                <button
                  type="button"
                  className={`${applyButton} mt-4`}
                  onClick={applyEducation}
                >
                  <CheckCircle size={16} />
                  Apply Education Suggestion
                </button>
              )}

              {/* INDIVIDUAL EDUCATION REWRITE */}
              {(resume.education || []).length > 0 && (
                <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 sm:p-5">
                  <h4 className="text-sm font-bold text-slate-900">
                    Rewrite Individual Education
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Improve each education entry separately with AI.
                  </p>

                  <div className="mt-4 space-y-3">
                    {resume.education.map((education) => {
                      const key = `education-${education.id}`;

                      return (
                        <div
                          key={education.id}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <strong className="block text-sm text-slate-900">
                                {education.degree || "Untitled Education"}
                              </strong>
                              <span className="mt-1 block text-xs text-slate-500">
                                {education.institution ||
                                  "Institution not added"}
                              </span>
                            </div>

                            <button
                              type="button"
                              className={rewriteButton}
                              onClick={() =>
                                rewriteWithAI("education", education, key)
                              }
                              disabled={rewriteLoading[key]}
                            >
                              <WandSparkles size={15} />
                              {rewriteLoading[key]
                                ? "Rewriting..."
                                : "AI Rewrite Education"}
                            </button>
                          </div>

                          {renderRewriteResult(
                            key,
                            rewriteProviders[key] === "local"
                              ? "Local Rule-Based Rewrite"
                              : rewriteProviders[key] === "groq"
                                ? "Groq Rewrite"
                                : "Provider unavailable",
                            [
                              { label: "Degree", field: "degree" },
                              {
                                label: "Institution",
                                field: "institution",
                              },
                              {
                                label: "Description",
                                field: "description",
                              },
                            ],
                            () => applyRewrittenEducation(education.id),
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OVERALL SUGGESTIONS */}
          {suggestions.overall?.suggestions?.length > 0 && (
            <div className={resultCard}>
              <div className={resultTitle}>
                <div className={resultTitleIcon}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Overall Suggestions
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Final recommendations to strengthen your resume
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {suggestions.overall.suggestions.map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                  >
                    <CheckCircle
                      size={17}
                      className="mt-1 shrink-0 text-blue-600"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default AISuggestions;
