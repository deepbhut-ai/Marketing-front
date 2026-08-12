"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isdark,setIsdark]=useState(true)
  const [openMobileNav,setOpenMobileNav]=useState(false)
  const [mounted, setMounted] = useState(false)
    // ✅ Apply dark class to body whenever isdark changes
  useEffect(() => {
    if (isdark) {
      document.documentElement.classList.add("dark");    // for Tailwind
      document.body.classList.add("dark-mode");          // for custom CSS
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }
    // Theme has been applied to the DOM — safe to show the real UI
    setMounted(true)
  }, [isdark]);

   const handelDrakmode = (value) => {
    setIsdark(value);
  };

  const value = {
    sidebarOpen,
    setSidebarOpen,
    isdark,
    setIsdark,
    handelDrakmode,
    openMobileNav,
    setOpenMobileNav,
    mounted,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    console.log("🚀 ~ useUserContext ~ context:", context)
    
    throw new Error("useUserContext must be used within UserProvider");
  }

  return context;
};