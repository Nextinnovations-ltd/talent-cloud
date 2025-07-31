import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    typeStyle?: "mono" | "default"
  }
>(({ className, typeStyle = "default", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-sm border-2 transition-all duration-150 box-border", // base size/stable layout
      "text-white text-lg font-bold shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-bg-primary data-[state=checked]:text-white",
      typeStyle === "mono"
        ? "bg-white text-black font-mono border-[#CBD5E1] shadow-none p-0 data-[state=checked]:bg-bg-primary data-[state=checked]:text-white data-[state=checked]:border-[#CBD5E1]"
        : "bg-bg-primary/20 border-bg-primary data-[state=checked]:border-bg-primary",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex relative p-0 items-center justify-center text-current">
      <Check className="h-3 absolute w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
