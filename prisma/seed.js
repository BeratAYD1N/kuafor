const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  try {
    // Admin kullanıcısı oluştur
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    })

    // Test kullanıcısı oluştur
    const userPassword = await bcrypt.hash("user123", 10)
    const user = await prisma.user.create({
      data: {
        name: 'Test Kullanıcı',
        email: 'user@example.com',
        password: userPassword,
        role: 'USER'
      }
    })

    // Örnek hizmetleri oluştur
    const services = [
      {
        name: 'Saç Kesimi',
        description: 'Profesyonel saç kesimi hizmeti',
        price: 150.00,
        duration: 30
      },
      {
        name: 'Saç Boyama',
        description: 'Tek renk saç boyama işlemi',
        price: 400.00,
        duration: 120
      },
      {
        name: 'Sakal Kesimi',
        description: 'Profesyonel sakal şekillendirme',
        price: 100.00,
        duration: 20
      },
      {
        name: 'Saç Yıkama',
        description: 'Saç yıkama ve bakım',
        price: 50.00,
        duration: 15
      },
      {
        name: 'Fön',
        description: 'Saç kurutma ve şekillendirme',
        price: 80.00,
        duration: 25
      }
    ]

    for (const service of services) {
      await prisma.service.create({
        data: service
      })
    }

    console.log('Seed işlemi başarılı!')
    console.log('Admin kullanıcısı:', admin.email)
    console.log('Test kullanıcısı:', user.email)
  } catch (error) {
    console.error('Seed hatası:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 