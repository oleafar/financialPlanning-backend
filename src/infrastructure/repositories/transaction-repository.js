import { prisma } from "../database/prisma.js";

export class TransactionRepository {
  create(data, db = prisma) {
    return db.transaction.create({
      data,
      include: { category: true, wallet: true },
    });
  }

  findByIdAndUserId(id, userId, db = prisma) {
    return db.transaction.findFirst({
      where: { id, userId },
      include: { category: true, wallet: true },
    });
  }

  async findManyByUserId(userId, filters = {}, db = prisma) {
    const where = {
      userId,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.startDate || filters.endDate
        ? {
            date: {
              ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
              ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
            },
          }
        : {}),
    };

    return db.transaction.findMany({
      where,
      include: { category: true, wallet: true },
      orderBy: { date: filters.order ?? "desc" },
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
    });
  }

  update(id, data, db = prisma) {
    return db.transaction.update({
      where: { id },
      data,
      include: { category: true, wallet: true },
    });
  }

  delete(id, db = prisma) {
    return db.transaction.delete({
      where: { id },
      include: { category: true, wallet: true },
    });
  }
}
