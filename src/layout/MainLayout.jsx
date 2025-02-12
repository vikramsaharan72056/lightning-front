import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import MenuImage from "../assets/MenuImage";
import Navbar from "../components/Navbar";


const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(false); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex bg-[#f4f6f8] relative">
     
      

      
      <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />

      
      <main
        className={`flex-1 p-6 overflow-auto transition-all ${
          isMobile && isSidebarOpen ? "opacity-90" : "opacity-100"
        } ${!isMobile ? "ml-72" : "mt-16"}`}
      >
        {isMobile && <div className="flex  items-center p-4 py-3 gap-3 bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-[#292742] h-16 ">
          <button
          className=" bg-white border-2 border-solid h-10 w-10 p-1.5 border-[#635bff] text-[#635bff] rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MenuImage />
        </button>
        <Navbar />
        </div>
        }
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
