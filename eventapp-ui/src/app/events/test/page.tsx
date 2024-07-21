import EventListSkeleton from "@/app/components/event/EventListSkeleton";
import ParticipationTableSkeleton from "@/app/components/participation/ParticipationTableSkeleton";

export default async function Page() {
  return (
    <div>
      <EventListSkeleton />
      <ParticipationTableSkeleton />
    </div>
  );
}
