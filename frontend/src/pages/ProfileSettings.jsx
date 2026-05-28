import React from 'react'
import { useAuth } from '../hooks/useAuth'

const ProfileSettings = () => {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input type="text" value={user?.name || ''} className="w-full px-4 py-2 border rounded-lg" readOnly />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" value={user?.email || ''} className="w-full px-4 py-2 border rounded-lg" readOnly />
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings