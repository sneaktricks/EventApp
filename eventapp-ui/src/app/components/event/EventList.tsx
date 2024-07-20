"use client";

import { IEvent } from "@/app/lib/definitions";
import EventListElement from "./EventListElement";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchEvents } from "@/app/lib/data";

export interface EventListProps {
  events: readonly IEvent[];
}

const EventList = (props: EventListProps) => {
  const [events, setEvents] = useState<IEvent[]>([...props.events]);
  const [nextPage, setNextPage] = useState(2);
  const intersectionObserverRef = useRef<HTMLDivElement | null>(null);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      const intersectionRatio = entries.at(0)?.intersectionRatio ?? 0;
      if (intersectionRatio > 0.5) {
        console.log(`Fetching events page ${nextPage}`);
        const newEvents = await fetchEvents({ page: nextPage });
        if (newEvents.length === 0) {
          console.log("Events end reached");
          setIsEndReached(true);
        }
        setNextPage((p) => p + 1);

        // Get rid of duplicates
        const existingEventIds = events.map((e) => e.id);
        const filteredNewEvents = newEvents.filter(
          (e) => !existingEventIds.includes(e.id)
        );

        // Append unique events to list
        setEvents((e) => [...e, ...filteredNewEvents]);
      }
    });

    const ref = intersectionObserverRef.current;

    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [nextPage, intersectionObserverRef, events]);

  return (
    <div>
      <ul className="divide-y divide-zinc-500">
        {events.map((e, idx) => (
          <li key={e.id}>
            {!isEndReached && idx === Math.max(0, events.length - 5) && (
              <div ref={intersectionObserverRef} />
            )}
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
