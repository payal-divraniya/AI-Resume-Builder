import {
  Document,
  Page,
  Text,
  View,
  Link,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 27,
    paddingBottom: 26,
    paddingHorizontal: 39,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: "#273244",
    lineHeight: 1.35,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 13,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D9E0E8",
  },
  creativeHeader: {
    padding: 16,
    marginBottom: 13,
    borderRadius: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginLeft: 12,
    objectFit: "cover",
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    lineHeight: 1.15,
  },
  jobTitle: {
    fontSize: 10,
    marginBottom: 7,
  },
  contactLine: {
    fontSize: 8,
    marginTop: 2,
    lineHeight: 1.35,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#D9E0E8",
  },
  entry: {
    marginBottom: 6,
  },
  entryTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  entrySubtitle: {
    fontSize: 8,
    color: "#526174",
    marginBottom: 1,
  },
  entryDate: {
    fontSize: 7.5,
    color: "#64748B",
    marginBottom: 2,
  },
  description: {
    fontSize: 8.3,
    lineHeight: 1.35,
    marginTop: 1,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillItem: {
    width: "50%",
    paddingRight: 8,
    marginBottom: 3,
    fontSize: 8.2,
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 5,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 13,
    marginBottom: 2,
    textDecoration: "none",
  },
  socialBadge: {
    width: 12,
    textAlign: "center",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    marginRight: 3,
  },
  socialText: {
    fontSize: 8,
    color: "#334155",
    textDecoration: "none",
  },
  bullet: {
    fontSize: 8.2,
    marginBottom: 2,
  },
});

const clean = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  return "";
};

const getArray = (value) => (Array.isArray(value) ? value : []);

const getField = (item, keys) => {
  if (!item || typeof item !== "object") return "";
  for (const key of keys) {
    const value = clean(item[key]);
    if (value) return value;
  }
  return "";
};

const normalizeUrl = (value) => {
  const raw = clean(value);
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

// Display only a profile username/handle. Social profile labels are plain text,
// not clickable links, so the PDF never exposes the full profile URL.
const getProfileLabel = (value, type) => {
  let raw = clean(value);
  if (!raw) return "";
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* keep original text */
  }

  const isExplicitUrl =
    /^(https?:\/\/|www\.)/i.test(raw) ||
    /^(linkedin\.com|github\.com)\//i.test(raw);

  // A plain name/username (including spaces) is not a URL.
  if (!isExplicitUrl) {
    if (type === "portfolio" && /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
      return raw.replace(/^www\./i, "").split("/")[0];
    }
    return raw.replace(/^@/, "");
  }

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const parts = url.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => {
        try {
          return decodeURIComponent(part);
        } catch {
          return part;
        }
      });

    if (type === "linkedin") {
      const marker = parts.findIndex((part) =>
        ["in", "company", "school", "pub"].includes(part.toLowerCase()),
      );
      return (marker >= 0 ? parts[marker + 1] : parts[0]) || "";
    }
    if (type === "github") return parts[0] || "";
    return url.hostname.replace(/^www\./i, "");
  } catch {
    return raw.replace(/^@/, "");
  }
};

const formatDateRange = (item) => {
  const start = getField(item, ["startDate", "start", "from", "dateStarted"]);
  const end = getField(item, ["endDate", "end", "to", "dateCompleted"]);
  if (start && end) return `${start} - ${end}`;
  return start || end || getField(item, ["date", "year", "duration"]);
};

