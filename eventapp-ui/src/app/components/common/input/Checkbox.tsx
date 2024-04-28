import React from "react";
import { FieldError } from "react-hook-form";
import ValidationError from "../ValidationError";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error: FieldError | undefined;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    return (
      <div className="grid gap-1">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="border bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed rounded"
            ref={ref}
            {...props}
          />
          <label htmlFor={props.id} className="ms-2">
            {props.label}
          </label>
        </div>
        <ValidationError error={props.error} />
      </div>
    );
  }
);

export default Checkbox;
