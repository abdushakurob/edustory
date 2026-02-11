import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const textModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const visionModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export interface StoryContent {
  narrative: string;
  keyPoints: string[];
  summary: string;
}

export interface QuestionSet {
  questions: Question[];
}

export interface Question {
  questionText: string;
  questionType: "multiple_choice" | "short_answer" | "true_false";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const SYSTEM_PROMPT_TEMPLATE = `You are an expert educational AI specialized in converting academic content into engaging narratives.

Your role:
1. Read academic content carefully
2. Extract ONLY information present in the provided content
3. Create accurate, story-based explanations that maintain factual integrity
4. Generate pedagogically sound questions

IMPORTANT CONSTRAINTS:
- NEVER hallucinate or add information not in the source material
- NEVER make up examples or facts
- Stay strictly within the provided document context
- Maintain accuracy while using narrative metaphors

Theme: {theme}
Subject: {subject}

When creating stories:
- Use the "{theme}" theme to frame explanations
- Connect concepts to real-world scenarios without losing accuracy
- Maintain academic rigor while improving accessibility
- Always cite which part of the content supports each claim`;

export function buildSystemPrompt(subject: string, theme: string): string {
  return SYSTEM_PROMPT_TEMPLATE.replace("{subject}", subject).replace(
    "{theme}",
    theme,
  );
}

export async function generateStory(
  content: string,
  subject: string,
  theme: string,
  section?: string,
): Promise<StoryContent> {
  const systemPrompt = buildSystemPrompt(subject, theme);

  const prompt = `Content to convert into a story:

<content>
${content}
</content>

${section ? `Section: ${section}` : ""}

Generate a JSON response with this exact structure:
{
  "narrative": "A compelling story explanation (2-3 paragraphs) that transforms this academic content into an engaging narrative while maintaining 100% accuracy to the source",
  "keyPoints": ["Key concept 1", "Key concept 2", "Key concept 3"],
  "summary": "One sentence summary"
}

CRITICAL: Only use facts from the provided content. Do not add external information.`;

  try {
    const result = await textModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: systemPrompt,
    });

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      narrative: parsed.narrative,
      keyPoints: parsed.keyPoints || [],
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}

export async function generateQuestions(
  content: string,
  subject: string,
  theme: string,
  narrative?: string,
): Promise<QuestionSet> {
  const systemPrompt = buildSystemPrompt(subject, theme);

  const prompt = `Content for question generation:

<content>
${content}
</content>

${narrative ? `\nNarrative context:\n${narrative}` : ""}

Generate 3-5 comprehension questions in JSON format:
{
  "questions": [
    {
      "questionText": "Clear question based on the content",
      "questionType": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Story-based explanation of why this answer is correct, referencing the narrative",
      "difficulty": "medium"
    }
  ]
}

Question types: "multiple_choice", "short_answer", "true_false"
Difficulties: "easy", "medium", "hard"

CRITICAL REQUIREMENTS:
1. All questions must be answerable ONLY from the provided content
2. Explanations must reference the narrative/story
3. Do not add external facts
4. Ensure pedagogical variety (not all easy, not all hard)`;

  try {
    const result = await textModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: systemPrompt,
    });

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      questions: parsed.questions || [],
    };
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

export async function generateFeedback(
  userAnswer: string,
  correctAnswer: string,
  question: string,
  subject: string,
  theme: string,
): Promise<string> {
  const systemPrompt = buildSystemPrompt(subject, theme);

  const prompt = `Student submitted an answer to this question:

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Generate personalized, encouraging feedback that:
1. Acknowledges what they got right (if anything)
2. Explains why the correct answer is better using the story narrative
3. Provides a learning hint
4. Stays under 3 sentences

Format as plain text, not JSON.`;

  try {
    const result = await textModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: systemPrompt,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw error;
  }
}

export async function extractImageText(imageData: Buffer): Promise<string> {
  try {
    const result = await visionModel.generateContent([
      {
        inlineData: {
          data: imageData.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      {
        text: "Extract all text and describe all diagrams, charts, and visual elements in detail. Maintain structure and accuracy. Format clearly.",
      },
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Error extracting image text:", error);
    throw error;
  }
}
