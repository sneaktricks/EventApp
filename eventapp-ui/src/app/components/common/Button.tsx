import { AlertStyle } from "@/app/lib/definitions";
import clsx from "clsx";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  alertStyle?: AlertStyle;
}

const Button = ({ label, icon, alertStyle, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        "disabled:bg-zinc-500 disabled:cursor-not-allowed px-3 py-2 rounded-lg text-white",
        {
          "bg-blue-500 hover:bg-blue-700":
            !alertStyle || alertStyle === AlertStyle.Info,
          "bg-red-500 hover:bg-red-700": alertStyle === AlertStyle.Error,
          "bg-orange-500 hover:bg-orange-700":
            alertStyle === AlertStyle.Warning,
          "bg-green-500 hover:bg-green-700": alertStyle === AlertStyle.Success,
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

export default Button;
