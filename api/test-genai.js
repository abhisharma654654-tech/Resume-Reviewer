require('dotenv').config();
const { analyzeResume } = require('./services/aiService');

async function test() {
  const result = await analyzeResume("John Doe. Experience: 5 years in React and Node.js.", "Looking for a full stack engineer with React and Node.");
  if (result.rewrittenResume === "# John Doe\n\nFull-Stack Developer\n\n## Experience\n\n**Software Engineer | Tech Corp | 2021 - Present**\n- Spearheaded frontend development of 4 core features using React, improving application load time by 35%.\n- Designed and implemented 15+ RESTful backend APIs using Node.js and Express, supporting 10k+ daily active users.\n\n## Skills\n- React, TypeScript, Node.js, Express, Tailwind CSS") {
     console.log("Returned mock data!");
  } else {
     console.log("Returned real data!", result);
  }
}
test();
