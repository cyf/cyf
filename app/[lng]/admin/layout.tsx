import React from "react";
import UserProvider from "./user-provider";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return <UserProvider lng={params.lng}>{children}</UserProvider>;
}
