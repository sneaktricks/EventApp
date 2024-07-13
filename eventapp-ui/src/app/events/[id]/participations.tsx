import ParticipationTable from "@/app/components/participation/ParticipationTable";
import { fetchParticipantsByEventId as fetchParticipationsByEventId } from "@/app/lib/data";

export interface ParticipationsProps {
  eventId: string;
}

const Participations = async ({ eventId }: ParticipationsProps) => {
  const participations = await fetchParticipationsByEventId(eventId);

  return (
    <div>
      <p className="mb-2">{participations.participantCount} in event</p>
      <ParticipationTable participations={participations} />
    </div>
  );
};

export default Participations;
