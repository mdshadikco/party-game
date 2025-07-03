"use client"

import { signOut } from "next-auth/react"
import { User } from "next-auth"

interface NavbarProps {
  user: User | undefined
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg 
                className="h-5 w-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Dashboard</span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src={user?.image || "/default-avatar.png"}
                alt={user?.name || "User"}
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="
                px-3 py-2 text-sm font-medium text-gray-700 
                bg-gray-100 rounded-lg 
                hover:bg-gray-200 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}