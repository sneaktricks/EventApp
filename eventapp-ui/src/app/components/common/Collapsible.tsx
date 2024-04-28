"use client";

import { Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const Collapsible = (props: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const onTitleClickAction = () => {
    setCollapsed((c) => !c);
  };

  return (
    <div>
      <div
        className={clsx(
          "px-3 py-2 flex flex-row items-center grow bg-blue-500 hover:bg-blue-600 cursor-pointer",
          {
            rounded: collapsed,
            "rounded-t": !collapsed,
          }
        )}
        onClick={onTitleClickAction}
      >
        <div className="flex grow font-semibold text-2xl">{props.title}</div>
        <div className="place-content-end flex grow font-semibold text-2xl w-10 h-10">
          {collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </div>
      </div>
      {!collapsed && (
        <div className="p-3 bg-zinc-800 rounded-b">{props.children}</div>
      )}
    </div>
  );
};

export default Collapsible;
