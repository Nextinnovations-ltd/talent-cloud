import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  endIcon?: React.ReactNode;
  showPasswordIcon?: React.ReactNode;
  hidePasswordIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  inputClasses?: string;
  isError?: boolean;
  showLetterCount?: boolean; // New prop to show/hide letter count
  maxLength?: number; // Max length for input
  description?: boolean;
  descriptionText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      isError,
      endIcon,
      showPasswordIcon,
      hidePasswordIcon,
      inputClasses,
      showLetterCount,
      maxLength,
      description,
      descriptionText,
      startIcon,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<any>(null);
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const [isPasswordVisible, setPasswordVisible] = React.useState(false);
    const [length, setLength] = React.useState(false);

    const handleTogglePassword = () => {
      setPasswordVisible((prev) => !prev);
    };

    const handleInputChange = () => {
      forceUpdate();
    };

    React.useEffect(() => {
      if (inputRef.current?.value.length > 0) {
        setLength(true)
      } else if (inputRef?.current?.value.length === 0) {
        setLength(false)
      }
      console.log("kdkdk")
    }, [inputRef?.current?.value?.length]);

    return (
      <div>
        <div
          className={cn(
            "flex h-10  items-center rounded-[10px] bg-blue relative border-input bg-white text-sm",
            className
          )}
        >
          {startIcon && (
            <div className={cn("flex text-[#979FA9] duration-300 items-center z-50 absolute left-[20px] justify-center", length && "text-black")}>
              {startIcon}
            </div>
          )}
          <input
            ref={(el) => {
              inputRef.current = el;
              if (typeof ref === "function") ref(el);
              else if (ref)
                (
                  ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = el;
            }}
            type={
              type === "password" && !isPasswordVisible ? "password" : "text"
            }
            className={cn(
              "flex h-12 w-full rounded-md border bg-transparent px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium file:text-foreground focus:outline-none focus-visible:p-[calc(0.75rem-1.5px)] placeholder:text-base placeholder:font-normal placeholder:text-[#CFD1D4]  shadow-none disabled:cursor-not-allowed disabled:opacity-50 absolute bg-white",
              isError
                ? "focus-visible:border-error focus-visible:border-[2px]"
                : "border-bg-border focus-visible:border-bg-primary focus-visible:border-[2px]",
              startIcon && "pl-[65px] focus-visible:pl-[65px]",
              className
            )}
            onChange={handleInputChange}
            maxLength={maxLength}
            {...props}
          />
          {showLetterCount && maxLength && inputRef.current && (
            <span className="flex text-[#B9BABC] items-center absolute right-3 justify-center">
              {inputRef.current.value.length}/{maxLength}
            </span>
          )}
          {showLetterCount && maxLength && !inputRef.current && (
            <span className="flex text-[#B9BABC] items-center absolute right-3 justify-center">
              0/{maxLength}
            </span>
          )}
          {(endIcon || showPasswordIcon || hidePasswordIcon) && (
            <Button
              type="button"
              variant={"ghost"}
              onClick={handleTogglePassword}
              className="flex items-center absolute right-0 justify-center"
            >
              {isPasswordVisible ? hidePasswordIcon : showPasswordIcon}
            </Button>
          )}
        </div>
        {description && (
          <h3 className="text-[#686C73] font-normal mt-[10px] text-[14px]">
            {descriptionText}
          </h3>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
