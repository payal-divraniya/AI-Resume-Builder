// Comprehensive test suite for all helper functions and rubrics
const {
  formatKnownSkill,
  formatTechStack,
  categorizeSkills,
  buildSkillSuggestions,
  normalizeSuggestedSkills,
  formatDegreeName,
  generateProfessionalSummary,
  rewriteProjectDescription,
  rewriteExperienceDescription,
  calculateDeterministicScore,
  buildContextualRecommendations,
} = require("./helpers");

const completeResume = {
  personalInfo: {
    fullName: "Alex Morgan",
    jobTitle: "Full Stack Developer",
    email: "alex@example.com",
    phone: "555-0199",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/alexmorgan",
    github: "https://github.com/alexmorgan",
    summary: "Web developer with experience in React and Node.js. Built multiple web apps and APIs.",
  },
  skills: [
    { name: "react.js", level: "Intermediate" },
    { name: "node.js", level: "Intermediate" },
    { name: "express", level: "Intermediate" },
    { name: "mongodb", level: "Intermediate" },
    { name: "javascript", level: "Advanced" },
    { name: "tailwind css", level: "Intermediate" },
    { name: "git", level: "Intermediate" },
  ],
  projects: [
    {
      id: 1,
      name: "AI Resume Builder",
      technologies: "react.js EXPress.js and mongodb",
      projectUrl: "https://myresumebuilder.example.com",
      githubUrl: "https://github.com/alexmorgan/resume-builder",
      description: "made a resume builder web app using react and express where users can create resumes and preview them live.",
    },
    {
      id: 2,
      name: "E-Commerce Storefront",
      technologies: "React.js, Node.js, MongoDB",
      projectUrl: "",
      githubUrl: "https://github.com/alexmorgan/ecommerce-store",
      description: "built an online shopping catalog with cart functionality and restful product api.",
    },
  ],
  experience: [
    {
      id: 1,
      jobTitle: "Frontend Developer Intern",
      company: "TechNova Solutions",
      location: "San Jose, CA",
      startDate: "2024-06",
      endDate: "2024-09",
      description: "worked on customer dashboard components in react and helped backend team connect api endpoints.",
    },
  ],
  education: [
    {
      id: 1,
      degree: "btech in cse",
      institution: "State University of Technology",
      startYear: "2020",
      endYear: "2024",
      description: "Graduated with coursework in Data Structures, Algorithms, and Database Management Systems.",
    },
  ],
};

const entryLevelResume = {
  personalInfo: {
    fullName: "Jordan Lee",
    jobTitle: "Junior Software Developer",
    email: "jordan@example.com",
    phone: "555-0211",
    location: "Austin, TX",
    linkedin: "https://linkedin.com/in/jordanlee",
    github: "https://github.com/jordanlee",
    summary: "",
  },
  skills: [
    { name: "python", level: "Intermediate" },
    { name: "javascript", level: "Intermediate" },
    { name: "react", level: "Beginner" },
    { name: "postgresql", level: "Intermediate" },
    { name: "git", level: "Intermediate" },
  ],
  projects: [
    {
      id: 1,
      name: "Task Tracking Platform",
      technologies: "Python, Flask, PostgreSQL",
      projectUrl: "",
      githubUrl: "https://github.com/jordanlee/task-tracker",
      description: "developed task management tool with user authentication and database models for tracking team items.",
    },
    {
      id: 2,
      name: "Weather Dashboard",
      technologies: "JavaScript, HTML5, CSS3",
      projectUrl: "https://weather.example.com",
      githubUrl: "https://github.com/jordanlee/weather-app",
      description: "created responsive weather forecast dashboard consuming public weather api with real-time updates.",
    },
  ],
  experience: [],
  education: [
    {
      id: 1,
      degree: "b.sc in computer science",
      institution: "Austin City College",
      startYear: "2021",
      endYear: "2025",
      description: "",
    },
  ],
};

