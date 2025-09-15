// SafeQuillEditor.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import * as Lucide from "lucide-react";
import "./index.css";

// ------------------ Types ------------------
type FormatType = {
  header?: number | null;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  list?: "ordered" | "bullet";
};

interface CustomToolbarProps {
  onToggle: (format: keyof FormatType, value?: boolean) => void;
  onHeader: (level: number | null) => void;
  onList: (type: "ordered" | "bullet") => void;
  formats: FormatType;
}

interface TextAreaFieldEditorProps {
  initialValue?: string;
  onContentChange?: (html: string, plainText: string) => void;
}

// ------------------ Toolbar ------------------
const CustomToolbar: React.FC<CustomToolbarProps> = ({
  onToggle,
  onHeader,
  onList,
  formats,
}) => {
  return (
    <div
      className="ql-custom-toolbar"
      role="toolbar"
      aria-label="Editor toolbar"
    >
      {/* Header dropdown */}
      <select
        className="ql-header-dropdown p-3s"
        value={formats.header ?? "normal"}
        onChange={(e) =>
          onHeader(e.target.value === "normal" ? null : parseInt(e.target.value, 10))
        }
      >
        <option value="normal">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      {/* Inline formatting */}
      <button
        type="button"
        className={`ql-btn ${formats.bold ? "active" : ""}`}
        title="Bold"
        onClick={() => onToggle("bold")}
      >
        <Lucide.Bold size={16} />
      </button>
      <button
        type="button"
        className={`ql-btn ${formats.italic ? "active" : ""}`}
        title="Italic"
        onClick={() => onToggle("italic")}
      >
        <Lucide.Italic size={16} />
      </button>
      <button
        type="button"
        className={`ql-btn ${formats.underline ? "active" : ""}`}
        title="Underline"
        onClick={() => onToggle("underline")}
      >
        <Lucide.Underline size={16} />
      </button>
      <button
        type="button"
        className={`ql-btn ${formats.strike ? "active" : ""}`}
        title="Strike"
        onClick={() => onToggle("strike")}
      >
        <Lucide.Strikethrough size={16} />
      </button>

      {/* Lists */}
      <button
        type="button"
        className={`ql-btn ${formats.list === "ordered" ? "active" : ""}`}
        title="Ordered list"
        onClick={() => onList("ordered")}
      >
        <Lucide.ListOrdered size={16} />
      </button>
      <button
        type="button"
        className={`ql-btn ${formats.list === "bullet" ? "active" : ""}`}
        title="Bullet list"
        onClick={() => onList("bullet")}
      >
        <Lucide.List size={16} />
      </button>
    </div>
  );
};

// ------------------ Editor ------------------
const TextAreaFieldEditor: React.FC<TextAreaFieldEditorProps> = ({
  initialValue = "",
  onContentChange,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const [value, setValue] = useState<string>(initialValue);
  const [formats, setFormats] = useState<FormatType>({});

  const updateFormats = useCallback(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    setFormats(editor.getFormat() as FormatType);
  }, []);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    updateFormats();

    const handleSelection = () => updateFormats();
    const handleTextChange = () => updateFormats();

    editor.on("selection-change", handleSelection);
    editor.on("text-change", handleTextChange);

    return () => {
      editor.off("selection-change", handleSelection);
      editor.off("text-change", handleTextChange);
    };
  }, [updateFormats]);

  const modules = { toolbar: false };

  const formatsWhitelist = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
  ];

  const handleChange = (
    content: string,
    _delta: any,
    _source: string,
    editor: Quill
  ) => {
    setValue(content);
    if (onContentChange) onContentChange(content, editor.getText());
  };

  const handleToggle = (format: keyof FormatType, value?: boolean) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const current = editor.getFormat() as FormatType;

    if (value === undefined) {
      editor.format(format, !current[format]);
    } else {
      editor.format(format, value);
    }
    updateFormats();
  };

  const handleHeader = (level: number | null) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    editor.format("header", level);
    updateFormats();
  };

  const handleList = (type: "ordered" | "bullet") => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const current = editor.getFormat() as FormatType;
    if (current.list === type) editor.format("list", false);
    else editor.format("list", type);
    updateFormats();
  };

  return (
    <div className="editor-wrapper">
      <CustomToolbar
        onToggle={handleToggle}
        onHeader={handleHeader}
        onList={handleList}
        formats={formats}
      />
      <div className="quill-container">
        <ReactQuill
          ref={quillRef}
          className="rounded-lg p-2 border"
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formatsWhitelist}
          placeholder="Write something..."
          style={{
          }}
        />
      </div>
    </div>
  );
};

export default TextAreaFieldEditor;
