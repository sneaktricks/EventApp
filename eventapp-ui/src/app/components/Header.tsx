import Link from "next/link";
import Button from "./common/Button";
import { PencilIcon } from "@heroicons/react/24/solid";

const Header = () => {
  return (
    <nav className="p-4 mb-4 shadow bg-black">
      <div className="flex items-center">
        <div className="flex-grow-0">
          <a href="/">
            <div className="text-3xl font-semibold tracking-wide">EventApp</div>
          </a>
        </div>
        <div className="flex items-center justify-end flex-grow">
          <div className="flex items-center space-x-4">
            <Link href="/events/edit">
              <Button label="Edit Event" icon={<PencilIcon />} />
            </Link>
            <Link href="/participations/edit">
              <Button label="Edit Participation" icon={<PencilIcon />} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
