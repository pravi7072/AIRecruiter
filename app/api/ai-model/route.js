import { QUESTIONS_PROMPT } from "@/services/Constant";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { jobPosition, jobDiscription, interviewDuration, type } = await req.json();

  const FINAL_PROMPT = QUESTIONS_PROMPT.replace("{{jobTitle}}", jobPosition)
    .replace("{{jobDescription}}", jobDiscription)
    .replace("{{duration}}", interviewDuration)
    .replace("{{type}}", type.join(", "));

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-27b-it:free",
      messages: [
        { role: "user", content: FINAL_PROMPT }
      ],
    });

    const rawContent = completion.choices[0].message.content;

    // Remove markdown code block ```json\n...\n```
    const jsonString = rawContent.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(jsonString);
    const questions = parsed.interviewQuestions.map((q) => q.question); // Extract only the question strings
    console.log("Generated Questions:", questions);
    if (!Array.isArray(questions)) {
      throw new Error("Invalid response format");
    }
    return NextResponse.json({ questions });

  } catch (error) {
    console.error("Error generating questions:", error);
    return new Response(JSON.stringify({ error: "Failed to generate questions" }), { status: 500 });
  }
}
