import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/infrastructure/database/prisma.js";

const app = createApp();

async function resetDatabase() {
  await prisma.transfer.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
}

describe("financial planning backend", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("serves swagger documentation", async () => {
    const response = await request(app).get("/docs.json");

    expect(response.statusCode).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.paths["/api/auth/register"]).toBeTruthy();
    expect(response.body.paths["/api/reports/by-period"]).toBeTruthy();
  });

  it("registers, authenticates, creates money flows, and returns reports", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Rafael",
      email: "rafael@example.com",
      password: "secret123",
    });

    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body.data.token).toBeTruthy();

    const token = registerResponse.body.data.token;

    const walletResponse = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "NuBank",
        type: "bank",
        balance: 1000,
      });

    expect(walletResponse.statusCode).toBe(201);

    const categoriesResponse = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(categoriesResponse.statusCode).toBe(200);

    const incomeCategory = categoriesResponse.body.data.find(
      (category) => category.type === "income",
    );
    const expenseCategory = categoriesResponse.body.data.find(
      (category) => category.type === "expense",
    );

    const incomeResponse = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Salary payment",
        amount: 500,
        type: "income",
        date: "2026-05-05T10:00:00.000Z",
        categoryId: incomeCategory.id,
        walletId: walletResponse.body.data.id,
      });

    expect(incomeResponse.statusCode).toBe(201);

    const expenseResponse = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Groceries",
        amount: 200,
        type: "expense",
        date: "2026-05-05T11:00:00.000Z",
        categoryId: expenseCategory.id,
        walletId: walletResponse.body.data.id,
      });

    expect(expenseResponse.statusCode).toBe(201);

    const secondWalletResponse = await request(app)
      .post("/api/wallets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Cash",
        type: "cash",
        balance: 50,
      });

    expect(secondWalletResponse.statusCode).toBe(201);

    const transferResponse = await request(app)
      .post("/api/transfers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fromWalletId: walletResponse.body.data.id,
        toWalletId: secondWalletResponse.body.data.id,
        amount: 100,
        date: "2026-05-05T12:00:00.000Z",
      });

    expect(transferResponse.statusCode).toBe(201);

    const summaryResponse = await request(app)
      .get("/api/reports/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(summaryResponse.statusCode).toBe(200);
    expect(summaryResponse.body.data.income).toBe(500);
    expect(summaryResponse.body.data.expense).toBe(200);
    expect(summaryResponse.body.data.totalBalance).toBe(1350);

    const categoryReportResponse = await request(app)
      .get("/api/reports/by-category")
      .set("Authorization", `Bearer ${token}`);

    expect(categoryReportResponse.statusCode).toBe(200);
    expect(categoryReportResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("rejects protected access without token", async () => {
    const response = await request(app).get("/api/wallets");
    expect(response.statusCode).toBe(401);
  });
});
