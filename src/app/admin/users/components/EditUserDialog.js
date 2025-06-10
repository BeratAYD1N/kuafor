"use client"

import { useState } from "react"

export default function EditUserDialog({ isOpen, onClose, user, onSuccess }) {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError("")
      setIsSubmitting(true)
      const formData = new FormData(e.target)
      
      const updatedUser = {
        id: user.id,
        name: formData.get("name")?.trim(),
        email: formData.get("email")?.trim()
      }

      // Validasyonlar
      if (!updatedUser.name) {
        throw new Error("İsim alanı boş bırakılamaz")
      }
      if (!updatedUser.email) {
        throw new Error("E-posta alanı boş bırakılamaz")
      }

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Kullanıcı güncellenemedi")
      }
      
      onSuccess()
    } catch (error) {
      console.error("Hata:", error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Kullanıcı Düzenle</h3>
        
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              defaultValue={user?.name || ""}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              defaultValue={user?.email || ""}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 