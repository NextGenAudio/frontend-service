import React from "react";
import Header from "../components/header";
import { AppFooter } from "../components/footer";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div>{children}</div>
      <AppFooter />
    </>
  );
}
