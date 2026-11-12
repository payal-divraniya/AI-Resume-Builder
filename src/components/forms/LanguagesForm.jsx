import {
  Languages,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";

import { useResume } from "../../context/ResumeContext";

function LanguagesForm() {
  const {
    resume,
    addLanguage,
    updateLanguage,
    removeLanguage,
  } = useResume();

  // The active resume can be temporarily unavailable while data is loading.
  const languagesList = Array.isArray(resume?.languages) ? resume.languages : [];

  const handleAddLanguage = () => {
    const newLanguage = {
      id: Date.now(),
      name: "",
      level: "Intermediate",
    };

    addLanguage(newLanguage);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Languages size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Languages
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the languages you can speak and your proficiency level.
            </p>
          </div>
        </div>
      </div>

      {/* Languages List */}
      <div className="space-y-4">
        {languagesList.map((language, index) => (
          <div
            key={language.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            {/* Card Header */}
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Language {index + 1}
                </p>

                <h3 className="mt-1 text-base font-bold text-slate-900">
                  {language.name || "New Language"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => removeLanguage(language.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            {/* Language Fields */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Language */}
              <div>
                <label
                  htmlFor={`language-name-${language.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Language
                </label>

                <div className="relative">
                  <Languages
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`language-name-${language.id}`}
                    type="text"
                    value={language.name || ""}
                    onChange={(e) =>
                      updateLanguage(
                        language.id,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="e.g. English"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Proficiency */}
              <div>
                <label
                  htmlFor={`language-level-${language.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Proficiency
                </label>

                <div className="relative">
                  <BarChart3
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id={`language-level-${language.id}`}
                    value={language.level || "Intermediate"}
                    onChange={(e) =>
                      updateLanguage(
                        language.id,
                        "level",
                        e.target.value
                      )
                    }
                    className={`${inputClass} cursor-pointer pl-11`}
                  >
                    <option value="Basic">Basic</option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>

                    <option value="Fluent">
                      Fluent
                    </option>

                    <option value="Native">
                      Native
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {languagesList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <Languages size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">
            No languages added
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add languages to show your communication abilities.
          </p>
        </div>
      )}

      {/* Add Language */}
      <button
        type="button"
        onClick={handleAddLanguage}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
      >
        <Plus size={18} />
        Add Language
      </button>
    </section>
  );
}

export default LanguagesForm;