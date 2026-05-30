import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaIdCard, FaMapMarker } from 'react-icons/fa'
import { validateEmail, validatePassword } from '../utils/validators'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadingSpinner'

const ProfileSettings = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '9876543210',
    address: user?.address || 'Mumbai, India',
    panCard: user?.panCard || 'ABCDE1234F'
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const validateProfile = () => {
    const newErrors = {}
    if (!profileData.name.trim()) newErrors.name = 'Name is required'
    if (!validateEmail(profileData.email)) newErrors.email = 'Valid email is required'
    if (profileData.phone && !/^[6-9]\d{9}$/.test(profileData.phone)) {
      newErrors.phone = 'Valid 10-digit phone number required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (!validatePassword(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 6 characters with one number and one letter'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return
    
    setIsLoading(true)
    try {
      await updateProfile(profileData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!validatePasswordForm()) return
    
    setIsLoading(true)
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return <LoadingSpinner fullScreen />

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold gradient-text mb-6">Profile Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'profile' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FaUser className="inline mr-2" />
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'security' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <FaLock className="inline mr-2" />
          Security
        </button>
      </div>

      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <form onSubmit={handleProfileSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <div className="relative">
                  <FaMapMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">PAN Card Number</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="panCard"
                    value={profileData.panCard}
                    onChange={handleProfileChange}
                    className="input-field pl-10"
                    disabled
                    className="input-field pl-10 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">PAN card cannot be changed</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`input-field pl-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`input-field pl-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters with at least one number and one letter</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Changing...</span>
                  </>
                ) : (
                  <>
                    <FaLock />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  )
}

export default ProfileSettings