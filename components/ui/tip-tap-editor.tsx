"use client";

import React, { useEffect, useState } from "react";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { MathExtension } from "@aarkue/tiptap-math-extension";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import "katex/dist/katex.min.css";

// Define TypeScript interfaces
export interface TiptapEditorProps {
  content: string;
  editable: boolean;
  onChange?: (markdown: string) => void;
  placeholder?: string;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

// Toolbar Button Component
const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  disabled,
  title,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded border border-transparent px-2 py-1 text-sm transition-colors ${
        isActive
          ? "bg-gray-200 text-blue-700"
          : "text-gray-600 hover:bg-gray-100"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      disabled={disabled}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
};

// Main Tiptap Editor Component
const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  editable,
  onChange,
  placeholder,
}) => {
  // State to track if the editor is ready
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false, // Disable default code block to use lowlight
      }),
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
      MathExtension.configure({
        evaluation: true,
        katexOptions: {
          macros: {
            "\\B": "\\mathbb{B}",
            "\\R": "\\mathbb{R}",
            "\\Z": "\\mathbb{Z}",
            "\\Q": "\\mathbb{Q}",
            "\\C": "\\mathbb{C}",
            "\\N": "\\mathbb{N}",
            "\\Zp": "\\mathbb{Z}_p",
            "\\Qp": "\\mathbb{Q}_p",

            // Add more LaTeX macros as needed
          },
          throwOnError: false,
          strict: false,
        },
        delimiters: "dollar",
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "w-full border-collapse my-4",
        },
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-200 p-2 align-top",
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "bg-gray-800 text-gray-200 rounded-md p-4 my-4 font-mono overflow-x-auto",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "p-4 prose prose-sm prose-primary mx-auto max-w-screen leading-snug",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    content,
    editable,
    // Prevent server-side rendering issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChange && isEditorReady) {
        const markdown = editor.storage.markdown.getMarkdown();
        onChange(markdown);
      }
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.storage.markdown.getMarkdown();
      if (currentContent !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  // Set editor ready after initialization
  useEffect(() => {
    if (editor) {
      setIsEditorReady(true);
    }
  }, [editor]);

  // If editor is not available, show loading or nothing
  if (!editor) {
    return null;
  }

  // Helper functions for toolbar actions
  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter the URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addMathInline = () => {
    // Insert inline math with placeholder
    editor.chain().focus().insertContent("$E = mc^2$").run();
  };

  const addMathBlock = () => {
    // Insert block math with placeholder
    editor.chain().focus().insertContent("\n$$\nE = mc^2\n$$\n").run();
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
      {editable && (
        <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
          <div className="mr-2 flex border-r border-gray-200 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strike"
            >
              <s>S</s>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Inline Code"
            >
              <code>{"<>"}</code>
            </ToolbarButton>
          </div>

          <div className="mr-2 flex border-r border-gray-200 pr-2">
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              H1
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              H3
            </ToolbarButton>
          </div>

          <div className="mr-2 flex border-r border-gray-200 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              • List
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Ordered List"
            >
              1. List
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Blockquote"
            >
              &quot;Quote&quot;
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              —
            </ToolbarButton>
          </div>

          <div className="mr-2 flex border-r border-gray-200 pr-2">
            <ToolbarButton onClick={addTable} title="Insert Table">
              Table
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Insert Image">
              Image
            </ToolbarButton>
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive("link")}
              title="Insert Link"
            >
              Link
            </ToolbarButton>
          </div>

          <div className="mr-2 flex border-r border-gray-200 pr-2">
            <ToolbarButton onClick={addMathInline} title="Insert Inline Math">
              ∑ Inline
            </ToolbarButton>
            <ToolbarButton onClick={addMathBlock} title="Insert Block Math">
              ∑ Block
            </ToolbarButton>
          </div>

          <div className="flex">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              Undo
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              Redo
            </ToolbarButton>
          </div>

          {/* Table controls when a table is selected */}
          {editor.isActive("table") && editable && (
            <div className="flex flex-wrap gap-1 border-t border-gray-200 bg-gray-50 p-2">
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Add Column Before
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Add Column After
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Delete Column
              </button>
              <button
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Add Row Before
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Add Row After
              </button>
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Delete Row
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Delete Table
              </button>
              <button
                onClick={() => editor.chain().focus().mergeCells().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Merge Cells
              </button>
              <button
                onClick={() => editor.chain().focus().splitCell().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Split Cell
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeaderColumn().run()
                }
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Toggle Header Column
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Toggle Header Row
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Toggle Header Cell
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bubble menu for quick formatting */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex rounded-md bg-gray-800 p-1 text-white shadow-lg">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("bold") ? "bg-gray-700" : ""
            }`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("italic") ? "bg-gray-700" : ""
            }`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("strike") ? "bg-gray-700" : ""
            }`}
          >
            Strike
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("code") ? "bg-gray-700" : ""
            }`}
          >
            Code
          </button>
          <button
            onClick={addLink}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("link") ? "bg-gray-700" : ""
            }`}
          >
            Link
          </button>
        </div>
      </BubbleMenu>

      {/* Floating menu for block-level formatting */}
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex rounded-md bg-gray-800 p-1 text-white shadow-lg">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-700" : ""
            }`}
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-700" : ""
            }`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("bulletList") ? "bg-gray-700" : ""
            }`}
          >
            Bullet List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("orderedList") ? "bg-gray-700" : ""
            }`}
          >
            Ordered List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`rounded px-2 py-1 text-xs hover:bg-gray-700 ${
              editor.isActive("codeBlock") ? "bg-gray-700" : ""
            }`}
          >
            Code Block
          </button>
        </div>
      </FloatingMenu>

      {/* The actual editor content */}
      <EditorContent
        editor={editor}
        className="max-h-[70dvh] flex-grow overflow-y-scroll"
      />
    </div>
  );
};

export default TiptapEditor;
