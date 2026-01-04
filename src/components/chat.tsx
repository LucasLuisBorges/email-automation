"use client";

import { useGenerateEmail } from "@/hooks/use-generate-email";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatProps {
  onGenerate: (code: string) => void;
}

export function Chat({ onGenerate }: ChatProps) {
  const { messages, input, setInput, isPending, generateEmail } =
    useGenerateEmail(onGenerate);

  const handleSend = () => {
    generateEmail(input);
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex-1 overflow-y-auto p-2 bg-white rounded shadow">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              msg.role === "user" ? "text-left" : "text-right",
              "mb-2",
            )}
          >
            <span
              className={cn(
                "inline-block p-2 rounded",
                msg.role === "user" ? "bg-blue-200" : "bg-gray-200",
              )}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isPending) {
              handleSend();
            }
          }}
          className="flex-1 p-2 border border-gray-300 rounded-l"
          placeholder="Descreva o email que você quer gerar..."
          disabled={isPending}
        />
        <Button onClick={handleSend} disabled={isPending}>
          {isPending ? "Criando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
