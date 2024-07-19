import { AlertStyle } from "@/app/lib/definitions";
import clsx from "clsx";
import React from "react";

export interface OutlinedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  alertStyle?: AlertStyle;
}

const OutlinedButton = ({
  label,
  icon,
  alertStyle,
  ...props
}: OutlinedButtonProps) => {
  return (
    <button
      className={clsx(
        "border disabled:border-zinc-500 disabled:text-zinc-500 disabled:cursor-not-allowed px-3 py-2 rounded-lg",
        {
          "border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700":
            !alertStyle || alertStyle === AlertStyle.Info,
          "border-red-500 text-red-500 hover:border-red-700 hover:text-red-700":
            alertStyle === AlertStyle.Error,
          "border-orange-500 text-orange-500 hover:border-orange-700 hover:text-orange-700":
            alertStyle === AlertStyle.Warning,
          "border-green-500 text-green-500 hover:border-green-700 hover:text-green-700":
            alertStyle === AlertStyle.Success,
        }
      )}
      {...props}
    >
      <div className="flex flex-row gap-1 justify-center items-center font-semibold">
        {!!icon && <div className="h-5 w-5">{icon}</div>}
        <div>{label}</div>
      </div>
    </button>
  );
};

export default OutlinedButton;
