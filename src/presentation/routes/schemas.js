import { z } from "zod";

const walletTypes = ["bank", "cash", "digital", "other"];
const transactionTypes = ["income", "expense"];

const idParam = z.object({
  id: z.string().min(1),
});

const dateString = z.string().datetime().or(z.string().date());

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const walletCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(walletTypes),
    balance: z.number().min(0).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const walletUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    type: z.enum(walletTypes).optional(),
    balance: z.number().min(0).optional(),
  }),
  params: idParam,
  query: z.object({}).default({}),
});

export const categoryCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(transactionTypes),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const categoryUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    type: z.enum(transactionTypes).optional(),
  }),
  params: idParam,
  query: z.object({}).default({}),
});

export const transactionCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    amount: z.number().positive(),
    type: z.enum(transactionTypes),
    date: dateString,
    categoryId: z.string().min(1),
    walletId: z.string().min(1),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const transactionUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(transactionTypes).optional(),
    date: dateString.optional(),
    categoryId: z.string().min(1).optional(),
    walletId: z.string().min(1).optional(),
  }),
  params: idParam,
  query: z.object({}).default({}),
});

export const transactionListSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    type: z.enum(transactionTypes).optional(),
    categoryId: z.string().min(1).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export const transferCreateSchema = z.object({
  body: z.object({
    fromWalletId: z.string().min(1),
    toWalletId: z.string().min(1),
    amount: z.number().positive(),
    date: dateString,
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const reportQuerySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    period: z.enum(["day", "month"]).optional(),
  }),
});

export const idOnlySchema = z.object({
  body: z.object({}).default({}),
  params: idParam,
  query: z.object({}).default({}),
});
