import { Code2, BarChart3, Plus, Trash2 } from "lucide-react";

import { useResume } from "../../context/ResumeContext";

function SkillsForm() {
  const { resume, addSkill, updateSkill, removeSkill } = useResume();

  const skills = Array.isArray(resume?.skills) ? resume.skills : [];

  const handleAddSkill = () => {
    const newSkill = {
      id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: "",
      level: "Intermediate",
    };

    addSkill(newSkill);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Code2 size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Skills</h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the technical and professional skills you have.
            </p>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {skills.map((skill, index) => {
          const skillId = skill.id ?? `existing-skill-${index}`;

          return (
            <div
              key={skillId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              {/* Card Header */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Skill {index + 1}
                  </p>

                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    {skill.name || "New Skill"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>

              {/* Skill Fields */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Skill Name */}
                <div>
                  <label
                    htmlFor={`skill-name-${skillId}`}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Skill
                  </label>

                  <div className="relative">
                    <Code2
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id={`skill-name-${skillId}`}
                      type="text"
                      value={skill.name || ""}
                      onChange={(e) =>
                        updateSkill(skill.id, "name", e.target.value)
                      }
                      placeholder="e.g. React.js"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                {/* Skill Level */}
                <div>
                  <label
                    htmlFor={`skill-level-${skillId}`}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Level
                  </label>

                  <div className="relative">
                    <BarChart3
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      id={`skill-level-${skillId}`}
                      value={skill.level || "Intermediate"}
                      onChange={(e) =>
                        updateSkill(skill.id, "level", e.target.value)
                      }
                      className={`${inputClass} cursor-pointer pl-11`}
                    >
                      <option value="Beginner">Beginner</option>

                      <option value="Intermediate">Intermediate</option>

                      <option value="Advanced">Advanced</option>

                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {skills.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <Code2 size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">
            No skills added
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add your skills to highlight your strengths.
          </p>
        </div>
      )}

      {/* Add Skill */}
      <button
        type="button"
        onClick={handleAddSkill}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
      >
        <Plus size={18} />
        Add Skill
      </button>
    </section>
  );
}

export default SkillsForm;
