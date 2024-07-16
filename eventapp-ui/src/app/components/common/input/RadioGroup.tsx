import React from "react";
import { FieldError } from "react-hook-form";
import ValidationError from "../ValidationError";

export interface RadioGroupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  options: Record<string, { displayedText: string; helperText?: string }>;
  error?: FieldError;
  defaultCheckedOption?: string;
}

const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ id, label, options, defaultCheckedOption, ...props }, ref) => {
    return (
      <div className="grid gap-1">
        <div className="">{label}</div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(options).map((o) => (
            <div key={o[0]} className="flex items-center">
              <input
                id={id ? `${id}-${o[0]}` : undefined}
                type="radio"
                className="border bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed"
                ref={ref}
                defaultChecked={defaultCheckedOption === o[0]}
                value={o[0]}
                {...props}
              />
              <div>
                <label
                  htmlFor={id ? `${id}-${o[0]}` : undefined}
                  className="ms-2"
                >
                  {o[1].displayedText}
                </label>
                {!!o[1].helperText && (
                  <p className="ms-2 text-xs text-gray-500">
                    {o[1].helperText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <ValidationError error={props.error} />
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
