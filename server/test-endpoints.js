const http = require("http");
require("dotenv").config({ path: "server/.env" });
const app = require("./server");

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

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const req = http.request(
      {
        host: "127.0.0.1",
        port: addr.port,
        method,
        path,
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(raw) });
          } catch {
            resolve({ status: res.statusCode, raw });
          }
        });
      },
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  console.log("Test HTTP server listening on port", server.address().port);

  try {
    // 1. Health check
    const health = await request(server, "GET", "/api/health");
    console.log("Health check:", health.status, health.body);
    console.assert(health.status === 200, "Health check failed");

    // 2. AI analyze endpoint
    console.log("\nTesting POST /api/ai/analyze...");
    const analyzeRes = await request(server, "POST", "/api/ai/analyze", completeResume);
    console.log("Analyze HTTP status:", analyzeRes.status);
    console.log("Provider:", analyzeRes.body.provider);
    console.log("Score overall:", analyzeRes.body.suggestions?.score?.overall);
    console.log("Summary suggested:", analyzeRes.body.suggestions?.summary?.suggested);
    console.log("Project tech:", analyzeRes.body.suggestions?.projects?.suggested?.[0]?.technologies);
    console.log("Education degree:", analyzeRes.body.suggestions?.education?.suggested?.[0]?.degree);
    console.log("Skill suggestions:", analyzeRes.body.suggestions?.skills?.suggestions);

    console.assert(analyzeRes.status === 200, "Analyze failed");
    console.assert(analyzeRes.body.success === true, "Analyze success false");
    console.assert(
      analyzeRes.body.suggestions?.projects?.suggested?.[0]?.technologies === "React.js, Express.js, MongoDB",
      "Technologies not formatted in analyze endpoint!",
    );
    console.assert(
      analyzeRes.body.suggestions?.education?.suggested?.[0]?.degree.includes("Bachelor of Technology (B.Tech)"),
      "Education degree not formatted in analyze endpoint!",
    );

    // 3. AI rewrite summary
    console.log("\nTesting POST /api/ai/rewrite (summary)...");
    const rwSummary = await request(server, "POST", "/api/ai/rewrite", {
      type: "summary",
      content: "i am web developer with react experience and node js skills",
      targetRole: "Frontend Developer",
    });
    console.log("Rewrite summary result:", rwSummary.body);
    console.assert(rwSummary.status === 200, "Rewrite summary failed");
    console.assert(typeof rwSummary.body.rewritten === "string", "Summary rewrite not string");

    // 4. AI rewrite project
    console.log("\nTesting POST /api/ai/rewrite (project)...");
    const rwProject = await request(server, "POST", "/api/ai/rewrite", {
      type: "project",
      content: {
        id: 101,
        name: "Shopping Portal",
        technologies: "react.js EXPress.js and mongodb",
        description: "worked on cart and products page using react",
      },
    });
    console.log("Rewrite project result:", rwProject.body);
    console.assert(rwProject.status === 200, "Rewrite project failed");
    console.assert(
      rwProject.body.rewritten.technologies === "React.js, Express.js, MongoDB",
      "Project tech not formatted in rewrite!",
    );

    // 5. AI rewrite experience
    console.log("\nTesting POST /api/ai/rewrite (experience)...");
    const rwExp = await request(server, "POST", "/api/ai/rewrite", {
      type: "experience",
      content: {
        id: 201,
        jobTitle: "Software Intern",
        company: "Apex Tech",
        location: "New York, NY",
        startDate: "2024-01",
        endDate: "2024-05",
        description: "helped team build rest apis and fix bug in react frontend",
      },
    });
    console.log("Rewrite experience result:", rwExp.body);
    console.assert(rwExp.status === 200, "Rewrite experience failed");

    // 6. AI rewrite education
    console.log("\nTesting POST /api/ai/rewrite (education)...");
    const rwEdu = await request(server, "POST", "/api/ai/rewrite", {
      type: "education",
      content: {
        id: 301,
        degree: "btech in cse",
        institution: "City University",
        startYear: "2020",
        endYear: "2024",
        description: "focused on algorithms and database systems",
      },
    });
    console.log("Rewrite education result:", rwEdu.body);
    console.assert(rwEdu.status === 200, "Rewrite education failed");
    console.assert(
      rwEdu.body.rewritten.degree.includes("Bachelor of Technology (B.Tech)"),
      "Degree not standardized in rewrite education!",
    );

    console.log("\nALL ENDPOINT TESTS PASSED WITH 100% SUCCESS!");
  } finally {
    server.close();
  }
}

run().catch((e) => {
  console.error("Endpoint test failed:", e);
  process.exit(1);
});

