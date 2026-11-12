/**
 * AI Resume Builder
 * Resume scoring, skill categorization, professional rewriting
 * and offline fallback helpers.
 */

const KNOWN_SKILLS_MAP = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  py: "Python",
  python: "Python",
  java: "Java",
  "c++": "C++",
  cpp: "C++",
  "c#": "C#",
  php: "PHP",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  kotlin: "Kotlin",
  swift: "Swift",
  sql: "SQL",

  react: "React.js",
  "react.js": "React.js",
  reactjs: "React.js",
  next: "Next.js",
  "next.js": "Next.js",
  vue: "Vue.js",
  "vue.js": "Vue.js",
  angular: "Angular",
  html: "HTML5",
  html5: "HTML5",
  css: "CSS3",
  css3: "CSS3",
  tailwind: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  bootstrap: "Bootstrap",
  redux: "Redux",
  vite: "Vite",
  jquery: "jQuery",

  node: "Node.js",
  "node.js": "Node.js",
  nodejs: "Node.js",
  express: "Express.js",
  "express.js": "Express.js",
  expressjs: "Express.js",
  django: "Django",
  flask: "Flask",
  fastapi: "FastAPI",
  graphql: "GraphQL",
  "rest api": "RESTful APIs",
  "rest apis": "RESTful APIs",
  "restful api": "RESTful APIs",
  "restful apis": "RESTful APIs",

  mongo: "MongoDB",
  mongodb: "MongoDB",
  mongoose: "Mongoose",
  mysql: "MySQL",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  sqlite: "SQLite",
  redis: "Redis",
  firebase: "Firebase",
  supabase: "Supabase",

  git: "Git",
  github: "GitHub",
  gitlab: "GitLab",
  docker: "Docker",
  kubernetes: "Kubernetes",
  postman: "Postman",
  aws: "AWS",
  azure: "Azure",
  linux: "Linux",
  npm: "npm",
  yarn: "Yarn",
  jest: "Jest",
  cypress: "Cypress",
  figma: "Figma",
  jira: "Jira",
};

const textValue = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  return "";
};

const listValue = (value) => (Array.isArray(value) ? value : []);

const safeItems = (value) =>
  listValue(value).filter((item) => item && typeof item === "object");

const formatKnownSkill = (value) => {
  const raw = textValue(value).replace(/\s+/g, " ");
  if (!raw) return "";

  const known = KNOWN_SKILLS_MAP[raw.toLowerCase()];
  if (known) return known;

  if (raw === raw.toLowerCase() && raw.length > 2) {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return raw;
};

// Split combined technology strings only when every detected
// technology is a recognized skill. This avoids changing descriptions.
const expandKnownSkills = (value) => {
  const raw = textValue(value).replace(/\s+/g, " ");
  if (!raw) return [];

  const aliases = Object.keys(KNOWN_SKILLS_MAP).sort(
    (a, b) => b.length - a.length,
  );

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `(^|[^a-z0-9])(${aliases.map(escapeRegex).join("|")})(?=$|[^a-z0-9])`,
    "gi",
  );

  const matches = [];
  let match;

  while ((match = pattern.exec(raw)) !== null) {
    matches.push(match[2]);

    if (!match[0].length) {
      pattern.lastIndex++;
    }
  }

  if (matches.length < 2) {
    return [formatKnownSkill(raw)];
  }

  // Ignore the word "and" when validating combined technology names.
  const normalizedInput = raw
    .toLowerCase()
    .replace(/\band\b/gi, "")
    .replace(/[\s,;|/]+/g, "");

  const normalizedMatches = matches
    .map((item) => item.toLowerCase().replace(/\s+/g, ""))
    .join("");

  if (normalizedInput !== normalizedMatches) {
    return [formatKnownSkill(raw)];
  }

  return matches.map(formatKnownSkill);
};

const formatTechStack = (value) => {
  let items = [];

  if (Array.isArray(value)) {
    items = value.flatMap((item) =>
      expandKnownSkills(typeof item === "string" ? item : item?.name),
    );
  } else if (typeof value === "string") {
    items = value.split(/[,;|]/).flatMap(expandKnownSkills);
  }

  const seen = new Set();

  return items
    .map(formatKnownSkill)
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ");
};

