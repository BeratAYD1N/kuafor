import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "../../../../lib/prisma"
import { authOptions } from "../../../../lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Kullanıcıları getirme hatası:", error)
    return NextResponse.json(
      { message: "Kullanıcılar getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const data = await request.json()
  const newUser = {
    id: users.length + 1,
    ...data,
    status: "active"
  }
  
  users.push(newUser)
  return NextResponse.json(newUser)
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const { id, name, email } = await request.json()

    if (!id || !name || !email) {
      return NextResponse.json(
        { message: "Tüm alanlar doldurulmalıdır" },
        { status: 400 }
      )
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      )
    }

    // Kullanıcının var olduğunu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Email değişiyorsa, yeni email'in başka bir kullanıcıda olup olmadığını kontrol et
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists) {
        return NextResponse.json(
          { message: "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor" },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error)
    return NextResponse.json(
      { message: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bu işlem için yönetici yetkisi gereklidir" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")
    
    if (!userId) {
      return NextResponse.json(
        { message: "Kullanıcı ID'si gereklidir" },
        { status: 400 }
      )
    }

    // Kullanıcının var olduğunu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    try {
      // Kullanıcının durumunu değiştir
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          status: existingUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        }
      })

      return NextResponse.json(updatedUser)
    } catch (prismaError) {
      console.error("Prisma durum değiştirme hatası:", prismaError)
      return NextResponse.json(
        { message: "Kullanıcı durumu değiştirilirken bir hata oluştu" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Kullanıcı durum değiştirme hatası:", error)
    return NextResponse.json(
      { message: "Kullanıcı durumu değiştirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 