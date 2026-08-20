const { GoogleGenAI, Type } = require('@google/genai');

// Initialize with standard env variable
let ai = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.log("Failed to initialize GoogleGenAI. Will fallback to mock mode.", e);
}

const mockResponse = {
  atsScore: 78,
  skillGap: {
    matched: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS"],
    missing: ["GraphQL", "Docker", "AWS", "CI/CD"]
  },
  rewriteSuggestions: [
    {
      before: "Worked on frontend features using React and improved performance.",
      after: "Spearheaded frontend development of 4 core features using React, improving application load time by 35%.",
      impact: "Quantifies impact and details specific framework usage."
    },
    {
      before: "Responsible for backend APIs.",
      after: "Designed and implemented 15+ RESTful backend APIs using Node.js and Express, supporting 10k+ daily active users.",
      impact: "Highlights scale and specific technologies."
    }
  ],
  interviewPrep: [
    {
      question: "Tell me about a time you improved the performance of an application.",
      situation: "The main dashboard was taking over 5 seconds to load due to unoptimized queries and large bundle sizes.",
      task: "I needed to reduce the load time to under 2 seconds to meet our new SLA requirements.",
      action: "I implemented code splitting in React, optimized the Webpack config, and added a Redis caching layer to the Express backend.",
      result: "Load times decreased by 65% to 1.7 seconds, leading to a 20% increase in user retention."
    }
  ],
  rewrittenResume: "# John Doe\n\nFull-Stack Developer\n\n## Experience\n\n**Software Engineer | Tech Corp | 2021 - Present**\n- Spearheaded frontend development of 4 core features using React, improving application load time by 35%.\n- Designed and implemented 15+ RESTful backend APIs using Node.js and Express, supporting 10k+ daily active users.\n\n## Skills\n- React, TypeScript, Node.js, Express, Tailwind CSS"
};

/**
 * Analyzes resume against job description using Gemini with strict JSON output.
 */
async function analyzeResume(resumeText, jobDescription) {
  if (!ai) {
    console.log('API key missing or AI client not initialized. Falling back to mock data.');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockResponse;
  }

  const prompt = `
You are an expert Applicant Tracking System (ATS) and a career coach. 
Analyze the provided resume against the job description (if provided).
Provide a structured analysis according to the specified JSON schema.
If no job description is provided, analyze the resume based on general best practices for the implied role.

Resume:
${resumeText}

Job Description:
${jobDescription || "None provided. Assume a general role based on the resume content."}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing how well the resume matches the job description." },
            skillGap: {
              type: Type.OBJECT,
              properties: {
                matched: { type: Type.ARRAY, items: { type: Type.STRING } },
                missing: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["matched", "missing"]
            },
            rewriteSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  before: { type: Type.STRING },
                  after: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["before", "after", "impact"]
              }
            },
            interviewPrep: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  situation: { type: Type.STRING },
                  task: { type: Type.STRING },
                  action: { type: Type.STRING },
                  result: { type: Type.STRING }
                },
                required: ["question", "situation", "task", "action", "result"]
              }
            },
            rewrittenResume: { type: Type.STRING, description: "A complete, optimized version of the resume rendered in Markdown." }
          },
          required: ["atsScore", "skillGap", "rewriteSuggestions", "interviewPrep", "rewrittenResume"]
        }
      }
    });

    const textResponse = response.text;
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    console.log("Falling back to mock data due to API error.");
    return mockResponse;
  }
}

module.exports = { analyzeResume, mockResponse };
