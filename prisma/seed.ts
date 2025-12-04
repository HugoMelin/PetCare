import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

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
  const Oslo = await prisma.dog.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Oslo',
      breed: 'Golden Retriever',
      birthdate: new Date('2020-01-01'),
      weightEntries: {
        create: [
          { date: new Date('2024-08-14'), weight: 26.8, comment: 'Pesée chez le vétérinaire' },
          { date: new Date('2025-02-14'), weight: 27, comment: 'Dernière pesée chez le vétérinaire' },
        ],
      },
      dewormingSchedules: {
        create: [
          { lastDoseDate: new Date('2025-09-30'), medication: 'Bravecto', frequencyDays: 90, nextDoseDate: new Date('2025-12-29') },
        ],
      },
    },
  })
  console.log('Created dog:', Oslo)
  
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })