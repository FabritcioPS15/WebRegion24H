'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, RemoveFormatting, Code } from 'lucide-react';

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm md:prose-base max-w-none p-4 focus:outline-none min-h-[240px]',
      },
    },
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || '') !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const Btn = ({
    active,
    onClick,
    title,
    children,
  }: {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-2 border border-gray-200 bg-white hover:border-brand hover:text-brand transition-colors ${
        active ? 'text-brand border-brand' : 'text-gray-500'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 bg-white">
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-100 bg-gray-50">
        <Btn
          title="Negrita"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={16} />
        </Btn>
        <Btn
          title="Cursiva"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={16} />
        </Btn>
        <Btn
          title="Tachado"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <Strikethrough size={16} />
        </Btn>
        <Btn
          title="Código"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        >
          <Code size={16} />
        </Btn>
        <Btn
          title="Lista"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={16} />
        </Btn>
        <Btn
          title="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={16} />
        </Btn>
        <Btn
          title="Cita"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote size={16} />
        </Btn>
        <Btn title="Limpiar formato" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <RemoveFormatting size={16} />
        </Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
