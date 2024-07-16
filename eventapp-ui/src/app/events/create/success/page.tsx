"use client";

import EventCreateSuccessMessage from "@/app/components/event/EventCreateSuccessMessage";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <EventCreateSuccessMessage />
    </Suspense>
  );
};

export default Page;
