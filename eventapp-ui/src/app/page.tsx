import Button from "@/app/components/common/Button";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Events from "./events";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome to EventApp</h1>
      <div>
        <Link href="/events/create">
          <Button label="Create Event" icon={<PlusIcon />} />
        </Link>
      </div>
      <div className="my-5">
        <Suspense fallback={<p>Loading...</p>}>
          <Events />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
