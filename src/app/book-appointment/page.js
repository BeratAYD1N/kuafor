"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function BookAppointmentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Hizmetleri getir
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services")
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || "Hizmetler yüklenemedi")
        }
        const data = await res.json()
        setServices(data)
      } catch (err) {
        console.error("Hizmetler yüklenirken hata:", err)
        setError("Hizmetler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.")
      }
    }

    fetchServices()
  }, [session, router])

  // Örnek müsait saatler - Daha sonra API'den alınacak
  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!selectedService) {
        throw new Error("Lütfen bir hizmet seçin")
      }

      if (!selectedDate) {
        throw new Error("Lütfen bir tarih seçin")
      }

      if (!selectedTime) {
        throw new Error("Lütfen bir saat seçin")
      }

      // Geçmiş tarih kontrolü
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
      if (selectedDateTime < new Date()) {
        throw new Error("Geçmiş bir tarih için randevu oluşturamazsınız")
      }

      // Randevu oluştur
      const appointmentResponse = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          date: selectedDateTime.toISOString()
        })
      })

      if (!appointmentResponse.ok) {
        const data = await appointmentResponse.json()
        throw new Error(data.message || "Randevu oluşturulamadı")
      }

      const appointment = await appointmentResponse.json()

      // Bildirim oluştur
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            content: `${selectedDate} tarihinde saat ${selectedTime} için randevunuz oluşturuldu. Onay bekliyor.`,
            type: "APPOINTMENT"
          })
        })
      } catch (error) {
        console.error("Bildirim oluşturma hatası:", error)
        // Bildirim hatası randevu oluşturmayı etkilemeyecek
      }

      router.push("/appointments")
    } catch (error) {
      setError(error.message)
      console.error("Randevu oluşturma hatası:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Randevu Al</h1>

      <div className="mx-auto max-w-[500px] rounded-lg border p-4">
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
              <option value="">Hizmet seçin</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.duration} dk - {service.price}₺
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Tarih
            </label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium">
              Saat
            </label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              required
            >
              <option value="">Saat seçin</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Randevu Oluşturuluyor..." : "Randevu Al"}
          </button>
        </form>
      </div>
    </div>
  )
} 