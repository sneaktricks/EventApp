import React from "react";
import { FieldError, useWatch } from "react-hook-form";
import ValidationError from "../ValidationError";
import clsx from "clsx";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error: FieldError | undefined;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    const text = useWatch({
      name: props.name,
      defaultValue: props.defaultValue ?? "",
    });
    return (
      <div className="grid gap-1">
        <div className="">{props.label}</div>
        <input
          type="text"
          className={clsx(
            "border bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed rounded-lg p-2 w-full",
            { "border-red-600": !!props.error }
          )}
          ref={ref}
          {...props}
        />
        <div className="flex flex-row grow">
          <ValidationError error={props.error} />
          <div className="text-right grow text-xs text-zinc-500">
            {text ? text.length : 0}/{props.maxLength}
          </div>
        </div>
      </div>
    );
  }
);

export default TextField;
