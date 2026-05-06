import { prisma } from "../database/prisma.js";

export class TransferRepository {
  create(data, db = prisma) {
    return db.transfer.create({
      data,
      include: { fromWallet: true, toWallet: true },
    });
  }
}
