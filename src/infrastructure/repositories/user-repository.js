import { prisma } from "../database/prisma.js";

export class UserRepository {
  findByEmail(email, db = prisma) {
    return db.user.findUnique({ where: { email } });
  }

  findById(id, db = prisma) {
    return db.user.findUnique({ where: { id } });
  }

  create(data, db = prisma) {
    return db.user.create({ data });
  }
}
