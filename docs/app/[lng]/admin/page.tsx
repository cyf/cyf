"use client";
import Link from "next/link";
import { useAppSelector, selectUser } from "@/model";

export default function Admin({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const user = useAppSelector(selectUser);

  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="w-full">
          <span>Admin Page</span>
          <br />
          <Link
            className="cursor-pointer text-red-400 hover:text-xl"
            href={`/${params.lng}/admin/user`}
          >
            {user?.nickname}
          </Link>
        </div>
      </div>
    </>
  );
}
