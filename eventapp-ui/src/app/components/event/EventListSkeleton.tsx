import EventListElementSkeleton from "./EventListElementSkeleton";

const EventListSkeleton = () => {
  const elems = Array.from(Array(10).keys());

  return (
    <div>
      <ul className="divide-y divide-zinc-500">
        {elems.map((e) => (
          <li key={e}>
            <EventListElementSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventListSkeleton;
