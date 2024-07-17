import { IEvent } from "@/app/lib/definitions";
import EventListElement from "./EventListElement";
import Link from "next/link";

export interface EventListProps {
  events: readonly IEvent[];
}

const EventList = (props: EventListProps) => {
  return (
    <div>
      <ul className="divide-y divide-zinc-500">
        {props.events.map((e) => (
          <li key={e.id}>
            <Link href={`/events/${e.id}`}>
              <EventListElement eventData={e} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
