import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "../../../lib/prisma"
import { authOptions } from "../../../lib/auth"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmalısınız" },
        { status: 401 }
      )
    }

    const { serviceId, date } = await req.json()

    // Gerekli alanları kontrol et
    if (!serviceId || !date) {
      return NextResponse.json(
        { message: "Lütfen bir hizmet ve tarih seçin" },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Hizmetin var olduğunu kontrol et
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { message: "Seçilen hizmet bulunamadı" },
        { status: 404 }
      )
    }

    // Tarih kontrolü
    const appointmentDate = new Date(date)
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { message: "Geçersiz tarih formatı" },
        { status: 400 }
      )
    }

    // Geçmiş tarih kontrolü
    if (appointmentDate < new Date()) {
      return NextResponse.json(
        { message: "Geçmiş bir tarih için randevu oluşturamazsınız" },
        { status: 400 }
      )
    }

    // Çakışan randevu kontrolü
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        status: "PENDING",
        OR: [
          { status: "APPROVED" }
        ]
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { message: "Seçilen tarih ve saatte başka bir randevu bulunmaktadır" },
        { status: 400 }
      )
    }

    // Randevuyu oluştur
    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        serviceId: serviceId,
        date: appointmentDate,
        status: "PENDING"
      },
      include: {
        service: true,
        user: true
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Randevu oluşturma hatası:", error)
    return NextResponse.json(
      { message: "Randevu oluşturulurken bir hata oluştu. Lütfen tüm alanları kontrol edip tekrar deneyin." },
      { status: 500 }
    )
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmalısınız" },
        { status: 401 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: user.id
      },
      include: {
        service: true,
        user: true
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Randevuları getirme hatası:", error)
    return NextResponse.json(
      { message: "Randevular getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 