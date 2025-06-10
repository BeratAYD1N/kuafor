import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function makeAdmin() {
  try {
    // Admin rolünü bul veya oluştur
    let adminRole = await prisma.role.findUnique({
      where: { name: "ADMIN" }
    })

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: "ADMIN" }
      })
    }

    // Kullanıcıyı güncelle
    const user = await prisma.user.update({
      where: { email: "berataydn619@gmail.com" },
      data: { roleId: adminRole.id }
    })

    console.log("Kullanıcı başarıyla admin yapıldı:", user)
  } catch (error) {
    console.error("Hata:", error)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin() 