"use client";

import DOMPurify from "dompurify";
import { useMemo, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Sanitiza o HTML para prevenir XSS e injection
  const sanitizedHtml = useMemo(() => {
    if (!code) return "";

    return DOMPurify.sanitize(code, {
      ALLOWED_TAGS: [
        "html",
        "head",
        "body",
        "title",
        "style",
        "meta",
        "link",
        "div",
        "span",
        "p",
        "a",
        "img",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
        "br",
        "hr",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "small",
        "center",
        "font",
        "button",
        "section",
        "header",
        "footer",
        "article",
        "main",
      ],
      ALLOWED_ATTR: [
        "class",
        "id",
        "style",
        "href",
        "src",
        "alt",
        "title",
        "width",
        "height",
        "align",
        "border",
        "cellpadding",
        "cellspacing",
        "bgcolor",
        "color",
        "target",
        "rel",
      ],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):)/i,
    });
  }, [code]);

  const handleCopyHtml = async () => {
    if (!code) {
      toast.error("Nenhum código para copiar");
      return;
    }

    try {
      // Copia o HTML sanitizado
      await navigator.clipboard.writeText(sanitizedHtml);
      setIsCopied(true);
      toast.success("HTML copiado!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
      toast.error("Erro ao copiar HTML");
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 bg-white rounded shadow overflow-hidden flex flex-col min-h-0">
        <div className="p-2 border-b shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-bold">Email gerado (HTML)</h2>
          <Button
            onClick={handleCopyHtml}
            disabled={!code}
            size="sm"
            variant={isCopied ? "default" : "outline"}
          >
            {isCopied ? "✓ Copiado!" : "Copiar HTML"}
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <SyntaxHighlighter language="html" style={docco} className="p-2">
            {code || "// Aguardando geração..."}
          </SyntaxHighlighter>
        </div>
      </div>

      <div className="flex-1 bg-white rounded shadow overflow-hidden flex flex-col min-h-0">
        <h2 className="p-2 text-lg font-bold border-b shrink-0">
          Visualização ao Vivo
        </h2>
        <div className="flex-1">
          <iframe
            title="Code Preview"
            srcDoc={sanitizedHtml}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
