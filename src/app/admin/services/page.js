"use client"

import { useState, useEffect } from "react"

export default function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services")
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Hizmetler yüklenemedi")
      }
      const data = await response.json()
      setServices(data)
      setError("")
    } catch (error) {
      console.error("Hata:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditService = (service) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleAddService = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  const handleDeleteService = async (serviceId) => {
    if (confirm("Bu hizmeti silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/admin/services?id=${serviceId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Hizmet silinemedi")
        }
        await fetchServices()
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
    const serviceData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      duration: parseInt(formData.get("duration"))
    }

    if (editingService) {
      serviceData.id = editingService.id
    }

    try {
      const response = await fetch("/api/admin/services", {
        method: editingService ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || (editingService ? "Hizmet güncellenemedi" : "Hizmet eklenemedi"))
      }
      
      await fetchServices()
      setIsModalOpen(false)
      setError("")
    } catch (error) {
      console.error("Hata:", error)
      setError(error.message)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Hizmet Yönetimi</h2>
            <button
              onClick={handleAddService}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Yeni Hizmet Ekle
            </button>
          </div>

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
                    Hizmet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Süre (dk)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(services) && services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.name || ""}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.description || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.price ? `${service.price} ₺` : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.duration || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-primary hover:text-primary/80 mr-3"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingService ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hizmet Adı
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={editingService?.name || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={editingService?.description || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={editingService?.price || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Süre (dakika)
                </label>
                <input
                  type="number"
                  name="duration"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue={editingService?.duration || ""}
                />
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
                  {editingService ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
} 