import ContactDetails from "../resume/ContactDetails";

function CreativeTemplate({ resume }) {
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
    "mb-4 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-800";

  return (
    <div className="w-full overflow-hidden bg-white text-slate-800">
      {/* Header */}
      <div
        className="relative px-8 py-9 text-white sm:px-10"
        style={{
          background: `linear-gradient(135deg, ${themeColor}, #7c3aed)`,
        }}
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10" />

        <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
          {personalInfo.profileImage && (
            <img
              src={personalInfo.profileImage}
              alt="Profile"
              className="mb-5 h-28 w-28 rounded-2xl border-4 border-white/80 object-cover shadow-lg sm:mb-0 sm:mr-6"
            />
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {personalInfo.fullName || "Your Name"}
            </h1>

            <h2 className="mt-2 text-base font-semibold text-white/90 sm:text-lg">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-7 px-8 py-8 sm:px-10">
        {/* Contact Details */}
        <ContactDetails
          personalInfo={personalInfo}
          variant="default"
          className="border-b border-slate-200 pb-5"
        />

        {/* About Me */}
        {personalInfo.summary && (
          <section>
            <h3 className={sectionTitleClass}>
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              About Me
            </h3>

            <p className="text-sm leading-6 text-slate-600">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h3 className={sectionTitleClass}>
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              Experience
            </h3>

            <div className="space-y-5">
              {experience.map((item) => (
                <div key={item.id} className="border-l-2 border-slate-200 pl-5">
                  <h4 className="text-base font-bold text-slate-900">
                    {item.jobTitle}
                  </h4>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold">
                    <span style={{ color: themeColor }}>{item.company}</span>

                    {item.startDate && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">
                          {item.startDate} - {item.endDate || "Present"}
                        </span>
                      </>
                    )}
                  </div>

                  {item.location && (
                    <p className="mt-1 text-xs text-slate-500">
                      {item.location}
                    </p>
                  )}

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

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h3 className={sectionTitleClass}>
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              Education
            </h3>

            <div className="space-y-5">
              {education.map((item) => (
                <div key={item.id} className="border-l-2 border-slate-200 pl-5">
                  <h4 className="text-base font-bold text-slate-900">
                    {item.degree}
                  </h4>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold">
                    <span style={{ color: themeColor }}>
                      {item.institution}
                    </span>

                    {(item.startYear || item.endYear) && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">
                          {item.startYear} - {item.endYear || "Present"}
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

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 className={sectionTitleClass}>
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold"
                  style={{
                    borderColor: `${themeColor}40`,
                    color: themeColor,
                    backgroundColor: `${themeColor}10`,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h3 className={sectionTitleClass}>
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              Projects
            </h3>

            <div className="space-y-5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h4 className="text-base font-bold text-slate-900">
                    {project.name}
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

                  <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                    {project.projectUrl && (
                      <span>
                        <strong className="text-slate-700">Live:</strong>{" "}
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

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h3 className={sectionTitleClass}>
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              Certifications
            </h3>

            <div className="space-y-4">
              {certifications.map((item) => (
                <div key={item.id} className="border-l-2 border-slate-200 pl-5">
                  <h4 className="text-sm font-bold text-slate-900">
                    {item.name}
                  </h4>

                  {item.organization && (
                    <p
                      className="mt-1 text-xs font-semibold"
                      style={{ color: themeColor }}
                    >
                      {item.organization}
                    </p>
                  )}

                  {item.date && (
                    <p className="mt-1 text-xs text-slate-500">{item.date}</p>
                  )}

                  {item.credentialUrl && (
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {item.credentialUrl}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h3 className={sectionTitleClass}>
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              Languages
            </h3>

            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <span
                  key={language.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {language.name}
                  {language.level && ` - ${language.level}`}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default CreativeTemplate;
