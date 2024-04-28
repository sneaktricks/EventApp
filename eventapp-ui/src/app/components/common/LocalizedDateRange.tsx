"use client";

import { Suspense } from "react";
import useHydration from "@/app/components/common/hooks/useHydration";
import { dateTimeFormat } from "@/app/lib/formatters";

export interface LocalizedDateRangeProps {
  start: number;
  end: number;
}

const LocalizedDateRange = ({ start, end }: LocalizedDateRangeProps) => {
  const hydrated = useHydration();
  return (
    <Suspense key={hydrated ? "local" : "server"}>
      {dateTimeFormat.formatRange(start, end)}
      {hydrated ? "" : " [Server Time]"}
    </Suspense>
  );
};

export default LocalizedDateRange;
