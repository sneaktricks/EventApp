import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { FieldError } from "react-hook-form";

export interface ValidationErrorProps {
  error: FieldError | undefined;
}

const ValidationError = (props: ValidationErrorProps) =>
  props.error ? (
    <div className="flex flex-row space-x-1 grow items-center text-xs text-red-600">
      <div className="h-4 w-4">
        <ExclamationCircleIcon />
      </div>
      <div>{props.error.message ?? "Please check your input"}</div>
    </div>
  ) : (
    <></>
  );

export default ValidationError;