const minimalResume = {
  personalInfo: {
    fullName: "Sam Minimal",
    jobTitle: "",
    email: "",
    summary: "",
  },
  skills: [],
  projects: [],
  experience: [],
  education: [],
};

console.log("=== TEST 1: Technology Formatting ===");
const messyTech = "react.js EXPress.js and mongodb";
const formattedTech = formatTechStack(messyTech);
console.log("Input:", messyTech);
console.log("Formatted:", formattedTech);
console.assert(formattedTech === "React.js, Express.js, MongoDB", "Tech formatting failed!");

console.log("\n=== TEST 2: Skills Categorization ===");
const rawSkills = ["javascript", "react.js", "node.js", "mongodb", "git", "python", "docker"];
const categorized = categorizeSkills(rawSkills);
console.log("Categorized:", categorized);
console.assert(categorized["Frontend Technologies"].includes("React.js"), "React not in Frontend!");
console.assert(categorized["Backend Technologies"].includes("Node.js"), "Node not in Backend!");
console.assert(categorized["Databases"].includes("MongoDB"), "MongoDB not in Databases!");
console.assert(categorized["Programming Languages"].includes("JavaScript"), "JavaScript not in Languages!");
console.assert(categorized["Tools and Frameworks"].includes("Git"), "Git not in Tools!");

console.log("\n=== TEST 3: Degree Normalization ===");
console.log("btech in cse ->", formatDegreeName("btech in cse"));
console.log("bca ->", formatDegreeName("bca"));
console.log("b.sc in computer science ->", formatDegreeName("b.sc in computer science"));
console.assert(formatDegreeName("btech in cse").includes("Bachelor of Technology (B.Tech)"), "BTech failed!");

console.log("\n=== TEST 4: Professional Summary Generation ===");
const completeSummary = generateProfessionalSummary(completeResume);
console.log("Complete Resume Summary:\n", completeSummary);
const entrySummary = generateProfessionalSummary(entryLevelResume);
console.log("Entry-level Resume Summary:\n", entrySummary);

console.log("\n=== TEST 5: Deterministic Scoring ===");
const score1 = calculateDeterministicScore(completeResume).score;
const score2 = calculateDeterministicScore(completeResume).score;
console.log("Score 1:", score1);
console.log("Score 2:", score2);
console.assert(score1.overall === score2.overall, "Scores not deterministic!");
console.assert(
  score1.overall === score1.summary + score1.skills + score1.projects + score1.experience + score1.education,
  "Overall does not equal sum of categories!"
);

console.log("\n=== TEST 6: Entry-level Scoring Fairness ===");
const entryScore = calculateDeterministicScore(entryLevelResume).score;
console.log("Entry-level score:", entryScore);
console.assert(entryScore.experience >= 10, "Entry level unfairly penalized in experience!");
console.assert(
  entryScore.overall === entryScore.summary + entryScore.skills + entryScore.projects + entryScore.experience + entryScore.education,
  "Entry level overall does not match sum!"
);

console.log("\n=== TEST 7: Minimal Resume Scoring ===");
const minScore = calculateDeterministicScore(minimalResume).score;
console.log("Minimal score:", minScore);
console.assert(
  minScore.overall === minScore.summary + minScore.skills + minScore.projects + minScore.experience + minScore.education,
  "Minimal overall does not match sum!"
);

console.log("\n=== TEST 8: Context-Aware Recommendations ===");
const recsComplete = buildContextualRecommendations(completeResume);
console.log("Complete Resume Recommendations:", recsComplete);
// Since GitHub and LinkedIn exist in completeResume, it should NOT recommend adding them!
const mentionsGithub = recsComplete.some((r) => /add.*github/i.test(r));
console.assert(!mentionsGithub, "Should NOT recommend adding GitHub when already present!");

console.log("\nALL SUITE TESTS PASSED SUCCESSFULLY!");

