import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Clock,
} from "lucide-react"
import { getAllListsOFUser } from "../../Api/Admin"
import { Flex } from "@chakra-ui/react"
import ColorTubeLoader from "../../components/Style/ColorTubeLoader"

// Static data for demonstration
// const users = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john@example.com",
//     role: "Renter",
//     status: "Active",
//     joinDate: "2023-05-15",
//     avatar: "/placeholder.svg?height=400&width=400&text=JD",
//     location: "New York, USA",
//     phone: "+1 (555) 123-4567",
//     listings: 0,
//     bookings: 12,
//     lastActive: "2 hours ago",
//     verified: true,
//     bio: "Frequent traveler looking for comfortable accommodations.",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     email: "jane@example.com",
//     role: "Owner",
//     status: "Active",
//     joinDate: "2023-04-20",
//     avatar: "/placeholder.svg?height=400&width=400&text=JS",
//     location: "Los Angeles, USA",
//     phone: "+1 (555) 987-6543",
//     listings: 3,
//     bookings: 0,
//     lastActive: "1 day ago",
//     verified: true,
//     bio: "Property owner with multiple listings across the city.",
//   },
//   {
//     id: "3",
//     name: "Bob Johnson",
//     email: "bob@example.com",
//     role: "Renter",
//     status: "Inactive",
//     joinDate: "2023-03-10",
//     avatar: "/placeholder.svg?height=400&width=400&text=BJ",
//     location: "Chicago, USA",
//     phone: "+1 (555) 246-8135",
//     listings: 0,
//     bookings: 5,
//     lastActive: "2 weeks ago",
//     verified: false,
//     bio: "Looking for affordable housing options.",
//   },
//   {
//     id: "4",
//     name: "Alice Williams",
//     email: "alice@example.com",
//     role: "Owner",
//     status: "Active",
//     joinDate: "2023-02-05",
//     avatar: "/placeholder.svg?height=400&width=400&text=AW",
//     location: "Miami, USA",
//     phone: "+1 (555) 369-8520",
//     listings: 2,
//     bookings: 0,
//     lastActive: "3 days ago",
//     verified: true,
//     bio: "Beach property specialist with oceanfront rentals.",
//   },
//   {
//     id: "5",
//     name: "Charlie Brown",
//     email: "charlie@example.com",
//     role: "Owner",
//     status: "Pending",
//     joinDate: "2023-06-01",
//     avatar: "/placeholder.svg?height=400&width=400&text=CB",
//     location: "Seattle, USA",
//     phone: "+1 (555) 147-2583",
//     listings: 1,
//     bookings: 0,
//     lastActive: "5 hours ago",
//     verified: false,
//     bio: "New property owner looking to rent my space.",
//   },
//   {
//     id: "6",
//     name: "Diana Miller",
//     email: "diana@example.com",
//     role: "Renter",
//     status: "Active",
//     joinDate: "2023-01-15",
//     avatar: "/placeholder.svg?height=400&width=400&text=DM",
//     location: "Boston, USA",
//     phone: "+1 (555) 753-1928",
//     listings: 0,
//     bookings: 8,
//     lastActive: "1 hour ago",
//     verified: true,
//     bio: "Business traveler seeking accommodations near conference centers.",
//   },
// ]

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

 

 


  useEffect(()=>{
    const getAllUsers = async () => {
    const response = await getAllListsOFUser();
    setUsers(response.data.data.allUser)
    setLoading(false)
    }
    getAllUsers()

     // Apply filters and search to user list
  
 
  },[])

  const filteredUsers = users?.filter(
    (user) =>
      (roleFilter === "All" || user?.role === roleFilter) &&
      (statusFilter === "All" || user?.status === statusFilter) &&
      (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.location?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

   // Paginate filtered users
   const indexOfLastUser = currentPage * usersPerPage
   const indexOfFirstUser = indexOfLastUser - usersPerPage
   const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser)
   const totalPages = Math.ceil(filteredUsers?.length / usersPerPage)

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserDetailsModal(true)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

    if (loading) {
                return (
                  <Flex justify="center" align="center" height="100vh">
                    <ColorTubeLoader/>
                  </Flex>
                );
              } 
  return (
    <div className="space-y-6 mx-4 ">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Renter">Renter</option>
                <option value="Owner">Owner</option>
              </select>
              <Filter size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
              <Filter size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Joined
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <img
                          src={`${import.meta.env.VITE_BACK_END_URL}${user.imageUrl}` || "/images/randomUser.png"}
                          alt={user.name}
                          className="rounded-full object-cover h-full w-full"
                        />
                        {user.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                            <CheckCircle size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail size={12} className="mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === "Owner" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {user.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {user.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleViewUser(user)} className="text-orange-600 hover:text-orange-900 mr-3">
                      View
                    </button>
                    <button
                      onClick={() => handleStatusChange(user.id, user.status === "Active" ? "Inactive" : "Active")}
                      className={`${
                        user.status === "Active"
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      {user.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-500 disabled:opacity-50"
            >
              <ArrowLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-orange-500 text-white"
                    : "border border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-500 disabled:opacity-50"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-orange-500 to-orange-600">
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <XCircle size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col items-center -mt-16 mb-6">
                <div className="relative w-32 h-32 border-4 border-white rounded-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_BACK_END_URL}${selectedUser.imageUrl}` || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedUser.verified && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                <div className="flex items-center mt-1">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full mr-2 ${
                      selectedUser.role === "Owner" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : selectedUser.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 text-center">{selectedUser.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{selectedUser.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-900">Joined: {selectedUser.joinDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-900">Last Active: {selectedUser.lastActive}</span>
                    </div>
                    <div className="flex items-center">
                      {selectedUser.verified ? (
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                      ) : (
                        <XCircle size={16} className="text-red-500 mr-2" />
                      )}
                      <span className="text-gray-900">
                        {selectedUser.verified ? "Verified Account" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Total Listings</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedUser.listings}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedUser.bookings}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowUserDetailsModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <div className="space-x-3">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedUser.id, selectedUser.status === "Active" ? "Inactive" : "Active")
                    }
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedUser.status === "Active"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
                  </button>
                  <Link to={`/profile/${selectedUser._id}`} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center">
                    <ExternalLink size={16} className="mr-2" />
                    View Profile
                  </Link>                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement