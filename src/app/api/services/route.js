import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Hizmetleri getirme hatası:", error)
    return NextResponse.json(
      { message: "Hizmetler getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 