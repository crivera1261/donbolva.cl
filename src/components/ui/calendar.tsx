import { DayPicker } from "react-day-picker";
import type { Locale } from "date-fns";
import { cn } from "../../lib/utils";

type CalendarProps = {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  locale?: Locale;
  initialFocus?: boolean;
  className?: string;
};

export function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  locale,
  initialFocus,
}: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={(day) => onSelect?.(day)}
      disabled={disabled}
      locale={locale}
      initialFocus={initialFocus}
      className={cn("p-3 text-[oklch(0.24_0.013_60)]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-black/10 hover:bg-black/5 cursor-pointer",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "rounded-md w-9 font-normal text-[0.8rem] opacity-50",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: "h-9 w-9 p-0 font-normal hover:bg-black/5 rounded-md inline-flex items-center justify-center cursor-pointer",
        day_selected:
          "bg-[oklch(0.46_0.07_125)] text-white hover:bg-[oklch(0.46_0.07_125)] rounded-md",
        day_today: "bg-black/10 font-semibold rounded-md",
        day_outside: "opacity-30",
        day_disabled: "opacity-20 cursor-not-allowed",
        day_hidden: "invisible",
      }}
    />
  );
}
