import ContactDetails from "../resume/ContactDetails";

function ProfessionalTemplate({ resume }) {
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

  const itemClass = "border-b border-slate-200 pb-5 last:border-b-0";

  return (
    <div className="w-full bg-white px-8 py-8 text-slate-800 sm:px-10">
      {/* HEADER */}
      <div
        className="flex flex-col-reverse items-start justify-between gap-6 border-b-2 pb-6 sm:flex-row sm:items-center"
        style={{ borderColor: themeColor }}
      >
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {personalInfo.fullName || "Your Name"}
          </h1>

          {personalInfo.jobTitle && (
            <h2
              className="mt-2 text-base font-semibold sm:text-lg"
              style={{ color: themeColor }}
            >
              {personalInfo.jobTitle}
            </h2>
          )}
        </div>

        {personalInfo.profileImage && (
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="h-24 w-24 rounded-lg object-cover shadow-sm"
            style={{
              border: `3px solid ${themeColor}`,
            }}
          />
        )}
      </div>

      {/* CONTACT DETAILS + SOCIAL LINKS */}
      <ContactDetails
        personalInfo={personalInfo}
        variant="default"
        includeSocial={true}
        className="mt-5 border-b border-slate-200 pb-5"
      />

      {/* PROFILE */}
      {personalInfo.summary && (
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Profile
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
            Experience
          </h3>

          <div className="space-y-5">
            {experience.map((item) => (
              <div className={itemClass} key={item.id}>
                <h4 className="text-base font-bold text-slate-900">
                  {item.jobTitle}
                </h4>

                <strong
                  className="mt-1 block text-xs sm:text-sm"
                  style={{ color: themeColor }}
                >
                  {item.company}
                  {item.location && ` - ${item.location}`}
                </strong>

                <small className="mt-1 block text-xs text-slate-500">
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
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Education
          </h3>

          <div className="space-y-5">
            {education.map((item) => (
              <div className={itemClass} key={item.id}>
                <h4 className="text-base font-bold text-slate-900">
                  {item.degree}
                </h4>

                <strong
                  className="mt-1 block text-xs sm:text-sm"
                  style={{ color: themeColor }}
                >
                  {item.institution}
                </strong>

                <small className="mt-1 block text-xs text-slate-500">
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
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Technical Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-md border px-3 py-1.5 text-xs font-semibold"
                style={{
                  borderColor: `${themeColor}50`,
                  color: themeColor,
                  backgroundColor: `${themeColor}0D`,
                }}
              >
                {skill.name}
                {skill.level && ` (${skill.level})`}
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
            {projects.map((project) => (
              <div className={itemClass} key={project.id}>
                <h4 className="text-base font-bold text-slate-900">
                  {project.name}
                </h4>

                {project.technologies && (
                  <strong
                    className="mt-1 block text-xs sm:text-sm"
                    style={{ color: themeColor }}
                  >
                    Technologies: {project.technologies}
                  </strong>
                )}

                {project.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>
                )}

                <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                  {project.projectUrl && (
                    <small>
                      <strong className="text-slate-700">Live:</strong>{" "}
                      {project.projectUrl}
                    </small>
                  )}

                  {project.githubUrl && (
                    <small>
                      <strong className="text-slate-700">GitHub:</strong>{" "}
                      {project.githubUrl}
                    </small>
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

          <div className="space-y-5">
            {certifications.map((item) => (
              <div className={itemClass} key={item.id}>
                <h4 className="text-sm font-bold text-slate-900">
                  {item.name}
                </h4>

                <strong
                  className="mt-1 block text-xs sm:text-sm"
                  style={{ color: themeColor }}
                >
                  {item.organization}
                </strong>

                {item.date && (
                  <small className="mt-1 block text-xs text-slate-500">
                    {item.date}
                  </small>
                )}

                {item.credentialUrl && (
                  <small className="mt-1 block break-all text-xs text-slate-500">
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
        <section className="mt-7">
          <h3 className={sectionTitleClass} style={{ borderColor: themeColor }}>
            Languages
          </h3>

          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <span
                key={language.id}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                {language.name}
                {language.level && ` (${language.level})`}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProfessionalTemplate;
