import * as mockData from "@/app/lib/mockData";
import Button from "@/app/components/common/Button";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { fetchEvents } from "./lib/data";
import EventList from "./components/event/EventList";

export default async function Home() {
  const events = await fetchEvents();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome to EventApp</h1>
      <div>
        <Link href="/events/create">
          <Button label="Create Event" icon={<PlusIcon />} />
        </Link>
      </div>
      <div className="my-5">
        <EventList events={mockData.events.concat(events)} />
      </div>
    </div>
  );
}
