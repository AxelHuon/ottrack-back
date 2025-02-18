import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour générer une date aléatoire dans les 5 derniers mois
function getRandomDateInLastFiveMonths(): Date {
  const now = new Date();
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(now.getMonth() - 4);

  const randomTime =
    fiveMonthsAgo.getTime() +
    Math.random() * (now.getTime() - fiveMonthsAgo.getTime());
  return new Date(randomTime);
}

// Liste des types de boissons
const drinkTypes = [
  'Bière',
  'Vin',
  'Cocktail',
  'Whisky',
  'Vodka',
  'Rhum',
  'Tequila',
  'Cidre',
];

async function main() {
  console.log('Seeding database...');

  /* Clean BDD */
  await prisma.drink.deleteMany({});
  await prisma.drinkType.deleteMany({});
  await prisma.user.deleteMany({});

  /* Seed les types de boissons */
  const drinkTypeRecords = await Promise.all(
    drinkTypes.map(async (name) => {
      return prisma.drinkType.create({
        data: {
          name,
          slug: name,
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
        create: Array.from({ length: 20 }).map(() => {
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
        create: Array.from({ length: 20 }).map(() => {
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
  .finally(async () => {
    await prisma.$disconnect();
  });
