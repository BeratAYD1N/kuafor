import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "../../../../lib/prisma.js"

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    // Zorunlu alanları kontrol et
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tüm alanları doldurun." },
        { status: 400 }
      )
    }

    // Email adresi kullanılıyor mu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email adresi zaten kullanılıyor." },
        { status: 400 }
      )
    }

    // Şifreyi hashle
    const hashedPassword = await hash(password, 10)

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER" // Artık role string olarak saklanıyor
      },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Kayıt hatası:", error)
    return NextResponse.json(
      { message: "Kayıt olurken bir hata oluştu." },
      { status: 500 }
    )
  }
} 