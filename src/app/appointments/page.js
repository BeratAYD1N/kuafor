"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AppointmentsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [appointments, setAppointments] = useState([])
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session) {
      fetchData()
    }
  }, [session, status, router])

  async function fetchData() {
    setIsLoading(true)
    try {
      const [appointmentsRes, servicesRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/services")
      ])

      if (appointmentsRes.ok && servicesRes.ok) {
        const [appointmentsData, servicesData] = await Promise.all([
          appointmentsRes.json(),
          servicesRes.json()
        ])

        setAppointments(appointmentsData)
        setServices(servicesData)
      }
    } catch (error) {
      setError("Veriler yüklenirken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!selectedService || !selectedDate) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          date: selectedDate
        })
      })

      if (response.ok) {
        fetchData()
        setSelectedService("")
        setSelectedDate("")
      } else {
        const data = await response.json()
        setError(data.message || "Randevu oluşturulurken bir hata oluştu")
      }
    } catch (error) {
      setError("Bir hata oluştu")
    }
  }

  async function handleCancel(id) {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        fetchData()
      } else {
        setError("Randevu iptal edilirken bir hata oluştu")
      }
    } catch (error) {
      setError("Bir hata oluştu")
    }
  }

  if (status === "loading") {
    return <div className="text-center">Yükleniyor...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Randevularım</h1>

      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">Yeni Randevu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="service" className="block text-sm font-medium">
              Hizmet
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              required
            >
              <option value="">Hizmet Seçin</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.price}₺
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Tarih ve Saat
            </label>
            <input
              id="date"
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Randevu Oluşturuluyor..." : "Randevu Oluştur"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Hizmet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  {appointment.service.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(appointment.date).toLocaleString("tr-TR")}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      appointment.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status === "APPROVED"
                      ? "Onaylandı"
                      : appointment.status === "REJECTED"
                      ? "Reddedildi"
                      : "Bekliyor"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {appointment.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      İptal Et
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 