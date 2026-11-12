import ContactDetails from "../resume/ContactDetails";

function MinimalTemplate({ resume }) {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = resume;

  const themeColor = resume.themeColor || "#2563eb";

  const sectionTitleClass =
    "mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500";

  const itemClass = "border-b border-slate-100 pb-5 last:border-b-0";

  return (
    <div className="w-full bg-white px-8 py-9 text-slate-800 sm:px-10">
      {/* HEADER */}
      <div
        className="flex items-start justify-between gap-5 border-b pb-7"
        style={{ borderColor: themeColor }}
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {personalInfo.fullName || "Your Name"}
          </h1>

          <h2
            className="mt-2 text-base font-medium sm:text-lg"
            style={{ color: themeColor }}
          >
            {personalInfo.jobTitle && (
              <h2
                className="mt-2 text-base font-semibold sm:text-lg"
                style={{ color: themeColor }}
              >
                {personalInfo.jobTitle}
              </h2>
            )}
          </h2>
        </div>

        {personalInfo.profileImage && (
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="h-20 w-20 shrink-0 rounded-full object-cover"
            style={{ border: `2px solid ${themeColor}` }}
          />
        )}
      </div>

      {/* CONTACT DETAILS */}
      <ContactDetails
        personalInfo={personalInfo}
        className="mt-5 border-b border-slate-200 pb-5"
      />

      {/* SUMMARY */}
      {personalInfo.summary && (
        <section className="mt-8">
          <h3 className={sectionTitleClass}>Summary</h3>

          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mt-8">
          <h3 className={sectionTitleClass}>Experience</h3>

          <div className="space-y-5">
            {experience.map((item) => (
              <div className={itemClass} key={item.id}>
                <h4 className="text-base font-bold text-slate-900">
                  {item.jobTitle}
                </h4>

                <strong
                  className="mt-1 block text-sm font-semibold"
                  style={{ color: themeColor }}
                >
                  {item.company}
                </strong>

                <small className="mt-1 block text-xs text-slate-400">
                  {item.startDate || "Start"} - {item.endDate || "Present"}
                </small>

                {item.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section className="mt-8">
          <h3 className={sectionTitleClass}>Education</h3>

          <div className="space-y-5">
            {education.map((item) => (
              <div className={itemClass} key={item.id}>
                <h4 className="text-base font-bold text-slate-900">
                  {item.degree}
                </h4>

                <strong
                  className="mt-1 block text-sm font-semibold"
                  style={{ color: themeColor }}
                >
                  {item.institution}
                </strong>

                <small className="mt-1 block text-xs text-slate-400">
                  {item.startYear || "Start"} - {item.endYear || "Present"}
                </small>

                {item.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section className="mt-8">
          <h3 className={sectionTitleClass}>Skills</h3>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-sm text-slate-700">
                {skill.name}

                {skill.level && (
                  <span className="text-slate-400"> ({skill.level})</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mt-8">
          <h3 className={sectionTitleClass}>Projects</h3>

          <div className="space-y-5">
            {projects.map((project) => (
              <div className={itemClass} key={project.id}>
                <h4 className="text-base font-bold text-slate-900">
                  {project.name}
                </h4>

                {project.technologies && (
                  <strong
                    className="mt-1 block text-sm font-semibold"
                    style={{ color: themeColor }}
                  >
                    {project.technologies}
                  </strong>
                )}

                {project.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>
                )}

                <div className="mt-2 flex flex-col gap-1 text-xs text-slate-400">
                  {project.projectUrl && (
                    <small className="break-all">{project.projectUrl}</small>
                  )}

                  {project.githubUrl && (
                    <small className="break-all">{project.githubUrl}</small>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section className="mt-8">
          <h3 className={sectionTitleClass}>Certifications</h3>

          <div className="space-y-5">
            {certifications.map((item) => (
              <div className={itemClass} key={item.id}>
                <h4 className="text-sm font-bold text-slate-900">
                  {item.name}
                </h4>

                <strong
                  className="mt-1 block text-sm font-semibold"
                  style={{ color: themeColor }}
                >
                  {item.organization}
                </strong>

                {item.date && (
                  <small className="mt-1 block text-xs text-slate-400">
                    {item.date}
                  </small>
                )}

                {item.credentialUrl && (
                  <small className="mt-1 block break-all text-xs text-slate-400">
                    {item.credentialUrl}
                  </small>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LANGUAGES */}
      {languages.length > 0 && (
        <section className="mt-8">
          <h3 className={sectionTitleClass}>Languages</h3>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {languages.map((language) => (
              <span key={language.id} className="text-sm text-slate-700">
                {language.name}

                {language.level && (
                  <span className="text-slate-400"> ({language.level})</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MinimalTemplate;
