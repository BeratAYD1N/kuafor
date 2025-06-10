import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma.js"
import { hash } from "bcryptjs"

export async function POST(req) {
  try {
    // Rolleri oluştur
    const adminRole = await prisma.role.create({
      data: {
        name: "ADMIN"
      }
    })

    const userRole = await prisma.role.create({
      data: {
        name: "USER"
      }
    })

    // Admin kullanıcısını oluştur
    const hashedPassword = await hash("berat123", 10)
    const admin = await prisma.user.create({
      data: {
        email: "berataydn619@gmail.com",
        name: "Berat",
        password: hashedPassword,
        roleId: adminRole.id
      }
    })

    return NextResponse.json({
      message: "Sistem başarıyla kuruldu",
      adminRole,
      userRole,
      admin
    })
  } catch (error) {
    console.error("Kurulum hatası:", error)
    return NextResponse.json(
      { message: "Sistem kurulurken bir hata oluştu" },
      { status: 500 }
    )
  }
} 