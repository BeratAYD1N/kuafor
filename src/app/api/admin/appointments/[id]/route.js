import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "../../../../../lib/prisma.js"
import { authOptions } from "../../../../../lib/auth.js"

// Randevu durumunu güncelle
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz yok." },
        { status: 403 }
      )
    }

    const { status } = await req.json()
    const { id } = params

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        service: true
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json(
      { message: "Randevu güncellenirken bir hata oluştu." },
      { status: 500 }
    )
  }
} 