import { PrismaClient } from '@prisma/client'
import { seeders } from './seeders'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Run seeders in sequence
    await seeders.users(prisma)
    // Add more seeders here as needed
    // await seeders.posts(prisma)
    // await seeders.comments(prisma)
    
    console.log('✅ Database seeding completed')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
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