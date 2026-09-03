import React from 'react'
import { useAuth } from '../hooks/AuthContext'

function Home() {
  const { user, status } = useAuth();
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin text-orange-500 text-4xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen text-orange-500 text-xl">
      No user information available.
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl font-bold text-orange-500 mb-6 border-b-2 border-orange-300 pb-4">
          Welcome, {user.name}!
        </h1>
        <div className="space-y-4">
          <p className="text-xl text-gray-700 hover:text-orange-500 transition-colors duration-300">
            <span className="font-semibold text-orange-400">Email:</span> {user.email}
          </p>
          <p className="text-xl text-gray-700 hover:text-orange-500 transition-colors duration-300">
            <span className="font-semibold text-orange-400">Role:</span> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home