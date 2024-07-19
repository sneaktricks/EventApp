import EventEditForm from "@/app/components/event/EventEditForm";
import { fetchEventById } from "@/app/lib/data";

const Page = async ({ params }: { params: { id: string } }) => {
  const eventData = await fetchEventById(params.id);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Edit Event</h1>
      <EventEditForm eventData={eventData} />
    </div>
  );
};

export default Page;
