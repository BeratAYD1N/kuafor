"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          currentPassword: formData.get("currentPassword"),
          newPassword: formData.get("newPassword")
        })
      })

      if (response.ok) {
        setSuccess("Profil başarıyla güncellendi")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.message || "Profil güncellenirken bir hata oluştu")
      }
    } catch (error) {
      setError("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="text-center">Yükleniyor...</div>
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Profil</h1>

      <div className="mx-auto max-w-[350px] rounded-lg border p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Ad Soyad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={session.user.name}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={session.user.email}
              className="mt-1 block w-full rounded-md border bg-gray-50 px-3 py-2"
              disabled
            />
          </div>

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium">
              Mevcut Şifre
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">
              Yeni Şifre
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Güncelleniyor..." : "Güncelle"}
          </button>
        </form>
      </div>
    </div>
  )
} 