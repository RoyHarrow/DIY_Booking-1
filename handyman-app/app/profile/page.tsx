'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Address {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface Profile {
  id: string
  email: string
  fullName: string
  phone: string | null
  addresses: Address[]
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', phone: '' })
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false,
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [editAddressForm, setEditAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false,
  })
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setFormData({ fullName: data.fullName, phone: data.phone || '' })
      } else {
        setError('Failed to load profile')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = localStorage.getItem('accessToken')

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setEditing(false)
      } else {
        setError('Failed to update profile')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = localStorage.getItem('accessToken')

    try {
      const res = await fetch('/api/profile/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      })

      if (res.ok) {
        setShowAddressForm(false)
        setAddressForm({
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          isDefault: false,
        })
        fetchProfile()
      } else {
        setError('Failed to add address')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id)
    setEditAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    })
  }

  const handleUpdateAddress = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    const token = localStorage.getItem('accessToken')

    try {
      const res = await fetch(`/api/profile/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editAddressForm),
      })

      if (res.ok) {
        setEditingAddressId(null)
        fetchProfile()
      } else {
        setError('Failed to update address')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handleDeleteAddress = async (id: string) => {
    const token = localStorage.getItem('accessToken')

    try {
      const res = await fetch(`/api/profile/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        fetchProfile()
      } else {
        setError('Failed to delete address')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Profile not found</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-2">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Full Name:</strong> {profile.fullName}</p>
              <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Addresses</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {showAddressForm ? 'Cancel' : 'Add Address'}
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="mb-6 p-4 border rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street"
                  value={addressForm.street}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={addressForm.postalCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded"
                  />
                  <span className="ml-2">Set as default</span>
                </label>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Address
              </button>
            </form>
          )}

          <div className="space-y-4">
            {profile.addresses.map((address) => (
              <div key={address.id} className="border rounded-md p-4">
                {editingAddressId === address.id ? (
                  <form onSubmit={(e) => handleUpdateAddress(e, address.id)} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" placeholder="Street" value={editAddressForm.street}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAddressForm({ ...editAddressForm, street: e.target.value })}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                      <input type="text" placeholder="City" value={editAddressForm.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAddressForm({ ...editAddressForm, city: e.target.value })}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                      <input type="text" placeholder="State" value={editAddressForm.state}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAddressForm({ ...editAddressForm, state: e.target.value })}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                      <input type="text" placeholder="Postal Code" value={editAddressForm.postalCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAddressForm({ ...editAddressForm, postalCode: e.target.value })}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                      <input type="text" placeholder="Country" value={editAddressForm.country}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAddressForm({ ...editAddressForm, country: e.target.value })}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                      <label className="flex items-center">
                        <input type="checkbox" checked={editAddressForm.isDefault}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAddressForm({ ...editAddressForm, isDefault: e.target.checked })}
                          className="rounded" />
                        <span className="ml-2">Set as default</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">Save</button>
                      <button type="button" onClick={() => setEditingAddressId(null)} className="text-gray-600 hover:text-gray-800 text-sm">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                      {address.isDefault && <span className="text-sm text-green-600 font-medium">Default</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditAddress(address)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                      <button onClick={() => handleDeleteAddress(address.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}