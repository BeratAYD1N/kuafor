"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session) {
      fetchNotifications()
    }
  }, [session, status, router])

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      setError("Bildirimler yüklenirken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleMarkAsRead(id) {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true })
      })

      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      setError("Bildirim güncellenirken bir hata oluştu")
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
      <h1 className="mb-6 text-2xl font-bold">Bildirimler</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Bildirimler yükleniyor...</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-lg border p-4 text-center text-gray-500">
          Henüz bildiriminiz bulunmuyor.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">{notification.content}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    Okundu Olarak İşaretle
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 