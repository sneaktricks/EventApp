"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-5">404 - Event Not Found</h1>
      <p className="mb-1">
        We couldn&apos;t find an event with the ID you provided.
      </p>
      <Link href="/">
        <p className="text-blue-600 hover:text-blue-500 underline font-bold">
          Click here to view existing events
        </p>
      </Link>
    </div>
  );
};

export default NotFound;
