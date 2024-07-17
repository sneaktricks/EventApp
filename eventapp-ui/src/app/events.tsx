import { fetchEvents } from "./lib/data";
import EventList from "./components/event/EventList";

export const dynamic = "force-dynamic";

const Events = async () => {
  const events = await fetchEvents();

  return <EventList events={events} />;
};

export default Events;
