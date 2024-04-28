import React from "react";
import { FieldError } from "react-hook-form";
import ValidationError from "../ValidationError";

export interface RadioGroupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  options: Record<string, { displayedText: string; helperText?: string }>;
  error: FieldError | undefined;
}

const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  (props, ref) => {
    return (
      <div className="grid gap-1">
        <div className="">{props.label}</div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(props.options).map((o) => (
            <div key={o[0]} className="flex items-center">
              <input
                id={props.id ? `${props.id}-${o[0]}` : undefined}
                type="radio"
                className="border bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed"
                ref={ref}
                value={o[0]}
                {...props}
              />
              <div>
                <label
                  htmlFor={props.id ? `${props.id}-${o[0]}` : undefined}
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

export default RadioGroup;
