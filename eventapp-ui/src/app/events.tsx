import { fetchEvents } from "./lib/data";
import EventList from "./components/event/EventList";

export const dynamic = "force-dynamic";

const Events = async () => {
  const events = await fetchEvents({ page: 1, limit: 25 });

  return <EventList events={events} />;
};

export default Events;
