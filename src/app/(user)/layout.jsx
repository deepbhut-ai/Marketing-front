import Header from "@/components/user/header/Header";
import TopBar from "@/components/user/header/TopBar";
import { UserProvider } from "@/context/UserContext";
import { App as AntApp } from "antd";
export default function UserLayout({ children }) {
  return (
    <UserProvider>
    <AntApp>
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
    </AntApp>
       </UserProvider>
  );
}
