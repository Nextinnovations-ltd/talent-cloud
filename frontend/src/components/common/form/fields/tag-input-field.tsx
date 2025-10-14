import React, { useState } from "react";
import { useController, useFormContext } from "react-hook-form";

interface TagInputFieldProps {
  fieldName: string;
  lableName?: string;
  required?: boolean;
  maxTags?: number;
  maxLength?: number;
  placeholder?: string;
}

const TagInputField: React.FC<TagInputFieldProps> = ({
  fieldName,
  lableName,
  required = false,
  maxTags = 20,
  maxLength = 20,
  placeholder = "Type here",
}) => {
  const { control } = useFormContext();
  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({ name: fieldName, control });
  const [input, setInput] = useState("");

  const handleAddTag = () => {
    const newTag = input.trim();
    if (
      newTag &&
      (!maxLength || newTag.length <= maxLength) &&
      (!maxTags || value.length < maxTags) &&
      !value.includes(newTag)
    ) {
      onChange([...value, newTag]);
      setInput("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t: string) => t !== tag));
  };

 

  return (
    <div>
      {lableName && (
        <label className="font-semibold text-[16px] text-[#05060F]">
          {lableName} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="border border-[#CBD5E1]  rounded-md px-3  py-2 mt-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#D9D9D9]"
        maxLength={maxLength}
        disabled={value.length >= maxTags}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {value.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="px-4 py-1.5 border border-[#CBD5E1] rounded-full text-[12px] text-gray-700 bg-white  active:scale-95 transition"
          >
            {tag}
            <button
              type="button"
              className="ml-2 text-blue-500 hover:text-red-500"
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      {value.length >= maxTags && (
        <p className="text-yellow-500 text-xs mt-1">
          Maximum {maxTags} tags allowed.
        </p>
      )}
    </div>
  );
};

export default TagInputField; 