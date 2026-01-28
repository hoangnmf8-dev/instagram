import * as React from "react"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
interface FloatingInputProps {
  control: any;
  name: string;
  label: string;
  type?: string;
}

export function FloatingInput({ control, name, label, type = "text" }: FloatingInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-0 mb-2">
          <div className="relative group">
            <FormControl>
              <Input
                id={name}
                {...field}
                type={type}
                placeholder=" " 
                className={cn(
                  "peer h-16 pt-5 px-3 !text-lg placeholder:transparent focus-visible:ring-1 focus-visible:ring-slate-400",
                  "bg-slate-50/50 rounded-2xl" 
                )}
              />
            </FormControl>
            <label
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-all duration-200 cursor-text pointer-events-none text-lg",
                "peer-focus:top-4 peer-focus:text-[13px]",
                "peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[13px]"
              )}
            >
              {label}
            </label>
          </div>
          <FormMessage className="text-[14px] mt-1" />
        </FormItem>
      )}
    />
  )
}
