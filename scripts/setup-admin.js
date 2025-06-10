import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function setupAdmin() {
  try {
    // Rolleri oluştur
    const adminRole = await prisma.role.create({
      data: {
        name: 'ADMIN'
      }
    })

    const userRole = await prisma.role.create({
      data: {
        name: 'USER'
      }
    })

    // Admin kullanıcısını oluştur
    const hashedPassword = await hash('berat123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'berataydn619@gmail.com',
        name: 'Berat',
        password: hashedPassword,
        roleId: adminRole.id
      }
    })

    console.log('Admin rolü oluşturuldu:', adminRole)
    console.log('Kullanıcı rolü oluşturuldu:', userRole)
    console.log('Admin kullanıcısı oluşturuldu:', admin)
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupAdmin() 