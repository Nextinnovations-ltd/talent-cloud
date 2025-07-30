import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const JobCardSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    value?: boolean;
    onValueChange?: (checked: boolean) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  const [checked, setChecked] = React.useState(value ?? false);

  React.useEffect(() => {
    if (value !== undefined) {
      setChecked(value);
    }
  }, [value]);

  const handleCheckedChange = (newChecked: boolean) => {
    if (onValueChange) {
      onValueChange(newChecked);
    } else {
      setChecked(newChecked);
    }
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex  scale-125 h-[32px] w-[55px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary bg-[#C5E4FF69] ",
        className
      )}
      checked={checked}
      onCheckedChange={handleCheckedChange}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none h-[28px] w-[28px] rounded-full bg-background shadow-lg ring-0 transition-transform flex items-center justify-center",
          checked ? "translate-x-[22px] " : "translate-x-0 bg-blue-500"
        )}
      >
        {checked ? (
          <X size={18} className="text-muted-foreground" />
        ) : (
          <Check size={18} className=" text-white" />
        )}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});

JobCardSwitch.displayName = "JobCardSwitch";

export { JobCardSwitch };