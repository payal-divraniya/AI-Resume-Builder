import {
  Briefcase,
  Building2,
  MapPin,
  CalendarDays,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

import { useResume } from "../../context/ResumeContext";

function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } =
    useResume();

  const experienceList = Array.isArray(resume?.experience)
    ? resume.experience
    : [];

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    addExperience(newExperience);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Briefcase size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Work Experience
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add your professional experience and achievements.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {experienceList.map((experience, index) => (
          <div
            key={experience.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Experience {index + 1}
                </p>

                <h3 className="mt-1 text-base font-bold text-slate-900">
                  {experience.jobTitle || "New Experience"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => removeExperience(experience.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`jobTitle-${experience.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Job Title
                </label>

                <div className="relative">
                  <Briefcase
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`jobTitle-${experience.id}`}
                    type="text"
                    value={experience.jobTitle || ""}
                    onChange={(e) =>
                      updateExperience(
                        experience.id,
                        "jobTitle",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Software Developer Intern"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`company-${experience.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`company-${experience.id}`}
                    type="text"
                    value={experience.company || ""}
                    onChange={(e) =>
                      updateExperience(experience.id, "company", e.target.value)
                    }
                    placeholder="e.g. ABC Technologies"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`location-${experience.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`location-${experience.id}`}
                    type="text"
                    value={experience.location || ""}
                    onChange={(e) =>
                      updateExperience(
                        experience.id,
                        "location",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Ahmedabad, Gujarat"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`startDate-${experience.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Start Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`startDate-${experience.id}`}
                    type="month"
                    value={experience.startDate || ""}
                    onChange={(e) =>
                      updateExperience(
                        experience.id,
                        "startDate",
                        e.target.value,
                      )
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`endDate-${experience.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  End Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`endDate-${experience.id}`}
                    type="month"
                    value={experience.endDate || ""}
                    onChange={(e) =>
                      updateExperience(experience.id, "endDate", e.target.value)
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor={`description-${experience.id}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Job Description
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  id={`description-${experience.id}`}
                  rows="5"
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(
                      experience.id,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Describe your responsibilities, technical contributions, tools used, and measurable achievements..."
                  className={`${inputClass} min-h-36 resize-y pl-11 leading-6`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Start with action verbs and highlight measurable results
                wherever possible.
              </p>
            </div>
          </div>
        ))}
      </div>

      {experienceList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <Briefcase size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">
            No work experience added
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add your professional experience to make your resume stronger.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddExperience}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
      >
        <Plus size={18} />
        Add Experience
      </button>
    </section>
  );
}

export default ExperienceForm;
