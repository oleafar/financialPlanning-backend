import { prisma } from "../database/prisma.js";

export class WalletRepository {
  create(data, db = prisma) {
    return db.wallet.create({ data });
  }

  findManyByUserId(userId, db = prisma) {
    return db.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  findByIdAndUserId(id, userId, db = prisma) {
    return db.wallet.findFirst({ where: { id, userId } });
  }

  update(id, data, db = prisma) {
    return db.wallet.update({
      where: { id },
      data,
    });
  }

  updateBalance(id, amount, db = prisma) {
    return db.wallet.update({
      where: { id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  delete(id, db = prisma) {
    return db.wallet.delete({
      where: { id },
    });
  }
}
