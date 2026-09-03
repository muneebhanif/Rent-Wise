import { useState } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../components/ui/adminsidebar"
import { Home, Users, List, FileText, LogOut, Bell, Settings } from "lucide-react"
import AdminOverview from "./AdminOverview"
import UserManagement from "./UserManagement"
import ListingManagement from "./ListingManagement"
import BlockchainAgreements from "./BlockchainAgreements"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />
      case "users":
        return <UserManagement />
      case "listings":
        return <ListingManagement />
      case "agreements":
        return <BlockchainAgreements />
      default:
        return <AdminOverview />
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gray-50">
        {/* <Sidebar> */}
          <SidebarHeader>
            <div className="flex items-center px-3 py-4">
              <div className="relative w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                RW
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-900">RentWise</h2>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          {/* <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                  <Home size={20} />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "users"} onClick={() => setActiveTab("users")}>
                  <Users size={20} />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "listings"} onClick={() => setActiveTab("listings")}>
                  <List size={20} />
                  <span>Listings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "agreements"} onClick={() => setActiveTab("agreements")}>
                  <FileText size={20} />
                  <span>Agreements</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent> */}

          <SidebarFooter>
            <div className="p-3 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Bell size={20} className="text-gray-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Settings size={20} className="text-gray-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <LogOut size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                  AD
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@rentwise.com</p>
                </div>
              </div>
            </div>
          </SidebarFooter>
        {/* </Sidebar> */}

        <main className="flex-1 p-6">
          <div className="container mx-auto">{renderTabContent()}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}