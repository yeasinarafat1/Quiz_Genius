import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Quiz, QuizQuestion, Difficulty } from "../types";

// Schema definition for the Gemini output
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy title for the quiz based on the content.",
    },
    description: {
      type: Type.STRING,
      description: "A short description of what the quiz covers.",
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The question text.",
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 4 possible answers.",
          },
          correctIndex: {
            type: Type.INTEGER,
            description: "The index (0-3) of the correct answer in the options array.",
          },
          explanation: {
            type: Type.STRING,
            description: "A brief explanation of why the correct answer is correct.",
          },
        },
        required: ["text", "options", "correctIndex", "explanation"],
      },
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 related tags for categorization.",
    },
  },
  required: ["title", "description", "questions", "tags"],
};

export const generateQuizFromText = async (text: string, difficulty: Difficulty, questionCount: number): Promise<Omit<Quiz, 'id' | 'createdAt' | 'sourceTextPreview'>> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure you have a valid API Key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let difficultyPrompt = "";
  if (difficulty === 'Easy') {
    difficultyPrompt = "The questions should be introductory, focusing on definitions and broad concepts. Distractors should be obviously incorrect to a careful reader.";
  } else if (difficulty === 'Medium') {
    difficultyPrompt = "The questions should test solid understanding. Distractors should be reasonable.";
  } else {
    difficultyPrompt = "The questions should be challenging, focusing on nuances, specific details, or application of concepts. Distractors should be very plausible and require deep understanding to rule out.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a ${difficulty} level multiple-choice quiz based on the following text. 
      The quiz must have exactly ${questionCount} questions.
      ${difficultyPrompt}
      
      Text to analyze:
      ${text.substring(0, 20000)}`, // Limit input to avoid token limits if extremely large
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.4, // Lower temperature for more factual accuracy
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response generated from AI.");
    }

    const data = JSON.parse(responseText);
    
    // Add IDs to questions for stable rendering
    const questionsWithIds = data.questions.map((q: any, index: number) => ({
      ...q,
      id: `q-${Date.now()}-${index}`,
    }));

    return {
      title: data.title,
      description: data.description,
      questions: questionsWithIds,
      tags: data.tags,
      difficulty: difficulty,
    };
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw error;
  }
};