import {
  GraduationCap,
  Building2,
  CalendarDays,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

import { useResume } from "../../context/ResumeContext";

function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } =
    useResume();

  const educationList = Array.isArray(resume?.education)
    ? resume.education
    : [];

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
      description: "",
    };

    addEducation(newEducation);
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <GraduationCap size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Education</h2>

            <p className="mt-1 text-sm text-slate-500">
              Add your educational background and qualifications.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {educationList.map((education, index) => (
          <div
            key={education.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Education {index + 1}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add your degree and institution details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeEducation(education.id)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`degree-${education.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Degree / Qualification
                </label>

                <div className="relative">
                  <GraduationCap
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`degree-${education.id}`}
                    type="text"
                    value={education.degree || ""}
                    onChange={(e) =>
                      updateEducation(education.id, "degree", e.target.value)
                    }
                    placeholder="e.g. Bachelor of Computer Applications"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`institution-${education.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  College / University
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`institution-${education.id}`}
                    type="text"
                    value={education.institution || ""}
                    onChange={(e) =>
                      updateEducation(
                        education.id,
                        "institution",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. ABC University"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`startYear-${education.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Start Year
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`startYear-${education.id}`}
                    type="text"
                    value={education.startYear || ""}
                    onChange={(e) =>
                      updateEducation(education.id, "startYear", e.target.value)
                    }
                    placeholder="e.g. 2022"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`endYear-${education.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  End Year
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`endYear-${education.id}`}
                    type="text"
                    value={education.endYear || ""}
                    onChange={(e) =>
                      updateEducation(education.id, "endYear", e.target.value)
                    }
                    placeholder="e.g. 2025 or Present"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor={`education-description-${education.id}`}
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <FileText size={16} className="text-slate-400" />
                Description
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  id={`education-description-${education.id}`}
                  rows={4}
                  value={education.description || ""}
                  onChange={(e) =>
                    updateEducation(education.id, "description", e.target.value)
                  }
                  placeholder="Highlight academic achievements, relevant coursework, certifications, or extracurricular activities..."
                  className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Mention achievements, relevant coursework, or other important
                details.
              </p>
            </div>
          </div>
        ))}
      </div>

      {educationList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <GraduationCap size={23} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-800">
            No education added yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
            Add your degree, college, and education details to make your resume
            more complete.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddEducation}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
      >
        <Plus size={18} />
        Add Education
      </button>
    </section>
  );
}

export default EducationForm;
