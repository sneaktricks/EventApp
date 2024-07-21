const EventListElementSkeleton = () => {
  return (
    <div className="animate-pulse p-3 grid grid-cols-12 gap-3 items-center bg-zinc-800">
      <div className="col-span-12 flex flex-row space-x-2 grow items-center w-96 h-5">
        <div className="w-full h-full rounded bg-gray-200 dark:bg-gray-600" />
      </div>
      <div className="col-span-12 h-16">
        <div className="w-full h-full rounded bg-gray-200 dark:bg-gray-600" />
      </div>
      <div className="col-span-12 text-sm flex flex-row space-x-2 grow items-center w-40 h-5">
        <div className="w-full h-full rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
  );
};

export default EventListElementSkeleton;
