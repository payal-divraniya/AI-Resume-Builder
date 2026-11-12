import {
  FolderKanban,
  Code2,
  ExternalLink,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

import { useResume } from "../../context/ResumeContext";

function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useResume();

  const projectsList = Array.isArray(resume?.projects) ? resume.projects : [];

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      technologies: "",
      projectUrl: "",
      githubUrl: "",
      description: "",
    };

    addProject(newProject);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FolderKanban size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Projects</h2>

            <p className="mt-1 text-sm text-slate-500">
              Showcase your best projects, technologies and achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-5">
        {projectsList.map((project, index) => (
          <div
            key={project.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            {/* Card Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Project {index + 1}
                </p>

                <h3 className="mt-1 text-base font-bold text-slate-900">
                  {project.name || "New Project"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            {/* Project Name + Technologies */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`project-name-${project.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Project Name
                </label>

                <div className="relative">
                  <FolderKanban
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`project-name-${project.id}`}
                    type="text"
                    value={project.name || ""}
                    onChange={(e) =>
                      updateProject(project.id, "name", e.target.value)
                    }
                    placeholder="e.g. E-Commerce Web Application"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`technologies-${project.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Technologies
                </label>

                <div className="relative">
                  <Code2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`technologies-${project.id}`}
                    type="text"
                    value={project.technologies || ""}
                    onChange={(e) =>
                      updateProject(project.id, "technologies", e.target.value)
                    }
                    placeholder="e.g. React.js, Node.js, Express.js, MongoDB"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </div>

            {/* URLs */}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`project-url-${project.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Project URL
                </label>

                <div className="relative">
                  <ExternalLink
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`project-url-${project.id}`}
                    type="url"
                    value={project.projectUrl || ""}
                    onChange={(e) =>
                      updateProject(project.id, "projectUrl", e.target.value)
                    }
                    placeholder="e.g. https://your-live-project.com"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`github-url-${project.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  GitHub URL
                </label>

                <input
                  id={`github-url-${project.id}`}
                  type="url"
                  value={project.githubUrl || ""}
                  onChange={(e) =>
                    updateProject(project.id, "githubUrl", e.target.value)
                  }
                  placeholder="e.g. https://github.com/username/project-name"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label
                htmlFor={`project-description-${project.id}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Project Description
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  id={`project-description-${project.id}`}
                  rows="5"
                  value={project.description || ""}
                  onChange={(e) =>
                    updateProject(project.id, "description", e.target.value)
                  }
                  placeholder="Describe the problem your project solves, its key features, your technical contributions, and the results achieved..."
                  className={`${inputClass} min-h-36 resize-y pl-11 leading-6`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Tip: Highlight your role, important features, technologies used,
                and measurable results.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projectsList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <FolderKanban size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">
            No projects added
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add your best projects to show your practical experience.
          </p>
        </div>
      )}

      {/* Add Project */}
      <button
        type="button"
        onClick={handleAddProject}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
      >
        <Plus size={18} />
        Add Project
      </button>
    </section>
  );
}

export default ProjectsForm;
