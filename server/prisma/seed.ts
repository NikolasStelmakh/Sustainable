import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const usersList = [
    {
      name: 'Nikolas Stelmakh',
    },
    {
      name: 'Donatus Boder',
    },
    {
      name: 'Johny Cash',
    },
    {
      name: '50 Cent',
    },
    {
      name: 'Prometheus',
    },
  ];

  const isDataAlreadyFilled = await prisma.user.findFirst({
    where: {
      name: usersList[0].name,
    },
  });

  if (isDataAlreadyFilled) {
    console.log('Data is already filled.');
    return;
  }

  await prisma.user.createMany({
    data: usersList,
  });

  const intervals = await prisma.recurringInterval.findMany();
  const categories = await prisma.categorie.findMany();
  const users = await prisma.user.findMany();

  return await prisma.task.createMany({
    data: [
      {
        name: 'Task #1',
        recurring_interval_id: intervals[0].id,
        start_date: new Date(2022, 6, 10),
        categorie_id: categories[0].id,
        user_id: users[0].id,
      },
      {
        name: 'Task #2',
        recurring_interval_id: intervals[1].id,
        start_date: new Date(2023, 6, 10),
        categorie_id: categories[1].id,
        user_id: users[1].id,
      },
      {
        name: 'Task #3',
        recurring_interval_id: intervals[2].id,
        start_date: new Date(2022, 6, 10),
        categorie_id: categories[2].id,
        user_id: users[2].id,
      },
      {
        name: 'Task #4',
        recurring_interval_id: intervals[3].id,
        categorie_id: categories[2].id,
        user_id: users[3].id,
      },
      {
        name: 'Task #5',
        categorie_id: categories[2].id,
        user_id: users[0].id,
      },
      {
        name: 'Task #6',
        categorie_id: categories[2].id,
        user_id: users[0].id,
      },
    ],
  });
}
main()
  .then(async () => {
    console.log('successfully seeded');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
