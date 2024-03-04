"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector, selectUser } from "@/model";

export default function User({
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
          <span>User Page</span>
          <Avatar>
            <AvatarImage src={user?.avatar || ""} alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{user?.nickname}</span>
        </div>
      </div>
    </>
  );
}
