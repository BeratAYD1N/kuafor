import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "../../../../lib/prisma.js"
import { authOptions } from "../../../../lib/auth"

// Tüm randevuları getir
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz yok." },
        { status: 403 }
      )
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        service: true
      },
      orderBy: {
        date: "asc"
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Randevular yüklenirken hata:", error)
    return NextResponse.json(
      { message: "Randevular yüklenirken bir hata oluştu." },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const data = await request.json()
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        status: "PENDING"
      },
      include: {
        user: true,
        service: true
      }
    })
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Randevu oluşturma hatası:", error)
    return NextResponse.json({ error: "Randevu oluşturulamadı" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const data = await request.json()
    const appointment = await prisma.appointment.update({
      where: { id: data.id },
      data: data,
      include: {
        user: true,
        service: true
      }
    })
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Randevu güncelleme hatası:", error)
    return NextResponse.json({ error: "Randevu güncellenemedi" }, { status: 404 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    await prisma.appointment.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Randevu silme hatası:", error)
    return NextResponse.json({ error: "Randevu silinemedi" }, { status: 500 })
  }
} 