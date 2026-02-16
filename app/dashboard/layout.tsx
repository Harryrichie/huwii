"use client"
import {Inter, Geist_Mono} from "next/font/google"
import { useState } from "react"
import UserSideBar from "../ui/usersidebar"
import DashboardHeader from "../ui/dashboardheader"
import  "@/app/globals.css"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <UserSideBar isSidebarOpen={isSidebarOpen} />
      {/* Main Content */}
      <div className={`${inter.variable} ${geistMono.variable} antialiased flex flex-1 flex-col overflow-hidden`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        {children}
      </div>
    </div>
  )
}