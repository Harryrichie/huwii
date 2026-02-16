"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  Plus,
  Zap,
  Search,
} from "lucide-react";
import SignOutButton from "./signout";
import RecentHistory from "./recent-history";
import { Logo } from "./logo";
export default function UserSideBar({
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
 
}) {
    const pathname = usePathname();
    const isImageGen = pathname?.includes("/dashboard/image-generator");
    const isSearch = pathname === "/dashboard/search";

    return (
      <>

        <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Top section: Logo and Nav */}
            <div>
              <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
                <Logo className="h-8 w-auto text-indigo-600" />
              </div>
              
              <nav className="space-y-1 px-3 py-4">
                <Link 
                  href={isImageGen ? "/dashboard/image-generator" : "/dashboard/user"} 
                  onClick={() => {
                    window.dispatchEvent(new Event('new-chat'));
                    if (!isImageGen) {
                      sessionStorage.removeItem('huwii-chat-history');
                    }
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    !isImageGen && !isSearch 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Plus className="h-5 w-5"/>
                  <span className="font-medium">New Chat</span>
                </Link>
                <Link 
                  href="/dashboard/search" 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isSearch ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Search className="h-5 w-5" />
                  <span className="font-medium">Search Chats</span>
                </Link>
                <Link 
                  href="/dashboard/image-generator" 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isImageGen ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <ImageIcon className="h-5 w-5" />
                  <span className="font-medium">Image Studio</span>
                </Link>
              </nav>
            </div>

            {/* Middle section: Recent History (Scrollable) */}
            <div className="flex-1 mt-6 px-3 min-h-0">
              <RecentHistory/>
            </div>

            {/* Bottom section: Pro Plan and Sign Out */}
            <div className="border-t border-gray-200 p-4">
              <div className="mb-4 rounded-lg bg-indigo-50 p-4">
                <div className="flex items-center gap-2 text-indigo-800">
                  <Zap className="h-4 w-4 fill-indigo-600 text-indigo-600" />
                  <span className="text-sm font-semibold">Pro Plan</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-indigo-200">
                  <div className="h-2 w-3/4 rounded-full bg-indigo-600"></div>
                </div>
                <p className="mt-2 text-xs text-indigo-700">7,500 / 10,000 words used</p>
              </div>
              <SignOutButton />
            </div>
          </div>
      </aside>

      </>
    )
}