import { WalletRepository } from "../../../infrastructure/repositories/wallet-repository.js";
import { ensureResource } from "../../../shared/errors.js";

const walletRepository = new WalletRepository();

export function createWallet(userId, data) {
  return walletRepository.create({
    ...data,
    userId,
    balance: Number(data.balance ?? 0),
  });
}

export function listWallets(userId) {
  return walletRepository.findManyByUserId(userId);
}

export async function updateWallet(userId, walletId, data) {
  const wallet = await walletRepository.findByIdAndUserId(walletId, userId);
  ensureResource(wallet, "Wallet not found");

  return walletRepository.update(walletId, {
    ...data,
    ...(data.balance !== undefined ? { balance: Number(data.balance) } : {}),
  });
}

export async function deleteWallet(userId, walletId) {
  const wallet = await walletRepository.findByIdAndUserId(walletId, userId);
  ensureResource(wallet, "Wallet not found");

  return walletRepository.delete(walletId);
}
