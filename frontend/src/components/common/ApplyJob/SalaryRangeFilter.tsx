"use client"

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

  const displayValue = minValue && maxValue ? `${minValue}-${maxValue}` : title

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
      <PopoverContent className="w-[257px] p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Salary</label>
            <Input
              type="number"
              placeholder="Enter min salary"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Maximum Salary</label>
            <Input
              type="number"
              placeholder="Enter max salary"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
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