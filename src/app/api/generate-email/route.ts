import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { env } from "@/config/env";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function sanitizeUserInput(text: string): string {
  let sanitized = text.replace(/<[^>]*>/g, "");

  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=/gi, "");

  sanitized = sanitized.replace(/\\/g, "");

  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }

  return sanitized.trim();
}

function isValidMessage(message: { role: string; content: string }): boolean {
  if (!["user", "assistant"].includes(message.role)) {
    return false;
  }

  if (!message.content || typeof message.content !== "string") {
    return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { messages: conversationHistory } = await req.json();

    if (!conversationHistory || conversationHistory.length === 0) {
      return new Response("É necessário fornecer mensagens", { status: 400 });
    }

    const sanitizedMessages = conversationHistory
      .filter((msg: { role: string; content: string }) => isValidMessage(msg))
      .map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: sanitizeUserInput(msg.content),
      }));

    if (sanitizedMessages.length === 0) {
      return new Response("Mensagens inválidas", { status: 400 });
    }

    const stream = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Você é um gerador de templates de email em HTML. Responda SEMPRE em português do Brasil. Retorne APENAS código HTML válido para um email personalizado. Não inclua explicações, comentários ou texto adicional. Todo o conteúdo do email deve estar em português. Quando o usuário pedir ajustes ou correções, use o contexto da conversa anterior para modificar o email mantendo o que já estava bom. Se precisar utilizar tag img, gere apenas um <span>SUA LOGO AQUI</span>",
        },
        ...sanitizedMessages,
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
