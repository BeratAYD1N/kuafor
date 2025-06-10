import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import Link from "next/link"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        {session ? (
          <>
            <h1 className="mb-6 text-4xl font-bold">
              Hoş Geldiniz, {session.user.name || session.user.email}!
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Randevu almak veya mevcut randevularınızı görüntülemek için aşağıdaki seçenekleri kullanabilirsiniz.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
                <h2 className="text-2xl font-semibold mb-4">Randevu Al</h2>
                <p className="text-gray-600 mb-4">
                  Yeni bir randevu oluşturmak için tıklayın.
                </p>
                <Link
                  href="/book-appointment"
                  className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
                >
                  Randevu Al
                </Link>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
                <h2 className="text-2xl font-semibold mb-4">Randevularım</h2>
                <p className="text-gray-600 mb-4">
                  Mevcut randevularınızı görüntüleyin ve yönetin.
                </p>
                <Link
                  href="/appointments"
                  className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
                >
                  Randevuları Görüntüle
                </Link>
              </div>
            </div>

            {session.user.role === "ADMIN" && (
              <div className="mt-8">
                <div className="p-6 rounded-lg border border-primary bg-primary/5">
                  <h2 className="text-2xl font-semibold mb-4">Admin Paneli</h2>
                  <p className="text-gray-600 mb-6">
                    Sistem yönetimi ve raporlama için admin paneline erişebilirsiniz.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      href="/admin/appointments"
                      className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
                    >
                      Tüm Randevular
                    </Link>
                    <Link
                      href="/admin/users"
                      className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
                    >
                      Kullanıcı Yönetimi
                    </Link>
                    <Link
                      href="/admin/services"
                      className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
                    >
                      Hizmet Yönetimi
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="mb-6 text-4xl font-bold">
              Kuaför Randevu Sistemine Hoş Geldiniz
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Profesyonel kuaförlerimizden randevu almak için hemen kayıt olun veya
              giriş yapın.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
              >
                Kayıt Ol
              </Link>
              <Link
                href="/login"
                className="rounded-md border px-6 py-3 hover:bg-gray-50"
              >
                Giriş Yap
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
