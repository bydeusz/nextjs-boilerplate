import { PrismaClient } from '@prisma/client'

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding users...')
  
  // Delete existing records
  await prisma.user.deleteMany({})

  const users = [
    { name: 'John Doe', email: 'john.doe@example.com' },
    { name: 'Jane Smith', email: 'jane.smith@example.com' },
    { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { name: 'Bob Wilson', email: 'bob.wilson@example.com' },
    { name: 'Charlie Brown', email: 'charlie.brown@example.com' },
    { name: 'Diana Prince', email: 'diana.prince@example.com' },
    { name: 'Edward Stone', email: 'edward.stone@example.com' },
    { name: 'Fiona Green', email: 'fiona.green@example.com' },
    { name: 'George Miller', email: 'george.miller@example.com' },
    { name: 'Helen Davis', email: 'helen.davis@example.com' },
  ]

  const createdUsers = await Promise.all(
    users.map((user) => 
      prisma.user.create({
        data: user,
      })
    )
  )

  console.log(`✅ Created ${createdUsers.length} users`)
  return createdUsers
} 