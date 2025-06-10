"use client"

import { useState, useEffect } from "react"

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/admin/appointments")
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Randevular yüklenemedi")
      }
      const data = await response.json()
      setAppointments(data)
      setError("")
    } catch (error) {
      console.error("Hata:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (confirm("Bu randevuyu iptal etmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: "CANCELLED" })
        })
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Randevu iptal edilemedi")
        }
        
        await fetchAppointments()
        setError("")
      } catch (error) {
        console.error("Hata:", error)
        setError(error.message)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const date = formData.get("date")
    const time = formData.get("time")
    
    const updatedAppointment = {
      id: editingAppointment.id,
      date: new Date(`${date}T${time}`).toISOString(),
      status: formData.get("status")
    }

    try {
      const response = await fetch(`/api/admin/appointments/${editingAppointment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAppointment),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Randevu güncellenemedi")
      }
      
      await fetchAppointments()
      setIsModalOpen(false)
      setError("")
    } catch (error) {
      console.error("Hata:", error)
      setError(error.message)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR')
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tüm Randevular</h2>
          
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hizmet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(appointments) && appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.user?.name || ""}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.user?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.service?.name || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {appointment.status === "APPROVED"
                          ? "Onaylandı"
                          : appointment.status === "PENDING"
                          ? "Beklemede"
                          : "İptal Edildi"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-primary hover:text-primary/80 mr-3"
                      >
                        Düzenle
                      </button>
                      {appointment.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          İptal Et
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {Array.isArray(appointments) && appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Henüz randevu bulunmuyor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Randevu Düzenle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Müşteri
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50"
                  value={editingAppointment?.user?.name || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hizmet
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50"
                  value={editingAppointment?.service?.name || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tarih
                </label>
                <input
                  type="date"
                  name="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={editingAppointment ? new Date(editingAppointment.date).toISOString().split('T')[0] : ""}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Saat
                </label>
                <input
                  type="time"
                  name="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={editingAppointment ? formatTime(editingAppointment.date) : ""}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Durum
                </label>
                <select
                  name="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={editingAppointment?.status || "PENDING"}
                  required
                >
                  <option value="PENDING">Beklemede</option>
                  <option value="APPROVED">Onaylandı</option>
                  <option value="CANCELLED">İptal Edildi</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
} 