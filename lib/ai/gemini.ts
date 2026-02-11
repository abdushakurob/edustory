import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const textModel = genAI.getGenerativeModel({
  model: "gemini-3-pro-preview",
});

export const visionModel = genAI.getGenerativeModel({
  model: "gemini-3-pro-preview",
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

const SYSTEM_PROMPT_TEMPLATE = `You are an expert Nigerian educational storyteller specialized in converting academic content into engaging, relatable narratives rooted in real-life Nigerian contexts.

Your role:
1. Read academic content carefully
2. Extract ONLY information present in the provided content
3. Create vivid, story-based explanations that feel natural and authentic to Nigerian culture
4. Use familiar Nigerian scenarios, settings, and examples while maintaining factual accuracy
5. Generate pedagogically sound questions

IMPORTANT CONSTRAINTS:
- NEVER hallucinate or add information not in the source material
- NEVER make up examples or facts
- Stay strictly within the provided document context
- Maintain accuracy while using narrative metaphors grounded in Nigerian reality

Theme: {theme}
Subject: {subject}

When creating stories:
- Set stories in familiar Nigerian contexts (markets, schools, homes, industries)
- Use relatable characters that reflect Nigerian society
- Include cultural nuances and local knowledge that make the content feel authentic
- Use natural Nigerian English (including local expressions where appropriate)
- Connect concepts to everyday scenarios Nigerians encounter
- Reference local examples and situations
- Maintain academic rigor while improving accessibility through storytelling
- Make the narrative conversational and engaging, as if told by a trusted mentor
- Always cite which part of the content supports each claim

TONE: Warm, conversational, encouraging - like learning from an experienced teacher who understands Nigerian context.`;

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

  const prompt = `${systemPrompt}

---

Academic content to abstract into a story:

<content>
${content}
</content>

${section ? `Section: ${section}` : ""}

TASK: Create an ABSTRACT STORY that explains the core concepts from this content.

Do NOT simply convert the text. Instead:
1. Identify the 3-5 KEY CONCEPTS in the content
2. Create a coherent narrative story set in Nigeria that DEMONSTRATES these concepts through action and dialogue
3. Use characters, situations, and dialogue to show (not tell) how these concepts work in real life
4. Make it a story people will remember - engaging, emotional, relatable
5. The story should naturally reveal the concepts without explicit explanations

Create a JSON response with this exact structure:
{
  "narrative": "A compelling abstract story (3-4 paragraphs) set in Nigeria with relatable characters and situations that naturally demonstrate and explain the core concepts. It should feel like a short story, not a lesson. Readers should learn the concepts through the narrative itself.",
  "keyPoints": ["Core concept 1 extracted from story", "Core concept 2 extracted from story", "Core concept 3 extracted from story"],
  "summary": "One sentence that states the main concept demonstrated by the story"
}

CRITICAL INSTRUCTIONS:
- Create a STORY, not a summary or explanation
- The concepts should be embedded in the narrative, not stated directly
- Use dialogue, action, and conflict to show concepts in practice
- Make Nigerian characters and settings authentic and specific
- Only draw concepts from the provided content
- Make it engaging enough that someone would want to read it again`;

  try {
    const result = await textModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
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
  const prompt = `You are an expert educator creating comprehension questions about this story and content.

${narrative ? `STORY:\n${narrative.substring(0, 600)}\n\n` : ""}
CONTENT:\n${content.substring(0, 500)}

Subject: ${subject}
Theme: ${theme}

Create exactly 3 specific multiple-choice questions that test understanding of this story/content.

REQUIREMENTS:
- Questions MUST reference specific details from the story/content
- Options should be plausible but distinct
- Explanations should cite the story/content
- Vary difficulty: easy, medium, hard
- NO generic questions like "What is the main concept?"

Output ONLY valid JSON:
{
  "questions": [
    {
      "questionText": "Specific question about the story/content",
      "questionType": "multiple_choice",
      "options": ["Correct answer from story", "Wrong but plausible", "Wrong but plausible", "Wrong but plausible"],
      "correctAnswer": "Correct answer from story",
      "explanation": "Explanation with reference to the story/content",
      "difficulty": "medium"
    }
  ]
}`;

  try {
    const result = await textModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result.response.text();
    console.log(
      "Generated questions response (first 200 chars):",
      text.substring(0, 200),
    );

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn("No JSON found in response");
      throw new Error("Could not parse AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (
      !parsed.questions ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length === 0
    ) {
      console.warn("No questions in response");
      throw new Error("No questions generated");
    }

    // Ensure each question has required fields
    const validQuestions = parsed.questions.filter(
      (q: any) =>
        q.questionText &&
        q.options &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        q.correctAnswer &&
        q.explanation,
    );

    if (validQuestions.length === 0) {
      console.error("No valid questions after filtering");
      throw new Error("Generated questions do not meet requirements");
    }

    return {
      questions: validQuestions,
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

  const prompt = `${systemPrompt}

---

Student submitted an answer to this question:

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
