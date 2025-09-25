"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import "./rich-text-editor.css";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Enter description...",
  required = false,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    editable: true,
    autofocus: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Debug: log the HTML to see what's being generated
      console.log("Rich text editor HTML:", html);
      // Preserve the HTML content as-is to maintain formatting and line breaks
      onChange(html);
    },
    editorProps: {
      attributes: { class: "focus:outline-none min-h-[150px] border-0" },
    },
  });

  useEffect(() => {
    if (!editor || value === undefined) return;

    const currentContent = editor.getHTML();
    const isCurrentEmpty =
      currentContent === "<p></p>" ||
      currentContent === "<p><br></p>" ||
      currentContent.trim() === "";

    if (
      isCurrentEmpty ||
      (currentContent !== value && currentContent !== `<p>${value}</p>`)
    ) {
      const { from, to } = editor.state.selection;
      const isHtml = value.includes("<") && value.includes(">");

      editor.commands.setContent(
        isHtml ? value : convertSimpleMarkdownToHtml(value),
        { emitUpdate: false },
      );

      try {
        if (
          from <= editor.state.doc.content.size &&
          to <= editor.state.doc.content.size
        ) {
          editor.commands.setTextSelection({ from, to });
        }
      } catch {
        editor.commands.focus("end");
      }
    }
  }, [editor, value]);

  // Simple conversion for legacy markdown-like text
  const convertSimpleMarkdownToHtml = (text: string): string => {
    return text
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^• (.+)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
      .replace(/\n/g, "<br>");
  };

  if (!editor) return <div>Loading editor...</div>;

  const buttons = [
    {
      icon: Bold,
      title: "Bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: Italic,
      title: "Italic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: Heading1,
      title: "Heading 1",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: List,
      title: "Bullet List",
      onClick: () => {
        const { from, to } = editor.state.selection;
        editor.chain().toggleBulletList().setTextSelection({ from, to }).run();
      },
      active: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      title: "Numbered List",
      onClick: () => {
        const { from, to } = editor.state.selection;
        editor.chain().toggleOrderedList().setTextSelection({ from, to }).run();
      },
      active: editor.isActive("orderedList"),
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-1 rounded-t-md border border-gray-200 bg-gray-50 p-2">
        {buttons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <Button
              key={index}
              type="button"
              variant={button.active ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title={button.title}
              onClick={button.onClick}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Tiptap Editor */}
      <div className="min-h-[200px] rounded-b-md border border-t-0 border-gray-200 bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[200px]"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
