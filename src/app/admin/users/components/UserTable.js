"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import EditUserDialog from "./EditUserDialog"

export default function UserTable({ users, currentUserEmail }) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [error, setError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingUserId, setUpdatingUserId] = useState(null)

  const handleEditUser = (user) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleChangeRole = async (userId, newRole) => {
    if (!userId) {
      setError("Geçersiz kullanıcı ID'si")
      return
    }

    try {
      setError("")
      setIsUpdating(true)
      setUpdatingUserId(userId)

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.message || "Kullanıcı rolü değiştirilemedi")
        return
      }
      
      router.refresh()
    } catch (error) {
      console.error("Hata:", error)
      setError("Rol değiştirme işlemi sırasında bir hata oluştu")
    } finally {
      setIsUpdating(false)
      setUpdatingUserId(null)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
            aria-label="Hatayı kapat"
          >
            ✕
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(users) && users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || "İsimsiz Kullanıcı"}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm disabled:opacity-50 disabled:bg-gray-100"
                    disabled={isUpdating || user.email === currentUserEmail || updatingUserId === user.id}
                  >
                    <option value="USER">Kullanıcı</option>
                    <option value="ADMIN">Yönetici</option>
                  </select>
                  {updatingUserId === user.id && (
                    <div className="mt-1 text-xs text-gray-500">
                      Güncelleniyor...
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-primary hover:text-primary/80 disabled:opacity-50"
                    disabled={isUpdating || updatingUserId === user.id}
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
            {Array.isArray(users) && users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  Henüz kullanıcı bulunmuyor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditUserDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSuccess={() => {
          setIsModalOpen(false)
          router.refresh()
        }}
      />
    </>
  )
} 