import bcrypt from "bcryptjs";
import { PrismaClient, TransactionType, WalletType } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Salary", type: TransactionType.income },
  { name: "Freelance", type: TransactionType.income },
  { name: "Food", type: TransactionType.expense },
  { name: "Housing", type: TransactionType.expense },
  { name: "Transport", type: TransactionType.expense },
  { name: "Health", type: TransactionType.expense },
];

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@financial.local" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@financial.local",
      password,
      wallets: {
        create: [
          { name: "Main Bank", type: WalletType.bank, balance: 2500 },
          { name: "Cash", type: WalletType.cash, balance: 300 },
        ],
      },
    },
  });

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_type_userId: {
          name: category.name,
          type: category.type,
          userId: user.id,
        },
      },
      update: {},
      create: {
        ...category,
        userId: user.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
