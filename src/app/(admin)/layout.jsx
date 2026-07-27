
import AdminHeader from "@/components/admin/header/AdminHeader";
import AdminTopBar from "@/components/admin/header/AdminTopBar";
import { UserProvider } from "@/context/UserContext";
export default function UserLayout({ children }) {
  return (
    <UserProvider>
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <AdminHeader />
      {/* Right Side */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <AdminTopBar />
        {/* Page Content */}
        <main className="container-page flex-1 overflow-y-auto bg-gray-50 p-5">
          {children}
        </main>
      </div>
    </div>
       </UserProvider>
  );
}
