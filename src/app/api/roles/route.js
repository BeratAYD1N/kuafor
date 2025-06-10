import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma.js"

export async function POST(req) {
  try {
    // USER ve ADMIN rollerini oluştur
    const userRole = await prisma.role.create({
      data: { name: "USER" }
    })

    const adminRole = await prisma.role.create({
      data: { name: "ADMIN" }
    })

    return NextResponse.json({
      message: "Roller başarıyla oluşturuldu",
      roles: [userRole, adminRole]
    })
  } catch (error) {
    console.error("Rol oluşturma hatası:", error)
    return NextResponse.json(
      { message: "Roller oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
} 