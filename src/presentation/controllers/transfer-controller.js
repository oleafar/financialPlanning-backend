import { createTransfer } from "../../application/use-cases/transfers/transfer-use-cases.js";
import { sendSuccess } from "../../shared/response.js";

export async function create(req, res) {
  const transfer = await createTransfer(req.user.id, req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Transfer created successfully",
    data: transfer,
  });
}
