import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { typeStyle?: "mono" | "default" }
>(({ className, typeStyle, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm text-white text-lg font-bold border-bg-primary border-2 bg-bg-primary/20 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-bg-primary data-[state=checked]:text-primary-foreground [state=checked]:border-[1px]",
      className,
      typeStyle === "mono" && "font-mono duration-700 data-[state=checked]:bg-bg-primary data-[state=checked]:text-white data-[state=checked]:border-bg-primary shadow-none p-0  bg-white border-[#CBD5E1]"
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-full w-full" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
