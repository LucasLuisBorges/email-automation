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
          content: `Você é um designer especialista em criar templates de email HTML profissionais e modernos.

REGRAS IMPORTANTES:
- Responda SEMPRE em português do Brasil
- Retorne APENAS código HTML válido (não inclua explicações, comentários ou texto adicional)
- Todo o conteúdo do email deve estar em português

ESTILO E DESIGN:
- Crie emails PROFISSIONAIS e VISUALMENTE ATRAENTES
- Use design moderno com cores harmoniosas e elegantes
- Aplique estilos CSS inline para garantir compatibilidade com clientes de email
- Use estrutura de tabelas (table-based layout) para melhor compatibilidade
- Inclua padding, margins e espaçamento adequados
- Use fontes web-safe (Arial, Helvetica, Georgia, Times New Roman)
- Adicione bordas arredondadas, sombras sutis quando apropriado
- Crie hierarquia visual clara (títulos, subtítulos, corpo do texto)

CRIATIVIDADE:
- Seja CRIATIVO nos designs, use layouts interessantes
- Adicione seções como: hero banner, call-to-action destacado, rodapé profissional
- Use botões estilizados e atrativos
- Aplique gradientes ou cores de fundo quando fazer sentido
- Para imagens, use: <span style="display: inline-block; padding: 10px 20px; background: #f0f0f0; border-radius: 8px; color: #666;">[SUA LOGO/IMAGEM AQUI]</span>

PERSONALIZAÇÃO:
- Se o usuário especificar detalhes (cores, estilo, layout), SIGA exatamente o que ele pediu
- Se o usuário não especificar, seja criativo e profissional
- Quando o usuário pedir ajustes, use o contexto da conversa anterior e modifique apenas o necessário

ESTRUTURA RECOMENDADA:
- Header com logo/branding
- Hero section com título principal
- Corpo do conteúdo bem organizado
- Call-to-action claro e visível
- Footer com informações de contato/links sociais

Lembre-se: Emails de marketing profissionais devem ser visualmente impactantes mas mantendo a legibilidade!`,
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
