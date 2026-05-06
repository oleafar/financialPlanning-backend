import { prisma } from "../../../infrastructure/database/prisma.js";
import { TransferRepository } from "../../../infrastructure/repositories/transfer-repository.js";
import { WalletRepository } from "../../../infrastructure/repositories/wallet-repository.js";
import { assertPositiveAmount } from "../../../domain/services/financial-rules.js";
import { AppError, ensureResource } from "../../../shared/errors.js";

const transferRepository = new TransferRepository();
const walletRepository = new WalletRepository();

export async function createTransfer(userId, data) {
  assertPositiveAmount(data.amount);

  if (data.fromWalletId === data.toWalletId) {
    throw new AppError("Transfer wallets must be different", 400);
  }

  return prisma.$transaction(async (tx) => {
    const [fromWallet, toWallet] = await Promise.all([
      walletRepository.findByIdAndUserId(data.fromWalletId, userId, tx),
      walletRepository.findByIdAndUserId(data.toWalletId, userId, tx),
    ]);

    ensureResource(fromWallet, "Source wallet not found");
    ensureResource(toWallet, "Destination wallet not found");

    await walletRepository.updateBalance(fromWallet.id, Number(data.amount) * -1, tx);
    await walletRepository.updateBalance(toWallet.id, Number(data.amount), tx);

    return transferRepository.create(
      {
        ...data,
        amount: Number(data.amount),
        date: new Date(data.date),
        userId,
      },
      tx,
    );
  });
}
