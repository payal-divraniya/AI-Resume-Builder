const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");

// Support both CLIENT_ORIGIN and older CLIENT_URL.
const configuredOrigins = [process.env.CLIENT_ORIGIN, process.env.CLIENT_URL]
  .filter(Boolean)
  .flatMap((value) => value.split(","));

const developmentOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
      ];

const allowedOrigins = [
  ...new Set([...configuredOrigins, ...developmentOrigins]),
]
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin is not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use("/api/auth", authRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Builder API is working",
  });
});

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is working",
  });
});

// RESUME ROUTES
app.use("/api/resumes", resumeRoutes);

// GROQ AI PROVIDER CONFIGURATION
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const extractJson = (content) => {
  const cleaned = String(content || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }

    throw new Error("Groq returned invalid JSON.");
  }
};

// NORMALIZE BRAND NAME
const normalizeBrandTerms = (value) =>
  textValue(value).replace(/\bGrock\s*API\b/gi, "Groq API");

// GROQ API REQUEST + RETRY
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateGroqResponse = async (prompt, options = {}) => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error(
      "Groq API key is not configured. Add GROQ_API_KEY to server/.env.",
    );

    error.status = 503;
    throw error;
  }

  const maxAttempts = 2;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      console.log(
        `Sending Groq request using model: ${GROQ_MODEL} (attempt ${attempt}/${maxAttempts})`,
      );

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are a senior professional resume writer and ATS specialist. Return exactly one valid JSON object. Never hallucinate facts, metrics, tools, or dates. Do not use Markdown fences.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],

            ...(attempt === 1
              ? { response_format: { type: "json_object" } }
              : {}),

            temperature: 0.25,
            max_tokens: Math.max(
              500,
              Math.min(3500, Number(options.maxTokens) || 2000),
            ),
          }),
        },
      );

      const rawBody = await response.text();
      let data;

      try {
        data = JSON.parse(rawBody);
      } catch {
        const parseError = new Error(
          `Groq returned an unreadable HTTP response (${response.status}).`,
        );

        parseError.status = response.status;
        throw parseError;
      }

      if (!response.ok) {
        const error = new Error(
          data?.error?.message ||
            `Groq request failed with HTTP ${response.status}.`,
        );

        error.status = response.status;
        throw error;
      }

      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Groq returned an empty response.");
      }

      const parsed = extractJson(content);

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Groq response did not contain a JSON object.");
      }

      console.log("Groq response received successfully.");

      return parsed;
    } catch (error) {
      if (error.name === "AbortError") {
        lastError = new Error("Groq request timed out after 25 seconds.");
        lastError.status = 504;
      } else {
        lastError = error;
      }

      const jsonModeRejected =
        Number(lastError.status) === 400 &&
        /failed to generate json|json.*format|response_format/i.test(
          lastError.message,
        );

      const retryable =
        !lastError.status ||
        [429, 500, 502, 503, 504].includes(Number(lastError.status)) ||
        (jsonModeRejected && attempt === 1);

      if (attempt < maxAttempts && retryable) {
        await sleep(1200);
        continue;
      }

      throw lastError;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Groq request failed.");
};

// IMPORT REUSABLE HELPERS
const {
  textValue,
  listValue,
  safeItems,
  formatKnownSkill,
  formatTechStack,
  buildSkillSuggestions,
  normalizeSuggestedSkills,
  formatDegreeName,
  generateProfessionalSummary,
  rewriteProjectDescription,
  rewriteExperienceDescription,
  calculateDeterministicScore,
  buildContextualRecommendations,
  buildSectionRecommendations,
} = require("./helpers");

// OFFLINE, FACT-PRESERVING LOCAL FALLBACK
const localAnalyze = (resume) => {
  const p = resume?.personalInfo || {};

  const skills = listValue(resume?.skills)
    .map((skill) =>
      formatKnownSkill(typeof skill === "string" ? skill : skill?.name),
    )
    .filter(Boolean);

  const projects = safeItems(resume?.projects);

  const verifiedSkills = [
    ...new Set([
      ...skills,
      ...projects.flatMap((project) =>
        formatTechStack(project.technologies).split(", ").filter(Boolean),
      ),
    ]),
  ];

  const experience = safeItems(resume?.experience);
  const education = safeItems(resume?.education);
  const summary = textValue(p.summary);

  const currentProjects = projects.map((item, index) => ({
    id: item.id ?? index + 1,
    name: textValue(item.name),
    technologies: formatTechStack(item.technologies),
    projectUrl: textValue(item.projectUrl),
    githubUrl: textValue(item.githubUrl),
    description: normalizeBrandTerms(item.description),
  }));

  const currentExperience = experience.map((item, index) => ({
    id: item.id ?? index + 1,
    jobTitle: textValue(item.jobTitle),
    company: textValue(item.company),
    location: textValue(item.location),
    startDate: textValue(item.startDate),
    endDate: textValue(item.endDate),
    description: textValue(item.description),
  }));

  const currentEducation = education.map((item, index) => ({
    id: item.id ?? index + 1,
    degree: textValue(item.degree),
    institution: textValue(item.institution),
    startYear: textValue(item.startYear),
    endYear: textValue(item.endYear),
    description: textValue(item.description),
  }));

  const scoreResult = calculateDeterministicScore(resume);
  const contextualRecommendations = buildContextualRecommendations(resume);
  const sectionRecommendations = buildSectionRecommendations(resume);

  return {
    summary: {
      current: summary,
      suggested: generateProfessionalSummary(resume),
    },

    skills: {
      current: skills,
      suggested: normalizeSuggestedSkills(verifiedSkills, verifiedSkills),
      suggestions: buildSkillSuggestions(verifiedSkills),
    },

    projects: {
      current: currentProjects,
      suggested: currentProjects.map((item) => ({
        ...item,
        technologies: formatTechStack(item.technologies),
        description:
          normalizeBrandTerms(rewriteProjectDescription(item)) ||
          item.description,
      })),
      suggestions: sectionRecommendations.projects,
    },

    experience: {
      current: currentExperience,
      suggested: currentExperience.map((item) => ({
        ...item,
        description: rewriteExperienceDescription(item) || item.description,
      })),
      suggestions: sectionRecommendations.experience,
    },

    education: {
      current: currentEducation,
      suggested: currentEducation.map((item) => ({
        ...item,
        degree: formatDegreeName(item.degree) || item.degree,
      })),
      suggestions: sectionRecommendations.education,
    },

    overall: {
      suggestions: contextualRecommendations,
    },

    score: scoreResult.score,
  };
};

