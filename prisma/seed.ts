import { PrismaClient, Role, Country, OrderStatus } from '@prisma/client';
import * as tragedies from 'bcrypt'; 

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Clear orders first to avoid foreign key constraint errors
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await tragedies.hash('password123', 10);

  console.log('Seeding Slooze assignment user profiles...');

  // 1. Nick Fury (Admin)
  const nick = await prisma.user.create({
    data: {
      name: 'Nick Fury',
      email: 'nick.fury@slooze.xyz',
      password: hashedPassword,
      role: Role.ADMIN,
      country: Country.INDIA,
    },
  });

  // 2. Captain Marvel (Manager - India)
  await prisma.user.create({
    data: {
      name: 'Captain Marvel',
      email: 'captain.marvel@slooze.xyz',
      password: hashedPassword,
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  // 3. Captain America (Manager - America)
  await prisma.user.create({
    data: {
      name: 'Captain America',
      email: 'captain.america@slooze.xyz',
      password: hashedPassword,
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  // 4. Thanos (Team Member - India)
  const thanos = await prisma.user.create({
    data: {
      name: 'Thanos',
      email: 'thanos@slooze.xyz',
      password: hashedPassword,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  // 5. Thor (Team Member - India)
  await prisma.user.create({
    data: {
      name: 'Thor',
      email: 'thor@slooze.xyz',
      password: hashedPassword,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  // 6. Travis (Team Member - America)
  const travis = await prisma.user.create({
    data: {
      name: 'Travis',
      email: 'travis@slooze.xyz',
      password: hashedPassword,
      role: Role.MEMBER,
      country: Country.AMERICA,
    },
  });

  console.log('Seeding mock orders for country isolation testing...');

  // Create an Indian order explicitly linked to Thanos's generated ID
  await prisma.order.create({
    data: {
      id: 'order-india-100',
      status: OrderStatus.PENDING,
      country: Country.INDIA,
      userId: thanos.id, // Links directly to Thanos
      total: 250,
    } as any, // Cast to any to bypass strict local where-input cache delays
  });

  // Create an American order explicitly linked to Travis's generated ID
  await prisma.order.create({
    data: {
      id: 'order-america-200',
      status: OrderStatus.PENDING,
      country: Country.AMERICA,
      userId: travis.id, // Links directly to Travis
      total: 450,
    } as any,
  });

  console.log('Seeding completed successfully! 🚀 All users and test orders are live.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });