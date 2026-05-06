import { prisma } from "../database/prisma.js";

export class CategoryRepository {
  create(data, db = prisma) {
    return db.category.create({ data });
  }

  findManyByUserId(userId, db = prisma) {
    return db.category.findMany({
      where: { userId },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }

  findByIdAndUserId(id, userId, db = prisma) {
    return db.category.findFirst({ where: { id, userId } });
  }

  update(id, data, db = prisma) {
    return db.category.update({
      where: { id },
      data,
    });
  }

  delete(id, db = prisma) {
    return db.category.delete({
      where: { id },
    });
  }
}
