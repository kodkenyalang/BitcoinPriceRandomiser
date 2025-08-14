"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  title: string;
  language: string;
  content: string;
}

export function CodeBlock({ title, language, content }: CodeBlockProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
          <FileCode2 className="h-5 w-5" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="font-code text-sm rounded-lg overflow-hidden">
        <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0 }}>
          {content.trim()}
        </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
}
