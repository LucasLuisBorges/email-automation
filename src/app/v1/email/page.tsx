"use client";

import { useState } from "react";
import { Chat } from "@/components/chat";
import { CodePreview } from "@/components/code-preview";

export default function Email() {
  const [generatedCode, setGeneratedCode] = useState<string>(""); // Real-time code updates

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <div className="w-full lg:w-1/2 p-4 border-b lg:border-b-0 lg:border-r border-gray-300 h-1/2 lg:h-full">
        <Chat onGenerate={setGeneratedCode} />
      </div>

      <div className="w-full lg:w-1/2 p-4 h-1/2 lg:h-full">
        <CodePreview code={generatedCode} />
      </div>
    </div>
  );
}
