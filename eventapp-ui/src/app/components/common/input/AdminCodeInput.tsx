"use client";

import { ActionResponse } from "@/app/lib/actions";
import clsx from "clsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export interface AdminCodeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  explanation?: string;
  blockCount: number;
  blockLength: number;
  submitHandler: (code: string) => Promise<ActionResponse>;
}

const splitStringIntoBlocks = (str: string, blockSize: number): string[] => {
  const blocks: string[] = [];
  for (let i = 0; i < str.length; i += blockSize) {
    blocks.push(str.slice(i, i + blockSize));
  }
  return blocks.length === 0 ? [""] : blocks;
};

const AdminCodeInput = (props: AdminCodeInputProps) => {
  const [blocks, setBlocks] = useState(
    Array<string>(props.blockCount).fill("")
  );
  const refs = Array.from({ length: props.blockCount }, () =>
    useRef<HTMLInputElement>(null)
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (blocks: string[]) => {
    setDisabled(true);
    setErrorMessage(null);
    const code = blocks.join("-").toUpperCase();
    await new Promise((r) => setTimeout(r, 2000));
    const resp = await props.submitHandler(code);
    setDisabled(false);
    if (resp) setErrorMessage(resp.message);
    setBlocks(Array<string>(props.blockCount).fill(""));
  };

  useEffect(() => {
    if (refs[0].current) {
      refs[0].current.focus();
    }
  }, []);

  const handleChange = (
    blockIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newBlocks = [...blocks];

    const splitBlockString = splitStringIntoBlocks(
      event.target.value.replaceAll("-", ""),
      6
    );
    let lastBlockIdx = blockIndex;
    splitBlockString.forEach((b, idx) => {
      const thisIdx = blockIndex + idx;
      if (thisIdx < props.blockCount) {
        newBlocks[thisIdx] = b.toUpperCase();
        lastBlockIdx = thisIdx;
      }
    });

    // const newValue = event.target.value.
    //   .slice(0, props.blockLength)
    //   .toUpperCase();
    // newBlocks[blockIndex] = newValue;
    setBlocks(newBlocks);

    if (newBlocks.every((b) => b.length === 6)) {
      submit(newBlocks);
      return;
    }

    if (
      newBlocks[lastBlockIdx].length >= props.blockLength &&
      blockIndex < props.blockCount - 1 &&
      refs[blockIndex + 1].current
    ) {
      refs[blockIndex + 1].current!.focus();
    }
  };

  return (
    <div className="grid gap-10 justify-center">
      <div className="text-4xl text-center">{props.label}</div>
      {props.explanation && (
        <div className="text text-center -mb-8 text-gray-500">
          {props.explanation}
        </div>
      )}
      <div className="flex items-center justify-center space-x-2">
        {blocks.map((block, index) => (
          <div className="space-x-2" key={index}>
            <input
              type="text"
              className={clsx(
                "border text-4xl font-mono tracking-widest bg-zinc-900 disabled:bg-zinc-500 disabled:border-zinc-400 disabled:cursor-not-allowed rounded-lg px-4 py-2 w-44",
                { "border-red-600": !!errorMessage }
              )}
              value={block}
              onChange={(e) => handleChange(index, e)}
              maxLength={props.blockLength * (props.blockCount + 1)}
              disabled={disabled}
              ref={refs[index]}
            />
            {index < props.blockCount - 1 && (
              <span className="text-4xl">-</span>
            )}
          </div>
        ))}
      </div>
      {errorMessage && (
        <div className="flex flex-row space-x-1 -mt-8 grow items-center text-xl justify-center text-red-600">
          <div className="h-5 w-5">
            <ExclamationCircleIcon />
          </div>
          <div>{errorMessage ?? "Please check your input"}</div>
        </div>
      )}
    </div>
  );
};

export default AdminCodeInput;
