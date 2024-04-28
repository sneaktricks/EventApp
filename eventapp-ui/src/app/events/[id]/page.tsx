import Collapsible from "@/app/components/common/Collapsible";
import LocalizedDateRange from "@/app/components/common/LocalizedDateRange";
import ParticipationForm from "@/app/components/participation/ParticipationForm";
import ParticipationTableSkeleton from "@/app/components/participation/ParticipationTableSkeleton";
import { fetchEventById } from "@/app/lib/data";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { Suspense } from "react";
import Participations from "./participations";

const Page = async ({ params }: { params: { id: string } }) => {
  const event = await fetchEventById(params.id);

  const now = Date.now();

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-4xl font-bold mb-8">{event.name}</h1>
        <div className="grid gap-5">
          <p className="whitespace-pre-line">{event.description}</p>
          <div className="grid gap-1">
            <div className="flex flex-row space-x-1 items-center">
              <div className="h-5 w-5">
                <ClockIcon />
              </div>
              <div className="mr-1">
                <LocalizedDateRange
                  start={event.startsAt.getTime()}
                  end={event.endsAt.getTime()}
                />
              </div>
            </div>
            <div className="flex flex-row space-x-1 items-center">
              <div className="h-5 w-5">
                <MapPinIcon />
              </div>
              <div>{event.location}</div>
            </div>
          </div>
          {event.participationStartsAt.getTime() <= now &&
            now < event.participationEndsAt.getTime() && (
              <Collapsible title="Participate">
                <ParticipationForm eventId={event.id} />
              </Collapsible>
            )}
        </div>
      </div>
      <div>
        <Suspense fallback={<ParticipationTableSkeleton />}>
          <Participations eventId={params.id} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
