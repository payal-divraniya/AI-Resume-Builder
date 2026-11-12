import {
  Award,
  Building2,
  CalendarDays,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";

import { useResume } from "../../context/ResumeContext";

function CertificationsForm() {
  const { resume, addCertification, updateCertification, removeCertification } =
    useResume();

  const certificationsList = Array.isArray(resume?.certifications)
    ? resume.certifications
    : [];

  const handleAddCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: "",
      organization: "",
      date: "",
      credentialUrl: "",
    };

    addCertification(newCertification);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Award size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Certifications</h2>

            <p className="mt-1 text-sm text-slate-500">
              Add certifications and courses that support your skills.
            </p>
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-5">
        {certificationsList.map((certification, index) => (
          <div
            key={certification.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            {/* Card Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Certification {index + 1}
                </p>

                <h3 className="mt-1 text-base font-bold text-slate-900">
                  {certification.name || "New Certification"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => removeCertification(certification.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            {/* Certification Name + Organization */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`certification-name-${certification.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Certification Name
                </label>

                <div className="relative">
                  <Award
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`certification-name-${certification.id}`}
                    type="text"
                    value={certification.name || ""}
                    onChange={(e) =>
                      updateCertification(
                        certification.id,
                        "name",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Full Stack Web Development"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`certification-organization-${certification.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Issuing Organization
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`certification-organization-${certification.id}`}
                    type="text"
                    value={certification.organization || ""}
                    onChange={(e) =>
                      updateCertification(
                        certification.id,
                        "organization",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Coursera, Udemy, Google"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </div>

            {/* Date + Credential URL */}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`certification-date-${certification.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Issue Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`certification-date-${certification.id}`}
                    type="month"
                    value={certification.date || ""}
                    onChange={(e) =>
                      updateCertification(
                        certification.id,
                        "date",
                        e.target.value,
                      )
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`credential-url-${certification.id}`}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Credential URL
                </label>

                <div className="relative">
                  <ExternalLink
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={`credential-url-${certification.id}`}
                    type="url"
                    value={certification.credentialUrl || ""}
                    onChange={(e) =>
                      updateCertification(
                        certification.id,
                        "credentialUrl",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. https://your-certificate-verification-link.com"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Tip: Add only certifications or courses you have actually
              completed.
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {certificationsList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <Award size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">
            No certifications added
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add your certifications to strengthen your resume.
          </p>
        </div>
      )}

      {/* Add Certification */}
      <button
        type="button"
        onClick={handleAddCertification}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
      >
        <Plus size={18} />
        Add Certification
      </button>
    </section>
  );
}

export default CertificationsForm;