function ResumePDF({ resume = {}, template = "modern" }) {
  const personal = resume.personalInfo || {};
  const themeColor = /^#[0-9A-Fa-f]{6}$/.test(resume.themeColor || "")
    ? resume.themeColor
    : "#2563EB";

  const isCreative = template === "creative";
  const isMinimal = template === "minimal";
  const isProfessional = template === "professional";

  const headingColor = isMinimal
    ? "#374151"
    : isProfessional
      ? "#1F2937"
      : themeColor;
  const primaryTextColor = isCreative ? "#FFFFFF" : "#172033";
  const secondaryTextColor = isCreative ? "#F1F5F9" : "#526174";

  const fullName = getField(personal, ["fullName", "name"]) || "Your Name";
  const jobTitle = getField(personal, ["jobTitle", "title", "position"]);
  const email = getField(personal, ["email"]);
  const phone = getField(personal, ["phone", "mobile", "contact"]);
  const location = getField(personal, ["location", "address"]);
  const website = getField(personal, ["website", "portfolio"]);
  const linkedin = getField(personal, ["linkedin", "linkedIn"]);
  const github = getField(personal, ["github", "gitHub"]);
  const summary = getField(personal, ["summary", "professionalSummary"]);
  const profileImage = getField(personal, ["profileImage", "photo", "image"]);

  const education = getArray(resume.education);
  const experience = getArray(resume.experience);
  const skills = getArray(resume.skills);
  const projects = getArray(resume.projects);
  const certifications = getArray(resume.certifications);
  const languages = getArray(resume.languages);

  const Section = ({ title, children, keepTogether = false }) => (
    <View style={styles.section} wrap={!keepTogether}>
      <Text
        minPresenceAhead={keepTogether ? 38 : 24}
        style={[
          styles.sectionHeading,
          { color: headingColor, borderBottomColor: headingColor },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );

  const Entry = ({ title, subtitle, date, description, url }) => {
    const normalizedEntryUrl = normalizeUrl(url);
    return (
      <View style={styles.entry} wrap>
        {title ? <Text style={styles.entryTitle}>{title}</Text> : null}
        {subtitle ? <Text style={styles.entrySubtitle}>{subtitle}</Text> : null}
        {date ? <Text style={styles.entryDate}>{date}</Text> : null}
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {normalizedEntryUrl ? (
          <Link src={normalizedEntryUrl} style={styles.entrySubtitle}>
            View project / certificate
          </Link>
        ) : null}
      </View>
    );
  };

  const renderSocialLink = (url, type, badge) => {
    const label = getProfileLabel(url, type);
    if (!label) return null;

    return (
      <View style={styles.socialItem} key={type}>
        <Text
          style={[
            styles.socialBadge,
            { color: isCreative ? "#FFFFFF" : "#475569" },
          ]}
        >
          {badge}
        </Text>
        <Text
          style={[
            styles.socialText,
            { color: isCreative ? "#FFFFFF" : "#334155" },
          ]}
        >
          {label}
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View
      style={[
        styles.header,
        isCreative
          ? { ...styles.creativeHeader, backgroundColor: themeColor }
          : {},
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: primaryTextColor }]}>
            {fullName}
          </Text>
          {jobTitle ? (
            <Text style={[styles.jobTitle, { color: secondaryTextColor }]}>
              {jobTitle}
            </Text>
          ) : null}

          {[email, phone, location].filter(Boolean).length > 0 ? (
            <Text style={[styles.contactLine, { color: secondaryTextColor }]}>
              {[email, phone, location].filter(Boolean).join("  |  ")}
            </Text>
          ) : null}

          {normalizeUrl(linkedin) ||
          normalizeUrl(github) ||
          normalizeUrl(website) ? (
            <View style={styles.socialRow}>
              {renderSocialLink(linkedin, "linkedin", "in")}
              {renderSocialLink(github, "github", "GH")}
              {renderSocialLink(website, "portfolio", "◎")}
            </View>
          ) : null}
        </View>

        {profileImage ? (
          <Image src={profileImage} style={styles.profileImage} />
        ) : null}
      </View>
    </View>
  );

  return (
    <Document
      title={`${fullName} Resume`}
      author={fullName}
      subject="Professional Resume"
    >
      <Page size="A4" style={styles.page} wrap>
        {renderHeader()}

        {summary ? (
          <Section title="Professional Summary">
            <Text style={styles.description}>{summary}</Text>
          </Section>
        ) : null}

        {experience.length > 0 ? (
          <Section title="Work Experience">
            {experience.map((item, index) => (
              <Entry
                key={`experience-${index}`}
                title={getField(item, [
                  "jobTitle",
                  "title",
                  "position",
                  "role",
                  "designation",
                ])}
                subtitle={[
                  getField(item, ["company", "organization", "employer"]),
                  getField(item, ["location", "city"]),
                ]
                  .filter(Boolean)
                  .join(" | ")}
                date={formatDateRange(item)}
                description={getField(item, [
                  "description",
                  "responsibilities",
                  "details",
                ])}
              />
            ))}
          </Section>
        ) : null}

        {education.length > 0 ? (
          <Section title="Education">
            {education.map((item, index) => (
              <Entry
                key={`education-${index}`}
                title={getField(item, [
                  "degree",
                  "qualification",
                  "course",
                  "title",
                  "education",
                ])}
                subtitle={[
                  getField(item, [
                    "institution",
                    "college",
                    "school",
                    "university",
                  ]),
                  getField(item, ["location", "city"]),
                ]
                  .filter(Boolean)
                  .join(" | ")}
                date={formatDateRange(item)}
                description={getField(item, [
                  "description",
                  "details",
                  "grade",
                  "result",
                  "cgpa",
                ])}
              />
            ))}
          </Section>
        ) : null}

        {skills.length > 0 ? (
          <Section title="Skills">
            <View style={styles.skillsContainer}>
              {skills.map((item, index) => {
                const skillName =
                  typeof item === "string"
                    ? item
                    : getField(item, ["name", "skill", "title"]);
                const level =
                  typeof item === "object"
                    ? getField(item, ["level", "proficiency"])
                    : "";
                if (!skillName) return null;
                return (
                  <Text key={`skill-${index}`} style={styles.skillItem}>
                    • {skillName}
                    {level ? ` - ${level}` : ""}
                  </Text>
                );
              })}
            </View>
          </Section>
        ) : null}

        {projects.length > 0 ? (
          <Section title="Projects">
            {projects.map((item, index) => (
              <Entry
                key={`project-${index}`}
                title={getField(item, ["name", "title", "projectName"])}
                subtitle={getField(item, [
                  "technologies",
                  "techStack",
                  "stack",
                ])}
                description={getField(item, [
                  "description",
                  "details",
                  "features",
                ])}
                url={getField(item, [
                  "liveUrl",
                  "projectUrl",
                  "githubUrl",
                  "url",
                ])}
              />
            ))}
          </Section>
        ) : null}

        {certifications.length > 0 ? (
          <Section title="Certifications">
            {certifications.map((item, index) => (
              <Entry
                key={`certification-${index}`}
                title={
                  typeof item === "string"
                    ? item
                    : getField(item, [
                        "name",
                        "title",
                        "certificate",
                        "certificationName",
                      ])
                }
                subtitle={
                  typeof item === "object"
                    ? getField(item, [
                        "issuer",
                        "organization",
                        "provider",
                        "company",
                      ])
                    : ""
                }
                date={typeof item === "object" ? formatDateRange(item) : ""}
                url={
                  typeof item === "object"
                    ? getField(item, ["url", "certificateUrl", "link"])
                    : ""
                }
              />
            ))}
          </Section>
        ) : null}

        {languages.length > 0 ? (
          <Section title="Languages" keepTogether>
            <View style={styles.skillsContainer}>
              {languages.map((item, index) => {
                const language =
                  typeof item === "string"
                    ? item
                    : getField(item, ["name", "language", "title"]);
                const level =
                  typeof item === "object"
                    ? getField(item, ["level", "proficiency"])
                    : "";
                if (!language) return null;
                return (
                  <Text key={`language-${index}`} style={styles.skillItem}>
                    • {language}
                    {level ? ` - ${level}` : ""}
                  </Text>
                );
              })}
            </View>
          </Section>
        ) : null}
      </Page>
    </Document>
  );
}

export default ResumePDF;
