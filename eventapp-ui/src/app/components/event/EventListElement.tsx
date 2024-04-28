import { AlertStyle, IEvent } from "@/app/lib/definitions";
import { formatRelativeTime, numberFormat } from "@/app/lib/formatters";
import { ClockIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import Chip from "@/app/components/common/Chip";
import LocalizedDateRange from "@/app/components/common/LocalizedDateRange";

export interface EventListEntryProps {
  eventData: IEvent;
}

const hour = 1000 * 60 * 60;

const getChip = (eventData: IEvent) => {
  const now = Date.now();
  const participationStartsAtTime = eventData.participationStartsAt.getTime();
  const participationEndsAtTime = eventData.participationEndsAt.getTime();

  if (now < participationStartsAtTime) {
    return (
      <Chip
        color={AlertStyle.Info}
        text={`Participation opens ${formatRelativeTime(
          participationStartsAtTime - now
        )}`}
      />
    );
  }
  if (participationStartsAtTime <= now && now < participationEndsAtTime) {
    if (participationEndsAtTime - now < 24 * hour) {
      return (
        <Chip
          color={AlertStyle.Warning}
          text={`Participation closes ${formatRelativeTime(
            participationEndsAtTime - now
          )}`}
        />
      );
    }
    return <Chip color={AlertStyle.Success} text="Participation Open" />;
  }
  return <Chip color={AlertStyle.Error} text="Participation Ended" />;
};

const EventListElement = ({ eventData }: EventListEntryProps) => {
  return (
    <div className="p-3 grid grid-cols-12 gap-3 items-center cursor-pointer bg-zinc-800 hover:bg-zinc-700">
      <div className="col-span-12 flex flex-row space-x-2 grow items-center">
        <div className="font-bold text-lg flex flex-row">{eventData.name}</div>
        <div className="font-bold text-lg flex flex-row">
          {getChip(eventData)}
        </div>
      </div>
      <div className="col-span-12">
        <div className="line-clamp-3">{eventData.description}</div>
      </div>
      <div className="col-span-12 text-sm flex flex-row space-x-2 grow items-center">
        <div className="flex flex-row">
          <div className="mr-1 h-5 w-5">
            <UserIcon />
          </div>
          <div className="mr-1">
            {numberFormat.format(
              eventData.participantLimit
                ? Math.min(
                    eventData.participantCount,
                    eventData.participantLimit
                  )
                : eventData.participantCount
            )}{" "}
            /{" "}
            {numberFormat.format(
              eventData.participantLimit ?? Number.POSITIVE_INFINITY
            )}
            {eventData.participantLimit &&
            eventData.participantCount > eventData.participantLimit
              ? ` (+${eventData.participantCount - eventData.participantLimit})`
              : ""}
          </div>
        </div>
        <div className="flex flex-row space-x-1">
          <div className="h-5 w-5">
            <ClockIcon />
          </div>
          <div className="mr-1">
            <LocalizedDateRange
              start={eventData.startsAt.getTime()}
              end={eventData.endsAt.getTime()}
            />
          </div>
        </div>
        <div className="flex flex-row space-x-1">
          <div className="h-5 w-5">
            <MapPinIcon />
          </div>
          <div>{eventData.location}</div>
        </div>
      </div>
    </div>
  );
};

export default EventListElement;
