import * as React from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SalaryRangeFilterProps {
  title: string;
  onFilterChange: (value: string) => void;
}

export function SalaryRangeFilter({ title, onFilterChange }: SalaryRangeFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [minValue, setMinValue] = React.useState("")
  const [maxValue, setMaxValue] = React.useState("")

  const formatNumber = (value: string) => {
    if (!value) return ""
    return new Intl.NumberFormat("en-US").format(Number(value))
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "") // remove commas
    if (!raw || /^\d+$/.test(raw)) {
      setMinValue(raw)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "")
    if (!raw || /^\d+$/.test(raw)) {
      setMaxValue(raw)
    }
  }

  const handleApply = () => {
    if (minValue && maxValue) {
      const rangeValue = `${minValue}-${maxValue}`
      onFilterChange(rangeValue)
      setOpen(false)
    }
  }

  const handleClear = () => {
    setMinValue("")
    setMaxValue("")
    onFilterChange("")
  }

  const displayValue =
    minValue && maxValue
      ? `${formatNumber(minValue)} - ${formatNumber(maxValue)}`
      : title

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[257px] hover:bg-white w-auto px-[24px] border-none font-medium shadow-none h-[44px] rounded-[8px] gap-2 py-[10px] justify-between"
        >
          {displayValue}
          <div className="flex items-center gap-2">
            {minValue && maxValue && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
              >
                <X size={14} />
              </Button>
            )}
            <ChevronDown size={18} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[257px] z-[99] p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Salary</label>
            <Input
              type="text"
              placeholder="Enter min salary"
              value={formatNumber(minValue)}
              onChange={handleMinChange}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Maximum Salary</label>
            <Input
              type="text"
              placeholder="Enter max salary"
              value={formatNumber(maxValue)}
              onChange={handleMaxChange}
              className="h-9"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleClear}
              variant="outline"
              className="w-full"
            >
              Clear
            </Button>
            <Button 
              onClick={handleApply}
              className="w-full"
              disabled={!minValue || !maxValue}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
