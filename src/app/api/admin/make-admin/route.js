import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma.js"

export async function POST(req) {
  try {
    const { email } = await req.json()

    // Admin rolünü bul
    let adminRole = await prisma.role.findUnique({
      where: { name: "ADMIN" }
    })

    // Admin rolü yoksa oluştur
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: "ADMIN" }
      })
    }

    // Kullanıcıyı güncelle
    const user = await prisma.user.update({
      where: { email },
      data: { roleId: adminRole.id }
    })

    return NextResponse.json({
      message: "Kullanıcı başarıyla admin yapıldı",
      user
    })
  } catch (error) {
    console.error("Admin yapma hatası:", error)
    return NextResponse.json(
      { message: "Kullanıcı admin yapılırken bir hata oluştu" },
      { status: 500 }
    )
  }
} 