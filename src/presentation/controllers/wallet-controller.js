import {
  createWallet,
  deleteWallet,
  listWallets,
  updateWallet,
} from "../../application/use-cases/wallets/wallet-use-cases.js";
import { sendSuccess } from "../../shared/response.js";

export async function create(req, res) {
  const wallet = await createWallet(req.user.id, req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Wallet created successfully",
    data: wallet,
  });
}

export async function list(req, res) {
  const wallets = await listWallets(req.user.id);
  return sendSuccess(res, { data: wallets });
}

export async function update(req, res) {
  const wallet = await updateWallet(req.user.id, req.params.id, req.body);
  return sendSuccess(res, {
    message: "Wallet updated successfully",
    data: wallet,
  });
}

export async function remove(req, res) {
  await deleteWallet(req.user.id, req.params.id);
  return sendSuccess(res, {
    message: "Wallet deleted successfully",
  });
}
