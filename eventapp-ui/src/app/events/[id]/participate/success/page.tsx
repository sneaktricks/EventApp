"use client";

import ParticipationSuccessMessage from "@/app/components/participation/ParticipationSuccessMessage";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <ParticipationSuccessMessage />
    </Suspense>
  );
};

export default Page;
