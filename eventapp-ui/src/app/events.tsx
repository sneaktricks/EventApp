import * as mockData from "@/app/lib/mockData";
import { fetchEvents } from "./lib/data";
import EventList from "./components/event/EventList";

export const dynamic = "force-dynamic";

const Events = async () => {
  const events = await fetchEvents();

  return <EventList events={mockData.events.concat(events)} />;
};

export default Events;
