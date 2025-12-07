import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { auth } from '../server/utils/auth'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT ?? 3306),
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'user@example.com'
  const password = 'userpassword'
  const name = 'User test'

  let userId: string

  const existing = await prisma.user.findUnique({
    where: { email: email}
  })

  if (!existing) {
    const response = await auth.api.signUpEmail({
      body: { name, email, password, emailVerified: true }
    })

    userId = response.user?.id as string

    console.log('Sign-up response : ', response)
  } else if (existing) {
    userId = existing.id
  }

  console.log('User ID : ', userId)

  const existingDog = await prisma.dog.findFirst();
  if (!existingDog) {
    const dog = await prisma.dog.create({
      data: {
        name: 'Oslo',
        breed: 'Berger Australien',
        birthdate: new Date('2018-11-17'),
        createdByUserId: userId,
        owner: {
          connect: {
            id: userId,
          },
        },        
        weightEntries: {
          create: [
            { date: new Date('2024-08-14'), weight: 26.8, comment: 'Pesée chez le vétérinaire' },
            { date: new Date('2025-02-14'), weight: 27, comment: 'Dernière pesée chez le vétérinaire' },
            { date: new Date('2025-12-05'), weight: 31.25, comment: 'Première pesée de suivis à la maison' },
          ],
        },
        dewormingSchedules: {
          create: [
            { lastDoseDate: new Date('2025-09-30'), medication: 'Bravecto', frequencyDays: 90, nextDoseDate: new Date('2025-12-29') },
          ],
        },
      }
    })

    console.log('Created dog:', dog)
  }
  return;
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })