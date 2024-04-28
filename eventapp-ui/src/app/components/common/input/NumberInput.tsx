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
  (props, ref) => {
    const value = useWatch({
      name: props.name,
      defaultValue: props.defaultValue ?? 1,
    });

    return (
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          {!!props.label && (
            <label htmlFor={props.id} className="">
              {props.label}
            </label>
          )}
          <input
            id={props.id}
            type="number"
            className={clsx(
              "border w-24 bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed rounded-lg p-1",
              { "border-red-600": !!props.error }
            )}
            ref={ref}
            defaultValue={props.defaultValue ?? 1}
            {...props}
          />
          {!!props.unit && (
            <span>
              {value === 1 || value === -1
                ? props.unit.singularForm
                : props.unit.pluralForm}
            </span>
          )}
        </div>
        <ValidationError error={props.error} />
      </div>
    );
  }
);

export default NumberInput;
