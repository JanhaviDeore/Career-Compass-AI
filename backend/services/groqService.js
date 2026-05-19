import axios from "axios";
import env from "../config/env.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const systemPrompt =
  "You are a career guidance engine. Always respond with strict JSON only, no markdown.";

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw err;
  }
};

export const generateCareerList = async (count = 60) => {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env");
  }
  const userPrompt = `
Return a JSON object with this shape:
{
  "careers": [
    {
      "title": "string",
      "category": "string",
      "description": "string",
      "skills": ["string"],
      "salaryRange": "string",
      "roadmap": ["string"],
      "featureScores": {
        "logical": number,
        "creative": number,
        "technical": number,
        "social": number,
        "leadership": number
      }
    }
  ]
}
Generate ${count} unique real-world careers across arts, science, banking, government, technology, healthcare, law, media, business, and education.
Use short roadmap steps (3-5) and realistic salaryRange like "4-8 LPA".
Scores must be integers 1-10.
`;

  let response;
  try {
    response = await axios.post(
      GROQ_URL,
      {
        model: env.GROQ_MODEL || "llama-3.1-70b-versatile",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    const detail = err?.response?.data || err.message;
    throw new Error(`Groq list error: ${JSON.stringify(detail)}`);
  }

  const content = response.data?.choices?.[0]?.message?.content || "{}";
  const parsed = parseJson(content);
  return parsed.careers || [];
};

export const generateCareerDetail = async (title) => {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env");
  }
  const userPrompt = `
Return a JSON object with this shape:
{
  "title": "${title}",
  "category": "string",
  "description": "string",
  "skills": ["string"],
  "salaryRange": "string",
  "roadmap": ["string"],
  "featureScores": {
    "logical": number,
    "creative": number,
    "technical": number,
    "social": number,
    "leadership": number
  }
}
Generate realistic details for this career only. Use 3-6 roadmap steps.
Scores must be integers 1-10.
`;

  let response;
  try {
    response = await axios.post(
      GROQ_URL,
      {
        model: env.GROQ_MODEL || "llama-3.1-70b-versatile",
        temperature: 0.6,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    const detail = err?.response?.data || err.message;
    throw new Error(`Groq detail error: ${JSON.stringify(detail)}`);
  }

  const content = response.data?.choices?.[0]?.message?.content || "{}";
  return parseJson(content);
};

export const generateDetailsForTitles = async (titles) => {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env");
  }
  const list = titles.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const userPrompt = `
Return a JSON object with this shape:
{
  "careers": [
    {
      "title": "string",
      "category": "string",
      "description": "string",
      "skills": ["string"],
      "salaryRange": "string",
      "roadmap": ["string"],
      "featureScores": {
        "logical": number,
        "creative": number,
        "technical": number,
        "social": number,
        "leadership": number
      }
    }
  ]
}
Generate details for the following careers:
${list}
Scores must be integers 1-10.
`;

  let response;
  try {
    response = await axios.post(
      GROQ_URL,
      {
        model: env.GROQ_MODEL || "llama-3.1-70b-versatile",
        temperature: 0.6,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    const detail = err?.response?.data || err.message;
    throw new Error(`Groq batch error: ${JSON.stringify(detail)}`);
  }

  const content = response.data?.choices?.[0]?.message?.content || "{}";
  const parsed = parseJson(content);
  return parsed.careers || [];
};

export const generateRecommendations = async ({
  scores,
  profile,
  count = 3
}) => {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env");
  }

  const profileText = `
Name: ${profile?.name || "N/A"}
Education: ${profile?.education || "N/A"}
Favorite Subjects: ${profile?.favoriteSubjects || "N/A"}
Interests: ${profile?.interests || "N/A"}
Skills: ${profile?.skills || "N/A"}
Career Goal: ${profile?.careerGoal || "N/A"}
`.trim();

  const userPrompt = `
Return a JSON object with this shape:
{
  "explanation": "string",
  "careers": [
    {
      "title": "string",
      "category": "string",
      "description": "string",
      "skills": ["string"],
      "salaryRange": "string",
      "roadmap": ["string"],
      "featureScores": {
        "logical": number,
        "creative": number,
        "technical": number,
        "social": number,
        "leadership": number
      }
    }
  ]
}
Generate ${count} unique career recommendations using the user's test scores and profile.
Do NOT repeat titles. Use realistic job titles and 3-6 roadmap steps.
Scores must be integers 1-10.

User profile:
${profileText}

Test scores (0-10):
${JSON.stringify(scores)}
`;

  let response;
  try {
    response = await axios.post(
      GROQ_URL,
      {
        model: env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    const detail = err?.response?.data || err.message;
    throw new Error(`Groq recommend error: ${JSON.stringify(detail)}`);
  }

  const content = response.data?.choices?.[0]?.message?.content || "{}";
  const parsed = parseJson(content);
  return {
    careers: parsed.careers || [],
    explanation: parsed.explanation || ""
  };
};

export const generateCareerChat = async ({ message, profile, scores }) => {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env");
  }

  const profileText = `
Name: ${profile?.name || "N/A"}
Education: ${profile?.education || "N/A"}
Interests: ${profile?.interests || "N/A"}
Skills: ${profile?.skills || "N/A"}
Career Goal: ${profile?.careerGoal || "N/A"}
`.trim();

  const userPrompt = `
User question: ${message}

User profile:
${profileText}

Test scores:
${JSON.stringify(scores || {})}

Answer clearly in 4-7 bullet points. Keep it practical and focused on career guidance.
`;

  let response;
  try {
    response = await axios.post(
      GROQ_URL,
      {
        model: env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.6,
        messages: [
          { role: "system", content: "You are a career guidance assistant." },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    const detail = err?.response?.data || err.message;
    throw new Error(`Groq chat error: ${JSON.stringify(detail)}`);
  }

  return response.data?.choices?.[0]?.message?.content?.trim() || "";
};
