import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()

    let systemPrompt = ""

    switch (type) {
      case "summary":
        systemPrompt =
          "You are a professional resume writer. Create a compelling professional summary based on the provided information. Keep it concise, professional, and highlight key strengths."
        break
      case "experience":
        systemPrompt =
          "You are a professional resume writer. Help improve job experience descriptions by making them more impactful, quantifiable, and achievement-focused."
        break
      case "skills":
        systemPrompt =
          "You are a professional resume writer. Suggest relevant skills based on the job title and experience provided."
        break
      default:
        systemPrompt = "You are a helpful assistant for resume building."
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: prompt,
    })

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Failed to generate AI content" }, { status: 500 })
  }
}
