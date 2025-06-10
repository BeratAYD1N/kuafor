import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "../../../../lib/prisma"
import { authOptions } from "../../../../lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const services = await prisma.service.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Hizmetler yüklenirken hata:", error)
    return NextResponse.json(
      { message: "Hizmetler yüklenirken bir hata oluştu." },
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
    const newService = await prisma.service.create({
      data: {
        ...data,
        status: "ACTIVE"
      }
    })
    
    return NextResponse.json(newService)
  } catch (error) {
    console.error("Hizmet oluşturma hatası:", error)
    return NextResponse.json({ error: "Hizmet oluşturulamadı" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const data = await request.json()
    const updatedService = await prisma.service.update({
      where: { id: data.id },
      data
    })
    
    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Hizmet güncelleme hatası:", error)
    return NextResponse.json({ error: "Hizmet güncellenemedi" }, { status: 404 })
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
    
    await prisma.service.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Hizmet silme hatası:", error)
    return NextResponse.json({ error: "Hizmet silinemedi" }, { status: 500 })
  }
} 