// --------------------------------------------------
// SKILLS CATEGORIZATION
// --------------------------------------------------

const categorizeSkills = (skillsList) => {
  const categories = {
    "Programming Languages": [],
    "Frontend Technologies": [],
    "Backend Technologies": [],
    Databases: [],
    "Tools and Frameworks": [],
  };

  const frontend = [
    "react.js",
    "next.js",
    "vue.js",
    "angular",
    "html5",
    "css3",
    "tailwind css",
    "bootstrap",
    "redux",
    "jquery",
    "vite",
  ];

  const backend = [
    "node.js",
    "express.js",
    "django",
    "flask",
    "fastapi",
    "graphql",
    "restful apis",
  ];

  const databases = [
    "mongodb",
    "mongoose",
    "mysql",
    "postgresql",
    "sqlite",
    "redis",
    "firebase",
    "supabase",
  ];

  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "c++",
    "c#",
    "php",
    "ruby",
    "go",
    "rust",
    "kotlin",
    "swift",
    "sql",
  ];

  const tools = [
    "git",
    "github",
    "gitlab",
    "docker",
    "kubernetes",
    "postman",
    "aws",
    "azure",
    "linux",
    "npm",
    "yarn",
    "jest",
    "cypress",
    "figma",
    "jira",
  ];

  for (const raw of listValue(skillsList)) {
    const rawName = typeof raw === "string" ? raw : raw?.name;

    const expandedSkills = expandKnownSkills(rawName);

    for (const skill of expandedSkills) {
      if (!skill) continue;

      const lower = skill.toLowerCase();

      let category = "Tools and Frameworks";

      if (languages.includes(lower)) {
        category = "Programming Languages";
      } else if (frontend.includes(lower)) {
        category = "Frontend Technologies";
      } else if (backend.includes(lower)) {
        category = "Backend Technologies";
      } else if (databases.includes(lower)) {
        category = "Databases";
      } else if (tools.includes(lower)) {
        category = "Tools and Frameworks";
      }

      if (!categories[category].includes(skill)) {
        categories[category].push(skill);
      }
    }
  }

  return categories;
};

const buildSkillSuggestions = (skillsList) => {
  if (!skillsList.length) {
    return [
      "Add technical skills you have practical experience with.",
      "Group skills into programming languages, frontend, backend, databases and tools.",
    ];
  }

  const categorized = categorizeSkills(skillsList);
  const recommendations = [];

  for (const [category, skills] of Object.entries(categorized)) {
    if (skills.length) {
      recommendations.push(`${category}: ${skills.join(", ")}`);
    }
  }

  const existing = skillsList
    .flatMap((skill) =>
      expandKnownSkills(typeof skill === "string" ? skill : skill?.name),
    )
    .map((skill) => skill.toLowerCase());

  const optional = [];

  if (existing.includes("react.js")) {
    if (!existing.includes("git") && !existing.includes("github")) {
      optional.push("Git");
    }

    if (
      !existing.includes("postman") &&
      existing.some((s) => s.includes("express") || s.includes("node"))
    ) {
      optional.push("Postman");
    }
  }

  if (optional.length) {
    recommendations.push(
      `Optional: Consider ${optional.join(" or ")} only if you have hands-on experience.`,
    );
  }

  return recommendations;
};

// Only allow skills that already exist in the resume.
const normalizeSuggestedSkills = (suggested, originalSkills) => {
  const originals = listValue(originalSkills);
  const requested = Array.isArray(suggested) ? suggested : originals;

  const allowed = new Map();

  originals.forEach((item) => {
    const name = textValue(typeof item === "string" ? item : item?.name);

    expandKnownSkills(name).forEach((skill) => {
      if (skill) {
        allowed.set(skill.toLowerCase(), skill);
      }
    });
  });

  const result = [];
  const seen = new Set();

  requested.forEach((item) => {
    const name = textValue(typeof item === "string" ? item : item?.name);

    expandKnownSkills(name).forEach((skill) => {
      const canonical = allowed.get(skill.toLowerCase());

      if (canonical && !seen.has(canonical.toLowerCase())) {
        seen.add(canonical.toLowerCase());
        result.push(canonical);
      }
    });
  });

  // Never accidentally remove original skills.
  originals.forEach((item) => {
    const name = textValue(typeof item === "string" ? item : item?.name);

    expandKnownSkills(name).forEach((canonical) => {
      if (canonical && !seen.has(canonical.toLowerCase())) {
        seen.add(canonical.toLowerCase());
        result.push(canonical);
      }
    });
  });

  return result;
};

