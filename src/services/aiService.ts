interface AIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const generateContent = async (
  prompt: string,
  apiKey: string,
  maxTokens: number = 2000
): Promise<string> => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-2.5-32b",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer and career advisor. Provide professional, concise content for resumes based on the information provided. Focus on achievements, skills, and experiences that make the candidate stand out.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API request failed: ${response.status} ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data: AIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

export const generateJobDescription = async (
  jobTitle: string,
  companyName: string,
  years: string,
  apiKey: string
): Promise<string> => {
  const prompt = `Create a professional job description for my resume with these details:
  - Job title: ${jobTitle}
  - Company: ${companyName}
  - Years of experience: ${years}
  
  Format your response as 3-4 bullet points highlighting achievements and responsibilities. Each bullet point should start with a strong action verb. Focus on quantifiable achievements where possible.`;

  return generateContent(prompt, apiKey);
};

export const enhanceSkills = async (
  skills: string[],
  apiKey: string
): Promise<string[]> => {
  const prompt = `I have the following skills for my resume: ${skills.join(
    ", "
  )}. Suggest 5 additional relevant skills that would complement these well for a resume. Only return the list of 5 skills, nothing else.`;

  const response = await generateContent(prompt, apiKey);
  return response
    .split(/,|\n/)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);
};

export const generateSummary = async (
  name: string,
  title: string,
  experience: string,
  skills: string[],
  apiKey: string
): Promise<string> => {
  const prompt = `Create a professional summary for a resume with these details:
  - Name: ${name}
  - Job title: ${title}
  - Years of experience: ${experience}
  - Key skills: ${skills.join(", ")}
  
  Write a concise, impactful professional summary (2-3 sentences) that highlights strengths and career goals.`;

  return generateContent(prompt, apiKey);
};

export const enhanceBulletPoints = async (
  jobDescription: string,
  jobTitle: string,
  apiKey: string
): Promise<string> => {
  if (!jobDescription.trim()) {
    throw new Error("Please provide a job description to enhance.");
  }
  
  const prompt = `Transform this plain job description into 3-4 powerful achievement-oriented bullet points for a resume. 
  Focus on quantifiable results and use strong action verbs.
  
  Job title: ${jobTitle}
  Description: ${jobDescription}
  
  Format each bullet point on a new line, starting with a bullet point character. 
  Example transformation:
  "Managed a team" → "• Led a cross-functional team of 5 members, improving project turnaround by 30%."
  `;

  return generateContent(prompt, apiKey);
};
