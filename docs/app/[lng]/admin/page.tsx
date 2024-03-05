"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { selectUser } from "@/model/slices/user/slice";
import { useAppSelector } from "@/model/hooks";

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
          <Avatar>
            <AvatarImage src={user?.avatar || ""} alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
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
