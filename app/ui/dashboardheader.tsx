"use client"
import { 
  Menu, 
  Bell,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";




export default function DashboardHeader({ toggleSidebar }: { toggleSidebar: () => void }){
  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
                <button onClick={toggleSidebar} className="text-gray-500 lg:hidden cursor-pointer">
                  <Menu className="h-6 w-6" />
                </button>
                
                <div className="flex flex-1 items-center justify-end gap-4">
                  {/* <div className="hidden w-full max-w-md lg:block">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search templates or history..." 
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div> */}
                  
                  <div className="flex items-center gap-4">
                    <button className="relative text-gray-500 hover:text-gray-700">
                      <Bell className="h-6 w-6" />
                      <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    <UserButton />
                  </div>
                </div>
              </header>
    </>
  )
}