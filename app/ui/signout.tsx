"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => {
        sessionStorage.removeItem('huwii-chat-history');
        sessionStorage.removeItem('huwii-image-session-id');
        sessionStorage.removeItem('huwii-image-messages');
        signOut({ redirectUrl: "/signin" });
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
    >
      <LogOut className="h-5 w-5" />
      <span className="font-medium">Sign out</span>
    </button>
  );
}
