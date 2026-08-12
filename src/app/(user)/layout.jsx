"use client";
import Header from "@/components/user/header/Header";
import TopBar from "@/components/user/header/TopBar";
import { UserProvider, useUserContext } from "@/context/UserContext";
import { App as AntApp } from "antd";
import PageLoader from "@/components/common/Pageloader";

function LayoutContent({ children }) {
  const { mounted } = useUserContext();

  if (!mounted) return <PageLoader />;

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <Header />
      {/* Right Side */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        {/* Page Content */}
        <main className="container-page page-scroll flex-1 overflow-y-auto bg-gray-50 p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function UserLayout({ children }) {
  return (
    <UserProvider>
      <AntApp>
        <LayoutContent>{children}</LayoutContent>
      </AntApp>
    </UserProvider>
  );
}
