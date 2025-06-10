"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("appointments")
  const [appointments, setAppointments] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/")
    }
  }, [session, status, router])

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchData()
    }
  }, [session, activeTab])

  async function fetchData() {
    setIsLoading(true)
    try {
      if (activeTab === "appointments") {
        const response = await fetch("/api/admin/appointments")
        if (response.ok) {
          const data = await response.json()
          setAppointments(data)
        }
      } else {
        const response = await fetch("/api/admin/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      }
    } catch (error) {
      setError("Veriler yüklenirken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAppointmentAction(id, action) {
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      setError("İşlem sırasında bir hata oluştu")
    }
  }

  async function handleUserAction(id, action) {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      setError("İşlem sırasında bir hata oluştu")
    }
  }

  if (status === "loading" || !session) {
    return <div className="text-center">Yükleniyor...</div>
  }

  if (session.user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Admin Paneli</h1>

      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`rounded-lg px-4 py-2 ${
            activeTab === "appointments"
              ? "bg-primary text-primary-foreground"
              : "bg-gray-200"
          }`}
        >
          Randevular
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`rounded-lg px-4 py-2 ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground"
              : "bg-gray-200"
          }`}
        >
          Kullanıcılar
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Veriler yükleniyor...</div>
      ) : activeTab === "appointments" ? (
        <div className="rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Müşteri
                </th>
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
                    {appointment.user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {appointment.service.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(appointment.date).toLocaleString("tr-TR")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {appointment.status}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {appointment.status === "PENDING" && (
                      <div className="space-x-2">
                        <button
                          onClick={() =>
                            handleAppointmentAction(appointment.id, "APPROVED")
                          }
                          className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() =>
                            handleAppointmentAction(appointment.id, "REJECTED")
                          }
                          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                        >
                          Reddet
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4">{user.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">{user.role.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.role.name === "USER" ? (
                      <button
                        onClick={() => handleUserAction(user.id, "PROMOTE")}
                        className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >
                        Admin Yap
                      </button>
                    ) : (
                      session.user.id !== user.id && (
                        <button
                          onClick={() => handleUserAction(user.id, "DEMOTE")}
                          className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                        >
                          Kullanıcı Yap
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 