const localRewrite = (type, content) => {
  if (type === "summary") {
    const raw = textValue(content);

    if (!raw) return "";

    let cleaned = raw
      .replace(/\s+/g, " ")
      .replace(/\b(i am|i'm)\b/gi, "A candidate")
      .replace(/\b(my skills include)\b/gi, "Skilled in");

    return (
      cleaned.charAt(0).toUpperCase() + cleaned.slice(1).replace(/[. ]*$/, ".")
    );
  }

  const item = content && typeof content === "object" ? { ...content } : {};

  if (type === "project") {
    item.technologies = formatTechStack(item.technologies);
    item.description = normalizeBrandTerms(rewriteProjectDescription(item));
    return item;
  }

  if (type === "experience") {
    item.description = rewriteExperienceDescription(item);
    return item;
  }

  if (type === "education") {
    item.degree = formatDegreeName(item.degree);
    return item;
  }

  return item;
};

// TEXT COMPARISON & NORMALIZATION HELPERS
const toTextList = (value, fallback = []) =>
  Array.isArray(value)
    ? value
        .map((item) => textValue(item))
        .filter(Boolean)
        .slice(0, 8)
    : fallback;

const comparisonText = (value) =>
  textValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isSameText = (first, second) => {
  const a = comparisonText(first);
  const b = comparisonText(second);

  return Boolean(a && b && a === b);
};

// NORMALIZE AND VALIDATE AI OUTPUT
const normalizeAnalysis = (raw, resume) => {
  const base = localAnalyze(resume);
  const contextualRecommendations = buildContextualRecommendations(resume);
  const sectionRecommendations = buildSectionRecommendations(resume);

  const data = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};

  const p = resume?.personalInfo || {};

  const skills = listValue(resume?.skills)
    .map((item) => textValue(typeof item === "string" ? item : item?.name))
    .filter(Boolean);

  const sourceProjects = safeItems(resume?.projects);

  const verifiedSkills = [
    ...new Set([
      ...skills,
      ...sourceProjects.flatMap((project) =>
        formatTechStack(project.technologies).split(", ").filter(Boolean),
      ),
    ]),
  ];

  const sourceExperience = safeItems(resume?.experience);
  const sourceEducation = safeItems(resume?.education);

  const sourceCertifications = safeItems(
    resume?.certifications || resume?.certificates,
  );

  const currentProjects = base.projects.current;
  const currentExperience = base.experience.current;
  const currentEducation = base.education.current;

  const projectSuggestions = safeItems(data.projects?.suggested);
  const experienceSuggestions = safeItems(data.experience?.suggested);
  const educationSuggestions = safeItems(data.education?.suggested);

  const findAiItem = (suggestions, original, index) => {
    const byId = suggestions.find(
      (candidate) =>
        candidate.id != null &&
        original?.id != null &&
        String(candidate.id) === String(original.id),
    );

    return byId || suggestions[index] || {};
  };

  const projects = currentProjects.map((item, index) => {
    const original = sourceProjects[index] || {};
    const ai = findAiItem(projectSuggestions, original, index);

    const originalDescription = normalizeBrandTerms(original.description);
    const aiDesc = normalizeBrandTerms(ai.description);

    return {
      ...item,
      name: textValue(original.name),
      technologies: formatTechStack(original.technologies || ai.technologies),
      projectUrl: textValue(original.projectUrl),
      githubUrl: textValue(original.githubUrl),

      description: originalDescription
        ? aiDesc && !isSameText(aiDesc, originalDescription)
          ? aiDesc
          : normalizeBrandTerms(rewriteProjectDescription(original))
        : aiDesc || normalizeBrandTerms(rewriteProjectDescription(original)),
    };
  });

  const experience = currentExperience.map((item, index) => {
    const original = sourceExperience[index] || {};
    const ai = findAiItem(experienceSuggestions, original, index);

    const originalDescription = textValue(original.description);
    const aiDesc = textValue(ai.description);

    return {
      ...item,
      jobTitle: textValue(original.jobTitle),
      company: textValue(original.company),
      location: textValue(original.location),
      startDate: textValue(original.startDate),
      endDate: textValue(original.endDate),

      description: originalDescription
        ? aiDesc && !isSameText(aiDesc, originalDescription)
          ? aiDesc
          : rewriteExperienceDescription(original)
        : aiDesc || rewriteExperienceDescription(original),
    };
  });

  const education = currentEducation.map((item, index) => {
    const original = sourceEducation[index] || {};
    const ai = findAiItem(educationSuggestions, original, index);

    const originalDescription = textValue(original.description);
    const aiDesc = textValue(ai.description);

    return {
      ...item,
      degree: formatDegreeName(original.degree),
      institution: textValue(original.institution),
      startYear: textValue(original.startYear),
      endYear: textValue(original.endYear),

      description: originalDescription
        ? aiDesc && !isSameText(aiDesc, originalDescription)
          ? aiDesc
          : originalDescription
        : "",
    };
  });

  // Deterministic score ensures consistent scoring.
  const deterministicScore = calculateDeterministicScore(resume).score;

  const rawScore =
    data.score && typeof data.score === "object" ? data.score : {};

  const aiStrengths = toTextList(rawScore.strengths, []);

  const combinedStrengths = [
    ...new Set([...deterministicScore.strengths, ...aiStrengths]),
  ].slice(0, 4);

  const score = {
    ...deterministicScore,
    strengths: combinedStrengths.length
      ? combinedStrengths
      : deterministicScore.strengths,
  };

  const aiCertifications = safeItems(
    data.certifications?.suggested || data.certifications,
  );

  const certifications = sourceCertifications.map((item, index) => ({
    id: item.id ?? index + 1,
    name: textValue(item.name || item.certificationName || item.title),
    issuer: textValue(item.issuer || item.organization),
    date: textValue(item.date || item.issueDate),
    credentialUrl: textValue(item.credentialUrl || item.url),
    explanation: textValue(aiCertifications[index]?.explanation),
  }));

  const ats =
    data.atsAnalysis && typeof data.atsAnalysis === "object"
      ? data.atsAnalysis
      : {};

  const atsAnalysis = {
    score: score.overall,
    strengths: toTextList(ats.strengths, score.strengths),
    weaknesses: toTextList(ats.weaknesses, score.improvements),
    missingKeywords: toTextList(ats.missingKeywords),
    recommendations: contextualRecommendations.slice(0, 4),
  };

  const certificationSuggestions = sourceCertifications.length
    ? toTextList(data.certifications?.suggestions, [
        "Keep certification names, issuers, dates, and credential links consistent with the original records.",
      ])
    : [];

  const overallSuggestions = contextualRecommendations;

  const rawSummarySuggested = textValue(
    data.summary?.suggested || data.summary?.improved,
  );

  const summarySuggested =
    rawSummarySuggested &&
    !isSameText(rawSummarySuggested, textValue(p.summary))
      ? rawSummarySuggested
      : base.summary.suggested;

  return {
    summary: {
      current: textValue(p.summary),
      suggested: summarySuggested,
      explanation: textValue(data.summary?.explanation),
      status: textValue(data.summary?.status) || "review",
    },

    skills: {
      current: skills,
      suggested: normalizeSuggestedSkills(
        data.skills?.suggested,
        verifiedSkills,
      ),
      suggestions: buildSkillSuggestions(verifiedSkills),
    },

    projects: {
      current: currentProjects,
      suggested: projects,
      suggestions: sectionRecommendations.projects.length
        ? sectionRecommendations.projects
        : base.projects.suggestions,
    },

    experience: {
      current: currentExperience,
      suggested: experience,
      suggestions: sectionRecommendations.experience.length
        ? sectionRecommendations.experience
        : base.experience.suggestions,
    },

    education: {
      current: currentEducation,
      suggested: education,
      suggestions: sectionRecommendations.education.length
        ? sectionRecommendations.education
        : base.education.suggestions,
    },

    certifications: {
      current: certifications,
      suggested: certifications,
      suggestions: certificationSuggestions,
    },

    overall: {
      suggestions: overallSuggestions,
      feedback:
        textValue(data.overall?.feedback) ||
        overallSuggestions[0] ||
        "Review the recommendations and tailor the resume to each role.",

      priorityImprovements: toTextList(
        data.overall?.priorityImprovements,
        score.improvements,
      ),
    },

    score,
    atsAnalysis,
  };
};

// GROQ -> LOCAL FALLBACK
const generateAIResponse = async (prompt, localFallback, options = {}) => {
  try {
    console.log("Using Groq AI provider...");

    const data = await generateGroqResponse(prompt, options);

    return {
      data,
      provider: "groq",
    };
  } catch (groqError) {
    console.error(
      `Groq failed (HTTP ${groqError.status || "unknown"}): ${groqError.message}`,
    );

    console.warn(
      "Using offline local fallback because Groq did not complete the request.",
    );

    return {
      data: localFallback(),
      provider: "local",
    };
  }
};

// AI ERROR HANDLER
const sendAIError = (res, error, operation) => {
  const status = Number(error?.status || error?.statusCode || 0);
  const message = String(error?.message || error || "");

  console.error(
    `${operation} failed (status ${status || "unknown"}):`,
    message,
  );

  if (status === 401 || status === 403) {
    return res.status(502).json({
      success: false,
      message: "Groq authentication failed. Check GROQ_API_KEY in server/.env.",
    });
  }

  if (status === 429) {
    return res.status(429).json({
      success: false,
      message: "Groq rate limit reached. Please wait a moment and try again.",
    });
  }

  if (status === 400) {
    return res.status(400).json({
      success: false,
      message:
        "Groq could not process this request. Please check the resume data and model setting.",
    });
  }

  if ([500, 502, 503, 504].includes(status)) {
    return res.status(503).json({
      success: false,
      message: "Groq is temporarily unavailable. Please try again shortly.",
    });
  }

  return res.status(500).json({
    success: false,
    message: message || "AI processing failed. Please try again later.",
  });
};

// COMPACT RESUME FOR AI PROMPTS
const compactAnalysisResume = (resume) => {
  const clip = (value, max = 700) => normalizeBrandTerms(value).slice(0, max);

  const p = resume?.personalInfo || {};

  const skills = listValue(resume?.skills)
    .map((item) =>
      clip(formatKnownSkill(typeof item === "string" ? item : item?.name), 80),
    )
    .filter(Boolean)
    .slice(0, 30);

  const projects = safeItems(resume?.projects)
    .slice(0, 4)
    .map((item, index) => ({
      id: item.id ?? index + 1,
      name: clip(item.name, 120),
      technologies: clip(formatTechStack(item.technologies), 180),
      description: clip(item.description, 700),
      projectUrl: clip(item.projectUrl, 180),
      githubUrl: clip(item.githubUrl, 180),
    }));

  const experience = safeItems(resume?.experience)
    .slice(0, 4)
    .map((item, index) => ({
      id: item.id ?? index + 1,
      jobTitle: clip(item.jobTitle, 120),
      company: clip(item.company, 120),
      location: clip(item.location, 100),
      startDate: clip(item.startDate, 40),
      endDate: clip(item.endDate, 40),
      description: clip(item.description, 700),
    }));

  const education = safeItems(resume?.education)
    .slice(0, 4)
    .map((item, index) => ({
      id: item.id ?? index + 1,
      degree: clip(formatDegreeName(item.degree), 120),
      institution: clip(item.institution, 160),
      startYear: clip(item.startYear, 40),
      endYear: clip(item.endYear, 40),
      description: clip(item.description, 500),
    }));

  const certifications = safeItems(
    resume?.certifications || resume?.certificates,
  )
    .slice(0, 6)
    .map((item) => ({
      name: clip(item.name || item.certificationName || item.title, 140),
      issuer: clip(item.issuer || item.organization, 120),
      date: clip(item.date || item.issueDate, 40),
      credentialUrl: clip(item.credentialUrl || item.url, 180),
    }));

  return {
    personalInfo: {
      jobTitle: clip(p.jobTitle, 120),
      summary: clip(p.summary, 900),
      linkedin: clip(p.linkedin, 180),
      github: clip(p.github, 180),
      website: clip(p.website, 180),
    },
    skills,
    projects,
    experience,
    education,
    certifications,
  };
};

// AI RESUME ANALYSIS ENDPOINT
app.post("/api/ai/analyze", authMiddleware, async (req, res) => {
  try {
    const resume = req.body;

    if (!resume || typeof resume !== "object" || Array.isArray(resume)) {
      return res.status(400).json({
        success: false,
        message: "Valid resume information is required.",
      });
    }

    console.log("Resume received from React for AI analysis.");

    const targetRole =
      textValue(resume.personalInfo?.jobTitle) ||
      "the candidate's most relevant role based on the supplied resume";

    const analysisResume = compactAnalysisResume(resume);

    const prompt = `
You are a senior ATS resume editor.
Analyze the candidate's resume for this target role: ${targetRole}.

SOURCE RESUME (the only source of facts):
${JSON.stringify(analysisResume, null, 2)}

Return exactly one JSON object with this structure:
{
  "summary": {
    "suggested": "A polished 2-3 sentence summary using only supplied facts."
  },
  "skills": {
    "suggested": ["Only skills already present in the source resume"]
  },
  "projects": {
    "suggested": [
      {
        "id": 1,
        "description": "Rewritten project description"
      }
    ]
  },
  "experience": {
    "suggested": [
      {
        "id": 1,
        "description": "Rewritten experience description"
      }
    ]
  },
  "education": {
    "suggested": [
      {
        "id": 1,
        "degree": "Standardized degree name",
        "description": "Polished factual description"
      }
    ]
  },
  "overall": {
    "feedback": "One concise assessment"
  }
}

Instructions:
- Include one project/experience/education object for each matching source item, preserving its id exactly.
- Rewrite project and experience descriptions with different sentence structure and stronger action-led wording.
- Do not merely copy the source.
- Keep every factual detail supported by the source.
- Do not invent metrics, tools, features, duties, outcomes, dates, education or credentials.
- Skills must be explicitly stated in the resume, including the Skills section and named project technology stacks.
- Do not infer or add unmentioned technologies.
- Keep summary to 2-3 concise sentences.
- Do not invent experience or seniority.
- Always spell the API provider name exactly as "Groq API", never "Grock API".
- Return valid JSON only.
- Do not use Markdown fences or add text outside the JSON object.
`;

    let result = await generateAIResponse(prompt, () => localAnalyze(resume), {
      maxTokens: 2400,
    });

    let aiSuggestions = normalizeAnalysis(result.data, resume);

    const hasCopiedContent =
      isSameText(
        aiSuggestions.summary.suggested,
        aiSuggestions.summary.current,
      ) ||
      aiSuggestions.projects.suggested.some((item, index) =>
        isSameText(
          item.description,
          aiSuggestions.projects.current[index]?.description,
        ),
      ) ||
      aiSuggestions.experience.suggested.some((item, index) =>
        isSameText(
          item.description,
          aiSuggestions.experience.current[index]?.description,
        ),
      );

    if (result.provider === "groq" && hasCopiedContent) {
      console.warn("Requesting a second professional rewrite attempt...");

      const retryPrompt = `${prompt}

SECOND PASS:
The previous output copied one or more source descriptions.
Rewrite those descriptions with a genuinely different sentence structure and concise action-led language.
Preserve all source facts.
Return the same JSON object structure only.`;

      const retryResult = await generateAIResponse(
        retryPrompt,
        () => localAnalyze(resume),
        { maxTokens: 2400 },
      );

      if (retryResult.provider === "groq") {
        result = retryResult;
        aiSuggestions = normalizeAnalysis(result.data, resume);
      }
    }

    console.log("AI Resume Score:", aiSuggestions.score.overall);

    return res.json({
      success: true,
      suggestions: aiSuggestions,
      provider: result.provider,
    });
  } catch (error) {
    return sendAIError(res, error, "Groq resume analysis");
  }
});

// AI REWRITE ENDPOINT
app.post("/api/ai/rewrite", authMiddleware, async (req, res) => {
  try {
    const { type, content } = req.body || {};

    const allowedTypes = ["summary", "project", "experience", "education"];

    if (!type || !allowedTypes.includes(type) || content == null) {
      return res.status(400).json({
        success: false,
        message: "A valid rewrite type and content are required.",
      });
    }

    if (typeof content === "string" && !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rewrite content cannot be empty.",
      });
    }

    console.log(`AI Rewrite requested for: ${type}`);

    const targetRole =
      textValue(req.body?.targetRole) || "the candidate's stated target role";

    const sourceContent =
      typeof content === "string"
        ? normalizeBrandTerms(content)
        : JSON.stringify(
            type === "project"
              ? {
                  ...content,
                  description: normalizeBrandTerms(content.description),
                }
              : content,
            null,
            2,
          );

    const schemas = {
      summary: '{"rewritten":"2-3 sentence professional summary"}',

      project:
        '{"rewritten":{"id":"same id","name":"same name","technologies":"same verified technologies","projectUrl":"same URL","githubUrl":"same URL","description":"rewritten factual description"}}',

      experience:
        '{"rewritten":{"id":"same id","jobTitle":"same title","company":"same company","location":"same location","startDate":"same date","endDate":"same date","description":"rewritten factual description"}}',

      education:
        '{"rewritten":{"id":"same id","degree":"professional degree name","institution":"same institution","startYear":"same year","endYear":"same year","description":"polished factual description"}}',
    };

    const rewriteTask = {
      summary:
        "Rewrite the professional summary in 2-3 concise sentences. Improve flow, clarity, and recruiter impact while retaining only facts in the supplied summary.",

      project:
        "Rewrite the project description as a clear, action-led resume entry. Explain the stated project purpose, implementation, and technologies. Use a noticeably different sentence structure from the source, but do not add features or results.",

      experience:
        "Rewrite the experience description into concise, action-led resume language. Improve sentence structure and readability while preserving the actual duties and tools. Do not inflate the candidate's responsibility level.",

      education:
        "Polish the education description and standardize the degree wording where appropriate. Keep institution, years, and subject details exactly grounded in the source.",
    };

    const prompt = `
You are a senior professional resume writer and ATS editor.

Target role: ${targetRole}

Task:
${rewriteTask[type]}

Source content (the only source of facts):
${sourceContent}

Strict rules:
- Produce a meaningful rewrite, not a verbatim copy or a few synonym swaps.
- Preserve factual meaning and all supplied identifiers, links and dates.
- Never invent metrics, achievements, duties, tools, coursework, technologies or qualifications.
- If a fact is unclear, omit it rather than guessing.
- Always spell the API provider name exactly as "Groq API", never "Grock API".
- Return exactly one valid JSON object matching this structure:
${schemas[type]}
- Return JSON only, without Markdown fences or commentary.
`;

    let result = await generateAIResponse(prompt, () => ({
      rewritten: localRewrite(type, content),
    }));

    if (result.data.rewritten === undefined || result.data.rewritten === null) {
      throw new Error("Groq did not return the rewritten content.");
    }

    const initialRewrite = result.data.rewritten;

    const originalText =
      type === "summary"
        ? content
        : content && typeof content === "object"
          ? content.description
          : "";

    const proposedText =
      type === "summary"
        ? initialRewrite
        : initialRewrite && typeof initialRewrite === "object"
          ? initialRewrite.description
          : "";

    if (result.provider === "groq" && isSameText(proposedText, originalText)) {
      console.warn(`Requesting a second ${type} rewrite attempt...`);

      const retryPrompt = `${prompt}

SECOND-PASS REQUIREMENT:
Your previous response repeated the original description.
Rewrite it with noticeably clearer structure, stronger professional wording, and better information flow.
Do not just exchange a few words.
Keep every factual claim supported by the supplied content.
Never invent achievements, metrics, duties, tools, coursework, or qualifications.
Return the same required JSON structure.`;

      const retryResult = await generateAIResponse(retryPrompt, () => ({
        rewritten: localRewrite(type, content),
      }));

      if (retryResult.data?.rewritten != null) {
        const retryText =
          type === "summary"
            ? retryResult.data.rewritten
            : retryResult.data.rewritten &&
                typeof retryResult.data.rewritten === "object"
              ? retryResult.data.rewritten.description
              : "";

        if (
          retryResult.provider === "local" ||
          (retryResult.provider === "groq" &&
            !isSameText(retryText, originalText))
        ) {
          result = retryResult;
        }
      }
    }

    let rewritten = result.data.rewritten;

    if (type === "summary") {
      rewritten = normalizeBrandTerms(rewritten) || localRewrite(type, content);
    } else if (
      rewritten &&
      typeof rewritten === "object" &&
      !Array.isArray(rewritten)
    ) {
      rewritten = {
        ...content,
        ...rewritten,
      };

      if (type === "project") {
        rewritten.technologies = formatTechStack(
          rewritten.technologies || content.technologies,
        );

        rewritten.description = normalizeBrandTerms(rewritten.description);
      } else if (type === "education") {
        rewritten.degree = formatDegreeName(rewritten.degree || content.degree);
      }

      const immutableFields =
        type === "project"
          ? ["id", "name", "projectUrl", "githubUrl"]
          : type === "experience"
            ? ["id", "jobTitle", "company", "location", "startDate", "endDate"]
            : ["id", "institution", "startYear", "endYear"];

      immutableFields.forEach((field) => {
        if (content && Object.prototype.hasOwnProperty.call(content, field)) {
          rewritten[field] = content[field];
        }
      });

      if (
        typeof content?.description === "string" &&
        !textValue(rewritten.description)
      ) {
        rewritten.description = content.description;
      }
    } else {
      rewritten = localRewrite(type, content);
    }

    return res.json({
      success: true,
      rewritten,
      provider: result.provider,
    });
  } catch (error) {
    return sendAIError(res, error, "Groq AI rewrite");
  }
});

// CONNECT MONGODB + START SERVER
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Groq model configured: ${GROQ_MODEL}`);

      console.log(
        `Groq API key configured: ${Boolean(process.env.GROQ_API_KEY)}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
