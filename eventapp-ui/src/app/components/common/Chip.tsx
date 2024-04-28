import { AlertStyle } from "@/app/lib/definitions";
import clsx from "clsx";

export interface ChipProps {
  text: string;
  color: AlertStyle;
}

const Chip = (props: ChipProps) => {
  return (
    <div
      className={clsx("rounded text-xs font-semibold p-1 uppercase", {
        "bg-green-600": props.color === AlertStyle.Success,
        "bg-red-600": props.color === AlertStyle.Error,
        "bg-yellow-600": props.color === AlertStyle.Warning,
        "bg-blue-600": props.color === AlertStyle.Info,
      })}
    >
      {props.text}
    </div>
  );
};

export default Chip;
