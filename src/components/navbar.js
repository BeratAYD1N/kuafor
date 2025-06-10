"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: false })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error("Çıkış yapılırken bir hata oluştu:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Elit Erkek Kuaförü
          </Link>

          <div className="flex items-center gap-4">
            {status === "loading" || isLoading ? (
              <span className="text-gray-600">Yükleniyor...</span>
            ) : session ? (
              <>
                <span className="text-gray-600">
                  Merhaba, {session.user.name || session.user.email}
                </span>
                <Link
                  href="/appointments"
                  className="text-gray-600 hover:text-primary"
                >
                  Randevularım
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin/appointments"
                    className="text-gray-600 hover:text-primary"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-primary disabled:opacity-50"
                >
                  {isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 