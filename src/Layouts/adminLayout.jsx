import React from "react"
import Sidebar from "../components/ui/adminsidebar"

export default function AdminLayout({ children, activeItem = "dashboard" }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} />

      <main className="transition-all duration-300 md:ml-64 p-6">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  )
}