import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../../lib/auth"
import { prisma } from "../../../../../../lib/prisma"

export async function PATCH(req, context) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const userId = context.params.userId
    if (!userId) {
      return NextResponse.json(
        { message: "Kullanıcı ID'si gerekli" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const newRole = body.role

    // Önce kullanıcıyı bul
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    })

    if (!targetUser) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Kullanıcının kendisini değiştirmesini engelle
    if (session.user.email === targetUser.email) {
      return NextResponse.json(
        { message: "Kendi rolünüzü değiştiremezsiniz" },
        { status: 403 }
      )
    }

    // Rol validasyonu
    if (!newRole || !["USER", "ADMIN"].includes(newRole)) {
      return NextResponse.json(
        { message: "Geçersiz rol" },
        { status: 400 }
      )
    }

    // Aynı role güncellemeyi engelle
    if (targetUser.role === newRole) {
      return NextResponse.json(
        { message: "Kullanıcı zaten bu role sahip" },
        { status: 400 }
      )
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })

      return NextResponse.json(updatedUser)
    } catch (prismaError) {
      console.error("Prisma güncelleme hatası:", prismaError)
      return NextResponse.json(
        { message: "Veritabanı güncelleme hatası" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Rol değiştirme hatası:", error)
    return NextResponse.json(
      { message: "Rol değiştirme işlemi başarısız oldu" },
      { status: 500 }
    )
  }
} 