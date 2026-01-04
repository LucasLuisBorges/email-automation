import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { env } from "@/config/env";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("É necessário fornecer um prompt", { status: 400 });
    }

    const stream = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Você é um gerador de templates de email em HTML. Responda SEMPRE em português do Brasil. Retorne APENAS código HTML válido para um email personalizado. Não inclua explicações, comentários ou texto adicional. Todo o conteúdo do email deve estar em português.",
        },
        {
          role: "user",
          content: `Gere um template de email em HTML personalizado: ${prompt}`,
        },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating email:", error);
    return new Response("Error generating email", { status: 500 });
  }
}
