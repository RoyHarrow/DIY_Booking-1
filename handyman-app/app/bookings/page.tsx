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
}

interface ServiceType {
  id: string
  name: string
  description: string | null
}

interface Booking {
  id: string
  description: string
  preferredDate: string
  status: string
  address: Address
  serviceType: ServiceType
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    addressId: '',
    serviceTypeId: '',
    description: '',
    preferredDate: '',
  })
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const [bookingsRes, profileRes, serviceTypesRes] = await Promise.all([
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/service-types', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (bookingsRes.ok && profileRes.ok) {
        const bookingsData = await bookingsRes.json()
        const profileData = await profileRes.json()
        setBookings(bookingsData)
        setAddresses(profileData.addresses)
        if (serviceTypesRes.ok) {
          const serviceTypesData = await serviceTypesRes.json()
          setServiceTypes(serviceTypesData)
        }
      } else {
        setError('Failed to load data')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = localStorage.getItem('accessToken')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowCreateForm(false)
        setFormData({
          addressId: '',
          serviceTypeId: '',
          description: '',
          preferredDate: '',
        })
        fetchData()
      } else {
        setError('Failed to create booking')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem('accessToken')

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        fetchData()
      } else {
        setError('Failed to update booking status')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  function getStatusColor(status: string): string {
    const map: Record<string, string> = {
      REQUESTED: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return map[status] ?? 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {showCreateForm ? 'Cancel' : 'New Booking'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <select
                  value={formData.serviceTypeId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, serviceTypeId: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <select
                  value={formData.addressId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, addressId: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select an address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.street}, {address.city}, {address.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Describe the work needed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                <input
                  type="datetime-local"
                  value={formData.preferredDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Create Booking
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Booking History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                No bookings yet. Create your first booking above.
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium">{booking.serviceType.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{booking.description}</p>
                      <p className="text-sm text-gray-500">
                        {booking.address.street}, {booking.address.city}, {booking.address.state}
                      </p>
                      <p className="text-sm text-gray-500">
                        Preferred: {new Date(booking.preferredDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      {booking.status === 'REQUESTED' || booking.status === 'ACCEPTED' ? (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}