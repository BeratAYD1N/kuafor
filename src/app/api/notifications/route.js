import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "../../../lib/prisma.js"
import { authOptions } from "../../../lib/auth.js"

// Bildirimleri getir
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmalısınız." },
        { status: 401 }
      )
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json(
      { message: "Bildirimler yüklenirken bir hata oluştu." },
      { status: 500 }
    )
  }
}

// Yeni bildirim oluştur
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    const { userId, content, type = "SYSTEM" } = await req.json()

    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmalısınız." },
        { status: 401 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        content,
        type,
        isRead: false
      }
    })

    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json(
      { message: "Bildirim oluşturulurken bir hata oluştu." },
      { status: 500 }
    )
  }
} 