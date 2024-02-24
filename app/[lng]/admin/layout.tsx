import React from "react";
import UserProvider from "./user-provider";

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  return <UserProvider>{children}</UserProvider>;
}
