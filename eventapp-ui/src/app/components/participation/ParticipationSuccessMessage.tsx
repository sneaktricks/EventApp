"use client";

import { useSearchParams } from "next/navigation";

const ParticipationSuccessMessage = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const adminCode = searchParams.get("adminCode");

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Participation successful</h1>
      <p className="mb-6">
        You have successfully participated in the event ID &quot;{eventId}
        &quot;.
      </p>
      <p className="mb-6">
        To cancel or edit your participation, you&apos;ll need the code below.
        Please keep this code our shared secret, since anyone with the code can
        manage your participation.
      </p>
      <p className="p-5 font-mono tracking-widest mb-3 bg-black text-white font-bold text-2xl border border-zinc-600 rounded-lg">
        {adminCode}
      </p>
    </div>
  );
};

export default ParticipationSuccessMessage;
