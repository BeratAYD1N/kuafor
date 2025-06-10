import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"
import UserTable from "./components/UserTable"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tüm Kullanıcılar</h2>
        <UserTable users={users} currentUserEmail={session.user.email} />
      </div>
    </div>
  )
} 