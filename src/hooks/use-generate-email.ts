import { useState, useTransition } from "react";
import { toast } from "sonner";

type Message = {
  role: "user" | "ai";
  content: string;
  id: string;
};

export function useGenerateEmail(onGenerate: (code: string) => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  async function generateEmail(prompt: string) {
    if (!prompt.trim()) return;

    const newUserMessage = {
      role: "user" as const,
      content: prompt,
      id: crypto.randomUUID(),
    };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    setInput("");
    onGenerate("");

    startTransition(async () => {
      try {
        const conversationHistory = updatedMessages.map((msg) => ({
          role: msg.role === "ai" ? "assistant" : "user",
          content: msg.content,
        }));

        const response = await fetch("/api/generate-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: conversationHistory }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate email");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedCode = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const content = decoder.decode(value, { stream: true });
            accumulatedCode += content;
            onGenerate(accumulatedCode);
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Email gerado com sucesso!",
            id: crypto.randomUUID(),
          },
        ]);

        toast.success("Email gerado com sucesso!");
      } catch (error) {
        console.error("Error generating email:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Error generating email",
            id: crypto.randomUUID(),
          },
        ]);
        toast.error("Erro ao gerar email. Tente novamente.");
      }
    });
  }

  return {
    messages,
    input,
    setInput,
    isPending,
    generateEmail,
  };
}
