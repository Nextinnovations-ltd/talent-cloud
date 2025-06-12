import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputClasses?: string;
  isError?: boolean;
  showLetterCount?: boolean;
  maxLength?: number;
  disabled?: boolean;
  height?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      disabled,
      maxLength,
      showLetterCount,
      height,
      onChange,
      isError,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = React.useState(0);

    React.useEffect(() => {
      if (inputRef.current) {
        setCharCount(inputRef.current.value.length);
      }
    }, []);

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setCharCount(event.target.value.length);
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <div className="relative w-full">
        <textarea
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref)
              (
                ref as React.MutableRefObject<HTMLTextAreaElement | null>
              ).current = el;
          }}
          disabled={disabled}
          className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none placeholder:text-base placeholder:text-placeholder-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-bg-border focus-visible:border-bg-primary focus-visible:border-[2px]",
            isError && "focus-visible:border-error focus-visible:border-[2px]",
            className,
            height && height
          )}
          onChange={handleInputChange}
          maxLength={maxLength}
          {...props}
        />
        {showLetterCount && maxLength && (
          <span className="absolute right-3 bottom-2 text-[#B9BABC] text-sm">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
