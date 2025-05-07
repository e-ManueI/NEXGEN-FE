import fs from "fs";
import path from "path";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Metadata } from "next";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Technical Analysis of Brine Sample for Lithium Recovery",
  description:
    "Analysis of brine sample for lithium recovery via chloralkali method",
};

// Markdown content (replace with your full document content)
const markdownFilePath = path.join(process.cwd(), "", "brine-analysis.md");
const markdownContent = fs.readFileSync(markdownFilePath, "utf-8");

const Page: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-gray-100 py-10">
      <div className="prose prose-sm mx-auto max-w-4xl rounded-lg bg-white p-8 leading-snug shadow-lg">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            table: ({ ...props }) => (
              <div className="">
                <table
                  className="my-4 w-full table-auto border-collapse border border-gray-300"
                  {...props}
                />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-gray-200" {...props} />
            ),
            th: ({ ...props }) => (
              <th
                className="border border-gray-300 px-4 py-2 text-left"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td className="border border-gray-300 px-4 py-2" {...props} />
            ),
            p: ({ ...props }) => <p className="my-4" {...props} />,
            h1: ({ ...props }) => (
              <h1 className="mt-8 mb-4 text-3xl font-bold" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="mt-6 mb-3 text-2xl font-semibold" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="mt-4 mb-2 text-xl font-medium" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="my-4 list-inside list-disc" {...props} />
            ),
            li: ({ ...props }) => <li className="my-1" {...props} />,
            strong: ({ ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Page;
