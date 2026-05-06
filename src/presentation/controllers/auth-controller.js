import { loginUser, registerUser } from "../../application/use-cases/auth/auth-use-cases.js";
import { sendSuccess } from "../../shared/response.js";

export async function register(req, res) {
  const result = await registerUser(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
}

export async function login(req, res) {
  const result = await loginUser(req.body);
  return sendSuccess(res, {
    message: "Login successful",
    data: result,
  });
}
