"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const eventName = searchParams.get("eventName");
  const eventId = searchParams.get("eventId");
  const adminCode = searchParams.get("adminCode");

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Success!</h1>
      <p className="mb-6">Your event "{eventName}" was created successfully.</p>
      <p className="mb-6">
        In case you want to edit your event later on, you need the code below.
        Keep the code securely stored, as anyone with this code can edit your
        event.
      </p>
      <p className="p-5 font-mono tracking-widest mb-3 bg-black text-white font-bold text-2xl border border-zinc-600 rounded-lg">
        {adminCode}
      </p>
      <p className="font-semibold">
        You can find your event{" "}
        <Link href={`/events/${eventId}`}>
          <span className="text-blue-600 hover:text-blue-500">here</span>
        </Link>
        .
      </p>
    </div>
  );
};

export default Page;