// --------------------------------------------------
// EDUCATION FORMATTING
// --------------------------------------------------

const formatSpecialization = (value) => {
  const raw = textValue(value);
  const lower = raw.toLowerCase();

  const map = {
    cse: "Computer Science and Engineering",
    cs: "Computer Science",
    it: "Information Technology",
    ece: "Electronics and Communication Engineering",
    ee: "Electrical Engineering",
    mechanical: "Mechanical Engineering",
    civil: "Civil Engineering",
    ai: "Artificial Intelligence",
  };

  if (map[lower]) return map[lower];

  return raw
    .split(/\s+/)
    .map((word) =>
      ["in", "of", "and"].includes(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
};

const formatDegreeName = (degree) => {
  const raw = textValue(degree);

  const degreeFormats = [
    {
      pattern: /^b\.?\s*c\.?\s*a\.?(?:\s+in\s+(.+))?$/i,
      name: "Bachelor of Computer Applications (BCA)",
    },
    {
      pattern: /^m\.?\s*c\.?\s*a\.?(?:\s+in\s+(.+))?$/i,
      name: "Master of Computer Applications (MCA)",
    },
    {
      pattern: /^b\.?\s*tech\.?(?:\s+in\s+(.+))?$/i,
      name: "Bachelor of Technology (B.Tech)",
    },
    {
      pattern: /^m\.?\s*tech\.?(?:\s+in\s+(.+))?$/i,
      name: "Master of Technology (M.Tech)",
    },
    {
      pattern: /^b\.?\s*sc\.?(?:\s+in\s+(.+))?$/i,
      name: "Bachelor of Science (B.Sc)",
    },
    {
      pattern: /^m\.?\s*sc\.?(?:\s+in\s+(.+))?$/i,
      name: "Master of Science (M.Sc)",
    },
  ];

  for (const format of degreeFormats) {
    const match = raw.match(format.pattern);

    if (match) {
      const specialization = textValue(match[1]);

      return specialization
        ? `${format.name} in ${formatSpecialization(specialization)}`
        : format.name;
    }
  }

  return raw;
};

const normalizeUrl = (value) => {
  const raw = textValue(value);
  if (!raw) return "";

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);

    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

// --------------------------------------------------
// PROFESSIONAL SUMMARY FALLBACK
// --------------------------------------------------

const joinList = (items) => {
  if (items.length === 1) return items[0];
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const generateProfessionalSummary = (resume) => {
  const personal = resume?.personalInfo || {};
  const role = textValue(personal.jobTitle) || "Software Developer";

  const skills = listValue(resume?.skills)
    .flatMap((item) =>
      expandKnownSkills(typeof item === "string" ? item : item?.name),
    )
    .filter(Boolean);

  const uniqueSkills = [
    ...new Map(skills.map((skill) => [skill.toLowerCase(), skill])).values(),
  ];

  const projects = safeItems(resume?.projects);
  const experience = safeItems(resume?.experience);
  const education = safeItems(resume?.education);

  const internship = experience.find((item) =>
    /intern|trainee/i.test(
      `${textValue(item.jobTitle)} ${textValue(item.description)}`,
    ),
  );

  const topSkills = joinList(uniqueSkills.slice(0, 4));
  const projectNames = projects
    .map((item) => textValue(item.name))
    .filter(Boolean);

  const company = textValue(internship?.company);

  if (internship) {
    const sentence1 =
      `Motivated ${role} with practical internship experience` +
      (company ? ` at ${company}` : "") +
      (topSkills ? ` and hands-on experience in ${topSkills}.` : ".");

    const sentence2 = projectNames.length
      ? `Demonstrated ability to build applications through projects such as ${joinList(projectNames.slice(0, 2))}.`
      : "Applies programming fundamentals and structured problem-solving to software development.";

    return `${sentence1} ${sentence2} Eager to contribute technical skills and a collaborative mindset to a development team.`;
  }

  if (experience.length) {
    return `Dedicated ${role} with practical experience in ${topSkills || "software development"}. Experienced in contributing to development tasks and building reliable applications. Focused on writing maintainable code and collaborating effectively with development teams.`;
  }

  const degree = education[0] ? formatDegreeName(education[0].degree) : "";

  const opening = degree
    ? `${degree} graduate targeting a ${role} position`
    : `Motivated ${role} with a foundation in software development`;

  const projectSentence = projectNames.length
    ? `Demonstrated practical skills through projects such as ${joinList(projectNames.slice(0, 2))}.`
    : "Interested in developing modern applications and strengthening technical expertise.";

  return `${opening}, with knowledge of ${topSkills || "programming fundamentals"}. ${projectSentence} Eager to contribute problem-solving skills to a collaborative engineering team.`;
};

// --------------------------------------------------
// PROJECT REWRITE FALLBACK
// --------------------------------------------------

const rewriteProjectDescription = (project) => {
  const name = textValue(project?.name) || "this project";
  const technologies = formatTechStack(project?.technologies);

  // Correct the common Groq spelling mistake without changing other text.
  const description = textValue(project?.description).replace(
    /\bGrock(\s+API)?\b/gi,
    (_, suffix) => `Groq${suffix || ""}`,
  );

  if (!description) {
    if (technologies) {
      return `Developed ${name} using ${technologies}, implementing the core functionality described for the application.`;
    }

    return `Developed ${name}, focusing on the application's core functionality.`;
  }

  let result = description.replace(/\s+/g, " ").trim();

  const replacements = [
    [/^designed and built\b/i, "Engineered"],
    [/^built\b/i, "Developed"],
    [/^created\b/i, "Developed"],
    [/^made\b/i, "Developed"],
    [/^worked on\b/i, "Contributed to the development of"],
    [/^working on\b/i, "Contributing to the development of"],
    [/^used\b/i, "Implemented"],
    [/^using\b/i, "Using"],
    [/developing the front-end/gi, "implementing the frontend"],
    [/developing the frontend/gi, "implementing the frontend"],
    [/creating RESTful APIs/gi, "building RESTful APIs"],
    [/managing data persistence/gi, "integrating data persistence"],
    [/created reusable components/gi, "developed reusable components"],
  ];

  replacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });

  result = result.charAt(0).toUpperCase() + result.slice(1);
  result = result.replace(/[. ]*$/, ".");

  return result;
};

// --------------------------------------------------
// EXPERIENCE REWRITE FALLBACK
// --------------------------------------------------

const rewriteExperienceDescription = (experience) => {
  const description = textValue(experience?.description);
  if (!description) return "";

  const lines = description
    .split(/\n|•|;/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rewritten = lines.map((line) => {
    let result = line.replace(/^[-*]\s*/, "").trim();

    const replacements = [
      [/^(worked on|working on)\b/i, "Contributed to"],
      [/^(created|made|built)\b/i, "Developed"],
      [/^helped\b/i, "Supported"],
      [/^assisted\b/i, "Supported"],
      [/^handled\b/i, "Managed"],
      [/^responsible for\b/i, "Executed"],
      [
        /collaborated with senior developers to troubleshoot and resolve/gi,
        "partnered with senior developers to diagnose and resolve",
      ],
      [
        /applied modern JavaScript practices to improve/gi,
        "used modern JavaScript practices to optimize",
      ],
      [/front-end/gi, "frontend"],
    ];

    replacements.forEach(([pattern, replacement]) => {
      result = result.replace(pattern, replacement);
    });

    result = result.replace(
      /\bGrock(\s+API)?\b/gi,
      (_, suffix) => `Groq${suffix || ""}`,
    );

    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result.replace(/[. ]*$/, ".");
  });

  return rewritten.join(" ");
};

// --------------------------------------------------
// DETERMINISTIC RESUME SCORING
// --------------------------------------------------

const calculateDeterministicScore = (resume) => {
  const personal = resume?.personalInfo || {};
  const summary = textValue(personal.summary);

  const skills = listValue(resume?.skills)
    .flatMap((item) =>
      expandKnownSkills(typeof item === "string" ? item : item?.name),
    )
    .filter(Boolean);

  const uniqueSkills = [
    ...new Map(skills.map((skill) => [skill.toLowerCase(), skill])).values(),
  ];

  const projects = safeItems(resume?.projects);
  const experience = safeItems(resume?.experience);
  const education = safeItems(resume?.education);

  const strengths = [];
  const improvements = [];

  // Summary score
  let summaryScore = 0;

  if (summary) {
    const words = summary.split(/\s+/).length;

    summaryScore = words < 15 ? 8 : words < 30 ? 14 : 16;

    if (textValue(personal.jobTitle)) {
      summaryScore += summary
        .toLowerCase()
        .includes(textValue(personal.jobTitle).toLowerCase())
        ? 2
        : 1;
    }

    const matched = uniqueSkills.filter((skill) =>
      summary.toLowerCase().includes(skill.toLowerCase()),
    );

    summaryScore += matched.length >= 2 ? 2 : matched.length === 1 ? 1 : 0;
    summaryScore = Math.min(20, summaryScore);
  }

  // Skills score
  let skillsScore = 0;

  if (uniqueSkills.length) {
    skillsScore =
      uniqueSkills.length <= 2
        ? 7
        : uniqueSkills.length <= 4
          ? 11
          : uniqueSkills.length <= 6
            ? 15
            : 16;

    const categories = categorizeSkills(uniqueSkills);
    const populated = Object.values(categories).filter(
      (items) => items.length,
    ).length;

    skillsScore += populated >= 3 ? 4 : populated >= 2 ? 2 : 0;
    skillsScore = Math.min(20, skillsScore);
  }

  // Projects score
  let projectsScore = 0;

  const withTech = projects.filter((item) => textValue(item.technologies));

  const withDesc = projects.filter(
    (item) => textValue(item.description).length >= 40,
  );

  const withLinks = projects.filter(
    (item) => textValue(item.projectUrl) || textValue(item.githubUrl),
  );

  if (projects.length) {
    projectsScore = projects.length === 1 ? 8 : 10;

    if (withTech.length === projects.length) projectsScore += 4;
    else if (withTech.length) projectsScore += 2;

    if (withDesc.length === projects.length) projectsScore += 4;
    else if (withDesc.length) projectsScore += 2;

    if (withLinks.length) projectsScore += 2;

    projectsScore = Math.min(20, projectsScore);
  }

  // Experience score
  let experienceScore = 0;

  const entriesWithDesc = experience.filter(
    (item) => textValue(item.description).length >= 40,
  );

  const entriesWithDates = experience.filter((item) =>
    textValue(item.startDate),
  );

  if (experience.length) {
    experienceScore = 8;

    if (experience.length >= 2) experienceScore += 2;

    if (entriesWithDesc.length === experience.length) {
      experienceScore += 6;
    } else if (entriesWithDesc.length) {
      experienceScore += 3;
    }

    experienceScore += entriesWithDates.length === experience.length ? 4 : 2;
    experienceScore = Math.min(20, experienceScore);
  } else if (
    projects.length >= 2 &&
    projects.every(
      (item) => textValue(item.description) && textValue(item.technologies),
    )
  ) {
    experienceScore = 15;
  } else if (projects.length && textValue(projects[0].description)) {
    experienceScore = 10;
  } else {
    experienceScore = 4;
  }

  // Education score
  let educationScore = 0;

  if (education.length) {
    const primary = education[0];

    if (textValue(primary.degree)) educationScore += 6;
    if (textValue(primary.institution)) educationScore += 6;

    if (textValue(primary.startYear) || textValue(primary.endYear)) {
      educationScore += 4;
    }

    educationScore +=
      textValue(primary.description) || education.length > 1 ? 4 : 2;

    educationScore = Math.min(20, educationScore);
  }

  // Feedback after all scores are finalized
  if (!summary) {
    improvements.push(
      "Add a professional summary highlighting your skills, background and career focus.",
    );
  } else if (summaryScore <= 14) {
    improvements.push(
      "Expand your summary with specific technologies and your target role.",
    );
  } else if (summaryScore >= 18) {
    strengths.push(
      "Professional summary is comprehensive, well-structured, and aligned with your target role.",
    );
  }

  if (!uniqueSkills.length) {
    improvements.push(
      "Add relevant technical skills across programming languages, frontend, backend and databases.",
    );
  } else if (skillsScore >= 18) {
    strengths.push(
      "Skills profile is diverse and well-distributed across technical domains.",
    );
  } else {
    improvements.push(
      "Add relevant technologies you have practical experience with and organize them into categories.",
    );
  }

  if (!projects.length) {
    improvements.push(
      "Add practical development projects with descriptions, technologies and repository links.",
    );
  } else if (projectsScore >= 18) {
    strengths.push(
      "Projects are well-documented with descriptions and technology stacks.",
    );

    if (projects.length === 1) {
      improvements.push(
        "Your project is well-documented. Optionally, a second project can demonstrate additional technical range.",
      );
    }
  } else {
    improvements.push(
      "Improve project descriptions, technology stacks and repository links where available.",
    );
  }

  if (experience.length) {
    if (experienceScore >= 17) {
      strengths.push(
        "Internship or work experience is clearly articulated with responsibilities and timeframes.",
      );
    } else {
      improvements.push(
        "Add clear responsibilities, technologies and accurate dates to your experience entries.",
      );
    }
  } else {
    improvements.push(
      "Include internships, relevant technical training or substantial projects where applicable.",
    );
  }

  if (!education.length) {
    improvements.push("Add your degree, institution and study dates.");
  } else if (educationScore >= 18) {
    strengths.push(
      "Education details include the degree, institution and timeline.",
    );
  }

  const overall =
    summaryScore +
    skillsScore +
    projectsScore +
    experienceScore +
    educationScore;

  const ats = [
    "Use standard section headings and consistent date formats.",
    "List specific technologies in your Skills section and relevant Project or Experience descriptions.",
  ];

  if (!textValue(personal.email)) {
    ats.push("Include a professional email address.");
  }

  if (!textValue(personal.phone)) {
    ats.push("Include a contact phone number.");
  }

  if (!textValue(personal.linkedin)) {
    ats.push("Add your LinkedIn profile URL if available.");
  }

  return {
    score: {
      overall,
      summary: summaryScore,
      skills: skillsScore,
      projects: projectsScore,
      experience: experienceScore,
      education: educationScore,
      strengths: strengths.slice(0, 4),
      improvements: improvements.slice(0, 6),
      ats: ats.slice(0, 4),
    },
  };
};

// --------------------------------------------------
// CONTEXTUAL RECOMMENDATIONS
// --------------------------------------------------

const buildContextualRecommendations = (resume) => {
  const personal = resume?.personalInfo || {};
  const skills = listValue(resume?.skills);
  const projects = safeItems(resume?.projects);
  const experience = safeItems(resume?.experience);
  const education = safeItems(resume?.education);

  const recommendations = [];

  if (!textValue(personal.summary)) {
    recommendations.push(
      "Add a concise professional summary based on your verified skills and career goals.",
    );
  }

  if (!skills.length) {
    recommendations.push(
      "Add technical skills that you can confidently explain in an interview.",
    );
  }

  if (!projects.length) {
    recommendations.push(
      "Add practical projects with accurate descriptions and technology stacks.",
    );
  } else {
    const incomplete = projects.some(
      (item) => !textValue(item.description) || !textValue(item.technologies),
    );

    if (incomplete) {
      recommendations.push(
        "Complete project descriptions and technology stacks using only features you actually implemented.",
      );
    }

    if (
      projects.length === 1 &&
      textValue(projects[0].description) &&
      textValue(projects[0].technologies)
    ) {
      recommendations.push(
        "Optionally add a second project to demonstrate a broader range of technical skills.",
      );
    }
  }

  if (!experience.length) {
    recommendations.push(
      "Include internships or relevant technical training if completed.",
    );
  } else if (experience.some((item) => !textValue(item.description))) {
    recommendations.push(
      "Add specific responsibilities and tools used in your experience.",
    );
  }

  if (
    education.length &&
    education.some(
      (item) => !textValue(item.degree) || !textValue(item.institution),
    )
  ) {
    recommendations.push(
      "Complete your official degree and institution details.",
    );
  }

  if (!textValue(personal.linkedin)) {
    recommendations.push("Add your LinkedIn profile URL if you have one.");
  }

  // Suggest GitHub only when projects exist and no GitHub profile
  // or project repository link has been provided.
  if (
    projects.length &&
    !textValue(personal.github) &&
    !projects.some((item) => textValue(item.githubUrl))
  ) {
    recommendations.push(
      "Add your GitHub profile or project repository links if available.",
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      "Tailor your resume keywords and project descriptions to each job application.",
    );
  }

  return [...new Set(recommendations)].slice(0, 5);
};

// --------------------------------------------------
// SECTION-WISE RECOMMENDATIONS
// --------------------------------------------------

const buildSectionRecommendations = (resume) => {
  const personal = resume?.personalInfo || {};
  const projects = safeItems(resume?.projects);
  const experience = safeItems(resume?.experience);
  const education = safeItems(resume?.education);
  const skills = listValue(resume?.skills);

  const projectRecommendations = [];

  if (!projects.length) {
    projectRecommendations.push(
      "Add practical projects with their actual features and technology stacks.",
    );
  } else {
    projects.forEach((item) => {
      const name = textValue(item.name) || "this project";

      if (!textValue(item.description)) {
        projectRecommendations.push(
          `Add a clear description explaining the features implemented in ${name}.`,
        );
      }

      if (!textValue(item.technologies)) {
        projectRecommendations.push(
          `List the actual technologies used in ${name}.`,
        );
      }
    });

    if (!projectRecommendations.length) {
      projectRecommendations.push(
        "Project descriptions and stacks are present. Use action-oriented wording to explain your actual implementation.",
      );
    }
  }

  const experienceRecommendations = [];

  if (!experience.length) {
    experienceRecommendations.push(
      "Include relevant internships or technical training if completed.",
    );
  } else {
    experience.forEach((item) => {
      if (!textValue(item.description)) {
        experienceRecommendations.push(
          `Add responsibilities and tools used in ${textValue(item.jobTitle) || "this role"}.`,
        );
      }
    });

    if (!experienceRecommendations.length) {
      experienceRecommendations.push(
        "Highlight specific technical tasks and responsibilities without inventing achievements.",
      );
    }
  }

  const educationRecommendations = [];

  if (!education.length) {
    educationRecommendations.push(
      "Add your degree, institution and study dates.",
    );
  } else if (
    education.some(
      (item) => !textValue(item.degree) || !textValue(item.institution),
    )
  ) {
    educationRecommendations.push(
      "Ensure your degree and institution names match your official documents.",
    );
  }

  return {
    skills: buildSkillSuggestions(skills),
    projects: projectRecommendations.slice(0, 4),
    experience: experienceRecommendations.slice(0, 4),
    education: educationRecommendations,
    summary: !textValue(personal.summary)
      ? [
          "Add a concise summary based on your verified skills, education and projects.",
        ]
      : [],
  };
};

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

module.exports = {
  KNOWN_SKILLS_MAP,
  textValue,
  listValue,
  safeItems,
  formatKnownSkill,
  formatTechStack,
  categorizeSkills,
  buildSkillSuggestions,
  normalizeSuggestedSkills,
  formatDegreeName,
  normalizeUrl,
  generateProfessionalSummary,
  rewriteProjectDescription,
  rewriteExperienceDescription,
  calculateDeterministicScore,
  buildContextualRecommendations,
  buildSectionRecommendations,
};
