import { Avatar, Image } from '@chakra-ui/react'
import React from 'react'


export default function UserList({ users, selectedUser, onSelectUser }) {
  return (
    <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
              selectedUser.id === user.id ? 'bg-orange-50' : ''
            }`}
            onClick={() => onSelectUser(user)}
          >
            <Avatar
              src={"/images/randomUser.png"}
              alt={user.name}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
              <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
            </div>
            {user.unread > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-semibold text-white bg-orange-500 rounded-full">
                {user.unread}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}