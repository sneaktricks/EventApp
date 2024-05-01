import React from "react";
import { FieldError, useWatch } from "react-hook-form";
import ValidationError from "../ValidationError";
import clsx from "clsx";

export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error: FieldError | undefined;
  unit: { singularForm: string; pluralForm: string } | undefined;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, error, unit, ...props }, ref) => {
    const value = useWatch({
      name: props.name,
      defaultValue: props.defaultValue ?? 1,
    });

    return (
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          {!!label && (
            <label htmlFor={props.id} className="">
              {label}
            </label>
          )}
          <input
            id={props.id}
            type="number"
            className={clsx(
              "border w-24 bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed rounded-lg p-1",
              { "border-red-600": !!error }
            )}
            ref={ref}
            defaultValue={props.defaultValue ?? 1}
            {...props}
          />
          {!!unit && (
            <span>
              {value === 1 || value === -1
                ? unit.singularForm
                : unit.pluralForm}
            </span>
          )}
        </div>
        <ValidationError error={error} />
      </div>
    );
  }
);

export default NumberInput;
