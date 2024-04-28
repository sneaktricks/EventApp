import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
}

const Button = (props: ButtonProps) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 disabled:bg-zinc-500 disabled:cursor-not-allowed px-3 py-2 rounded-lg text-white"
      {...props}
    >
      <div className="flex flex-row gap-1 justify-center items-center font-semibold">
        {!!props.icon && <div className="h-5 w-5">{props.icon}</div>}
        <div>{props.label}</div>
      </div>
    </button>
  );
};

export default Button;
