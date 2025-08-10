import { FEEDBACK_PROMPT } from "@/services/Constant";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

// --- Helper function to extract JSON block from AI output ----
function extractJSONBlock(text) {
  // Prefer a `````` block
  const codeBlockMatch = text.match(/``````/i);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  // Fallback: find first {...} JSON-ish block
  const curlyBlockMatch = text.match(/\{[\s\S]*\}/);
  if (curlyBlockMatch) {
    return curlyBlockMatch[0].trim();
  }
  // Not found
  return null;
}

export async function POST(req) {
  try {
    const { conversation, name, email, interviewId } = await req.json();
    console.log("Received conversation:", conversation);

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-27b-it:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const rawContent = completion.choices[0]?.message?.content || "";
    console.log("Received raw string:", rawContent);

    // --- Extract just the JSON block ---
    const jsonString = extractJSONBlock(rawContent);

    if (!jsonString) {
      console.warn("No JSON found in AI response!");
      return NextResponse.json(
        { error: "No JSON found in AI response" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.warn("Failed to parse AI response as JSON:", e, "\nJSON string was:\n", jsonString);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    // Save to DB
    const savedFeedback = await prisma.feedback.create({
      data: {
        name,
        email,
        interviewId,
        feed: parsed, // assumes prisma schema uses JSON type
        recommendation: parsed.recommendation ?? false,
      },
    });

    return NextResponse.json(savedFeedback, { status: 201 });
  } catch (error) {
    console.error("Error generating or saving feedback:", error);
    return NextResponse.json({ error: "Failed to generate or save feedback" }, { status: 500 });
  }
}
