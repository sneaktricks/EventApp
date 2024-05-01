import { clsx } from "clsx";
import React from "react";
import { FieldError } from "react-hook-form";
import ValidationError from "../ValidationError";

export interface DateTimeFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error: FieldError | undefined;
}

const DateTimeField = React.forwardRef<HTMLInputElement, DateTimeFieldProps>(
  ({ name, label, error, ...props }, ref) => {
    return (
      <div className="grid gap-1">
        <div className="">{label}</div>
        <input
          type="datetime-local"
          className={clsx(
            "border bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed rounded-lg p-2 w-full",
            { "border-red-600 focus:border-red-600": !!error }
          )}
          ref={ref}
          {...props}
        />
        <ValidationError error={error} />
      </div>
    );
  }
);

export default DateTimeField;
