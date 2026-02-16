import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL
})

async function main() {
  console.log('Start seeding ...')

  // Create a demo user with some history
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      clerkId: 'user_2N0q1r2s3t4u5v6w7x8y9z0a1b', // Example Clerk ID
      imageUrl: 'https://github.com/shadcn.png',
      totalCredit: 10000,
      History: {
        create: [
          {
            templateSlug: 'blog-title',
            formData: JSON.stringify({ topic: 'AI Content' }),
            aiResponse: '10 Ways AI is Revolutionizing Content Creation',
          },
          {
            templateSlug: 'youtube-description',
            formData: JSON.stringify({ title: 'Next.js Tutorial' }),
            aiResponse: 'Learn how to build full-stack apps with Next.js in this comprehensive tutorial!  #nextjs #react #webdev',
          },
        ],
      },
    },
  })

  console.log(`Created user with id: ${user.id}`)
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })