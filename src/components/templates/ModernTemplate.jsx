import ContactDetails from "../resume/ContactDetails";

function ModernTemplate({ resume }) {
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
    "mb-4 border-b-2 pb-2 text-sm font-extrabold uppercase tracking-[0.12em] text-slate-800";

  return (
    <div className="w-full bg-white px-8 py-8 text-slate-800 sm:px-10">
      {/* HEADER */}
      <div
        className="flex flex-col-reverse items-start justify-between gap-6 border-b-2 pb-6 sm:flex-row sm:items-center"
        style={{ borderColor: themeColor }}
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {personalInfo.fullName || "Your Name"}
          </h1>

          <div
            className="mt-2 text-base font-semibold sm:text-lg"
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
          </div>
        </div>

        {personalInfo.profileImage && (
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="h-24 w-24 rounded-xl object-cover shadow-sm"
            style={{ border: `3px solid ${themeColor}` }}
          />
        )}
      </div>

      {/* CONTACT */}
      <ContactDetails
        personalInfo={personalInfo}
        className="mt-5 border-b border-slate-200 pb-5"
      />

      {/* SUMMARY */}
      {personalInfo.summary && (
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Professional Summary
          </h3>

          <p className="text-sm leading-6 text-slate-600">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Work Experience
          </h3>

          <div className="space-y-5">
            {experience.map((item, index) => (
              <div
                key={item.id ?? `experience-${index}`}
                className="border-l-2 pl-5"
                style={{ borderColor: `${themeColor}50` }}
              >
                <h4 className="text-base font-bold text-slate-900">
                  {item.jobTitle || "Job Title"}
                </h4>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <strong style={{ color: themeColor }}>
                    {item.company || "Company Name"}
                  </strong>

                  {item.location && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{item.location}</span>
                    </>
                  )}

                  {(item.startDate || item.endDate) && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">
                        {item.startDate || "Start"} -{" "}
                        {item.endDate || "Present"}
                      </span>
                    </>
                  )}
                </div>

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
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Education
          </h3>

          <div className="space-y-5">
            {education.map((item, index) => (
              <div
                key={item.id ?? `education-${index}`}
                className="border-l-2 pl-5"
                style={{ borderColor: `${themeColor}50` }}
              >
                <h4 className="text-base font-bold text-slate-900">
                  {item.degree || "Degree"}
                </h4>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <strong style={{ color: themeColor }}>
                    {item.institution || "Institution"}
                  </strong>

                  {(item.startYear || item.endYear) && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">
                        {item.startYear || "Start"} -{" "}
                        {item.endYear || "Present"}
                      </span>
                    </>
                  )}
                </div>

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
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={skill.id ?? `skill-${index}`}
                className="rounded-md border px-3 py-1.5 text-xs font-semibold"
                style={{
                  borderColor: `${themeColor}50`,
                  color: themeColor,
                  backgroundColor: `${themeColor}0D`,
                }}
              >
                {skill.name}
                {skill.level && ` - ${skill.level}`}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Projects
          </h3>

          <div className="space-y-5">
            {projects.map((project, index) => (
              <div
                key={project.id ?? `project-${index}`}
                className="border-l-2 pl-5"
                style={{ borderColor: `${themeColor}50` }}
              >
                <h4 className="text-base font-bold text-slate-900">
                  {project.name || "Project Name"}
                </h4>

                {project.technologies && (
                  <p
                    className="mt-1 text-xs font-semibold"
                    style={{ color: themeColor }}
                  >
                    Technologies: {project.technologies}
                  </p>
                )}

                {project.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>
                )}

                <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500">
                  {project.projectUrl && (
                    <span>
                      <strong className="text-slate-700">Live Project:</strong>{" "}
                      {project.projectUrl}
                    </span>
                  )}

                  {project.githubUrl && (
                    <span>
                      <strong className="text-slate-700">GitHub:</strong>{" "}
                      {project.githubUrl}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Certifications
          </h3>

          <div className="space-y-4">
            {certifications.map((item, index) => (
              <div
                key={item.id ?? `certification-${index}`}
                className="border-l-2 pl-5"
                style={{ borderColor: `${themeColor}50` }}
              >
                <h4 className="text-sm font-bold text-slate-900">
                  {item.name || "Certification Name"}
                </h4>

                {item.organization && (
                  <strong
                    className="mt-1 block text-xs"
                    style={{ color: themeColor }}
                  >
                    {item.organization}
                  </strong>
                )}

                {item.date && (
                  <small className="mt-1 block text-xs text-slate-500">
                    {item.date}
                  </small>
                )}

                {item.credentialUrl && (
                  <small className="mt-1 block break-all text-xs text-slate-500">
                    Credential: {item.credentialUrl}
                  </small>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LANGUAGES */}
      {languages.length > 0 && (
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Languages
          </h3>

          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <span
                key={language.id ?? `language-${index}`}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                {language.name}
                {language.level && ` - ${language.level}`}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ModernTemplate;
