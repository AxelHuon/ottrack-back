import { PrismaClient } from '@prisma/client';
import { hashText } from '../src/utils/crypto';

const prisma = new PrismaClient();

function getRandomDateInLastFiveMonths(): Date {
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025
  const endDate = new Date(2025, 11, 31); // Dec 31, 2025

  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime);
}

// Liste des types de boissons
const drinkTypes = [
  { name: 'Bière', slug: 'biere' },
  { name: 'Vin', slug: 'vin' },
  { name: 'Cocktail', slug: 'cocktail' },
  { name: 'Whisky', slug: 'whisky' },
  { name: 'Vodka', slug: 'vodka' },
  { name: 'Rhum', slug: 'rhum' },
  { name: 'Tequila', slug: 'tequila' },
  { name: 'Cidre', slug: 'cidre' },
];

async function main() {
  console.log('Seeding database...');

  /* Clean BDD */
  await prisma.drink.deleteMany({});
  await prisma.drinkType.deleteMany({});
  await prisma.user.deleteMany({});

  /* Seed les types de boissons */
  const drinkTypeRecords = await Promise.all(
    drinkTypes.map(async (drink) => {
      return prisma.drinkType.create({
        data: {
          name: drink.name,
          slug: drink.slug,
        },
      });
    }),
  );

  const defaultDrinkType = await prisma.drinkType.create({
    data: { name: 'Autre', slug: 'autre' },
  });

  console.log('Drink types added:', drinkTypeRecords);

  /* Création des utilisateurs */
  const user1 = await prisma.user.create({
    data: {
      email: 'axelhuonpro@gmail.com',
      firstName: 'Axel',
      lastName: 'Huon',
      password: null,
      profilePicture: null,
      drinks: {
        create: Array.from({ length: 100 }).map(() => {
          const randomDrinkType =
            drinkTypeRecords[
              Math.floor(Math.random() * drinkTypeRecords.length)
            ];

          return {
            drinkType: { connect: { id: randomDrinkType.id } },
            litersConsumed: parseFloat((Math.random() * 0.7 + 0.2).toFixed(2)),
            drinkDate: getRandomDateInLastFiveMonths(),
          };
        }),
      },
    },
  });

  /* Création des utilisateurs */
  const user3 = await prisma.user.create({
    data: {
      email: 'root@root.fr',
      firstName: 'Merwan',
      lastName: 'Lakaad',
      password: await hashText('root'),
      profilePicture: null,
      drinks: {
        create: Array.from({ length: 100 }).map(() => {
          const randomDrinkType =
            drinkTypeRecords[
              Math.floor(Math.random() * drinkTypeRecords.length)
            ];

          return {
            drinkType: { connect: { id: randomDrinkType.id } }, // Associer la relation
            litersConsumed: parseFloat((Math.random() * 0.7 + 0.2).toFixed(2)),
            drinkDate: getRandomDateInLastFiveMonths(),
          };
        }),
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: null,
      profilePicture: null,
      drinks: {
        create: Array.from({ length: 100 }).map(() => {
          const randomDrinkType =
            drinkTypeRecords[
              Math.floor(Math.random() * drinkTypeRecords.length)
            ];

          return {
            drinkType: { connect: { id: randomDrinkType.id } }, // Associer la relation
            litersConsumed: parseFloat((Math.random() * 0.7 + 0.2).toFixed(2)),
            drinkDate: getRandomDateInLastFiveMonths(),
          };
        }),
      },
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
