import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DEFAULT_CATEGORIES } from "../../../shared/constants.js";
import { env } from "../../../shared/env.js";
import { AppError } from "../../../shared/errors.js";
import { prisma } from "../../../infrastructure/database/prisma.js";
import { UserRepository } from "../../../infrastructure/repositories/user-repository.js";

const userRepository = new UserRepository();

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: "1d",
  });
}

export async function registerUser({ name, email, password }) {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await userRepository.create(
      {
        name,
        email,
        password: passwordHash,
      },
      tx,
    );

    await tx.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({
        ...category,
        userId: createdUser.id,
      })),
    });

    return createdUser;
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token: createToken(user),
  };
}

export async function loginUser({ email, password }) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token: createToken(user),
  };
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
