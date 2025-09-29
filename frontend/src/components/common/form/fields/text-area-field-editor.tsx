/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import "./index.css";
import FormatType from "@/types/customtollbar";
import CustomToolbar from "./text-area-filed-editor-header";
import clsx from "clsx";
import { Controller, useFormContext, Control } from "react-hook-form";

interface TextAreaFieldEditorProps {
  name: string;
  control?: Control<any>; // optional, for direct usage
  initialValue?: string;
  maxLength?: number;
  isError?: boolean;
  lableName?:string;
  place?:string
}

const TextAreaFieldEditor: React.FC<TextAreaFieldEditorProps> = ({
  name,
  control,
  initialValue = "",
  maxLength = 800,
  isError = false,
  lableName,
  place="Describe the role, responsibilities and what make this opportunity exciting..."
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const [formats, setFormats] = useState<FormatType>({});
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Get control from context if not passed
  const formContext = useFormContext();
  const formControl = control || formContext?.control;

  const updateFormats = useCallback(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    setFormats(editor.getFormat() as FormatType);
  }, []);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    setCharCount(editor.getText().trim().length);

    const inputEl = editor.root as HTMLElement;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    inputEl.addEventListener("focus", handleFocus);
    inputEl.addEventListener("blur", handleBlur);

    // Enforce max length
    editor.on("text-change", () => {
      const text = editor.getText().trimEnd();
      const length = text.length;

      if (length > maxLength) {
        editor.deleteText(maxLength, length);
      }
      setCharCount(Math.min(length, maxLength));
    });

    return () => {
      inputEl.removeEventListener("focus", handleFocus);
      inputEl.removeEventListener("blur", handleBlur);
    };
  }, [maxLength]);

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

  if (!formControl) {
    console.error(
      "TextAreaFieldEditor must be used inside a FormProvider or a control must be passed."
    );
    return null;
  }

  return (
    <Controller
      control={formControl}
      name={name}
      defaultValue={initialValue}
      rules={{
        required: "Description is required",
        validate: () => {
          const text = quillRef.current?.getEditor().getText().trim() || "";
          return text.length > 0 || "Description is required";
        },
      }}
      render={({ field, fieldState }) => (
        <div className="my-[40px] ">
          <h3 className="text-[20px]  mb-3 font-[500]">{lableName}<span className="ms-1 text-red-500">*</span></h3>
          <div className="editor-wrapper">
            <CustomToolbar
              onToggle={(format, value) => {
                const editor = quillRef.current?.getEditor();
                if (!editor) return;
                const current = editor.getFormat() as FormatType;
                if (value === undefined) {
                  editor.format(format, !current[format]);
                } else {
                  editor.format(format, value);
                }
                updateFormats();
              }}
              onHeader={(level) => {
                const editor = quillRef.current?.getEditor();
                if (!editor) return;
                editor.format("header", level);
                updateFormats();
              }}
              onList={(type) => {
                const editor = quillRef.current?.getEditor();
                if (!editor) return;
                const current = editor.getFormat() as FormatType;
                if (current.list === type) editor.format("list", false);
                else editor.format("list", type);
                updateFormats();
              }}
              formats={formats}
              classname={clsx(
                isFocused && "border-blue-500 border-2",
                (isError || fieldState.error) && isFocused && "border-red-500 border-2"
              )}
            />

            <div
              className={clsx(
                "quill-container relative border rounded-b-[12px]",
                isFocused ? "border-blue-500 border-2" : "border-[#6B6B6B]",
                (isError || fieldState.error) && isFocused && "border-red-500 border-2"
              )}
            >
              <ReactQuill
                ref={quillRef}
                className="rounded-t-none p-2"
                value={field.value || ""}
                //@ts-ignore
                onChange={(content, _delta, _source, editor) => {
                  const plainText = editor.getText().trim();
                  field.onChange(plainText.length === 0 ? "" : content); // normalize empty
                  setCharCount(plainText.length);
                  updateFormats();
                }}
                onBlur={() => field.onBlur()} // triggers validation on blur
                modules={modules}
                formats={formatsWhitelist}
                placeholder={place}
              />
              <span
                className={`absolute right-3 bottom-2 text-sm ${
                  charCount >= maxLength ? "text-red-500" : "text-[#B9BABC]"
                }`}
              >
                {charCount}/{maxLength}
              </span>
            </div>
          </div>
          {(isError || fieldState.error) && (
            <p className="text-[0.8rem] mt-2 font-medium text-destructive">
              {fieldState.error?.message || "Description is required"}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default TextAreaFieldEditor;
