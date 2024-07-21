import { fetchEvents } from "@/app/lib/data";
import EventList from "@/app/components/event/EventList";

const Events = async () => {
  const events = await fetchEvents({ page: 1, limit: 25 });

  return <EventList events={events} />;
};

export default Events;
