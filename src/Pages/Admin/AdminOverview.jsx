import { Users, Home, Calendar, TrendingUp, DollarSign, Clock, AlertCircle, FileText } from "lucide-react"

const AdminOverview = () => {
  // This would be connected to real data in a production app
  const stats = {
    totalUsers: 1247,
    totalListings: 546,
    activeListings: 432,
    totalBookings: 897,
    growthRate: 12.4,
    revenue: 45690,
    pendingApprovals: 24,
    systemAlerts: 2,
  }


  return (
    <div className="space-y-6 mx-4 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div>
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">+5.2%</span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Listings</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.activeListings}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Home className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">+3.1%</span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalBookings}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">+7.4%</span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">+10.3%</span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Growth Overview</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                Listings
              </button>
              <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Users</button>
              <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Bookings</button>
            </div>
          </div>

          <div className="h-60 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Growth chart visualization would appear here</p>
              <p className="text-sm text-gray-400">Connected to real analytics in production</p>
            </div>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Action Required</h3>

          <div className="space-y-4">
            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{stats.pendingApprovals} Pending Approvals</p>
                <p className="text-sm text-gray-600">Listings awaiting your review</p>
                <button className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700">Review Now</button>
              </div>
            </div>

            <div className="flex items-start p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{stats.systemAlerts} System Alerts</p>
                <p className="text-sm text-gray-600">Issues that need attention</p>
                <button className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700">View Alerts</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm font-medium text-orange-600 hover:text-orange-700">View All</button>
        </div> */}

        {/* <div className="space-y-4">
          {recentActivity?.map((activity) => (
            <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div
                className={`p-2 rounded-lg mr-4 ${
                  activity.type === "user"
                    ? "bg-blue-100"
                    : activity.type === "listing"
                      ? "bg-green-100"
                      : activity.type === "booking"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                }`}
              >
                {activity.type === "user" ? (
                  <Users size={16} className="text-blue-600" />
                ) : activity.type === "listing" ? (
                  <Home size={16} className="text-green-600" />
                ) : activity.type === "booking" ? (
                  <Calendar size={16} className="text-purple-600" />
                ) : (
                  <FileText size={16} className="text-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.name}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  )
}

export default AdminOverview