"use client";

import { Suspense } from "react";
import useHydration from "@/app/components/common/hooks/useHydration";
import { dateTimeFormat } from "@/app/lib/formatters";

export interface LocalizedDateTimeProps {
  timestamp: number;
}

const LocalizedDateTime = ({ timestamp }: LocalizedDateTimeProps) => {
  const hydrated = useHydration();
  return (
    <Suspense key={hydrated ? "local" : "server"}>
      {dateTimeFormat.format(timestamp)}
      {hydrated ? "" : " [Server Time]"}
    </Suspense>
  );
};

export default LocalizedDateTime;
