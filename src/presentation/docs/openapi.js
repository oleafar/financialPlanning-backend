const securityRequirement = [{ bearerAuth: [] }];

function successResponse(description, schema) {
  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

function errorResponse(statusCode, message) {
  return {
    description: message,
    content: {
      "application/json": {
        schema: {
          allOf: [
            { $ref: "#/components/schemas/ErrorResponse" },
            {
              type: "object",
              properties: {
                message: { type: "string", example: message },
              },
            },
          ],
        },
      },
    },
  };
}

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Financial Planning Backend API",
    version: "1.0.0",
    description:
      "API for personal financial management with authentication, wallets, categories, transactions, transfers, and reports.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "Service health and metadata" },
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Wallets", description: "Wallet management" },
    { name: "Categories", description: "Category management" },
    { name: "Transactions", description: "Transaction management" },
    { name: "Transfers", description: "Transfers between wallets" },
    { name: "Reports", description: "Financial reports and aggregations" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      SuccessEnvelope: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Success" },
          data: { nullable: true },
        },
        required: ["success", "message"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation error" },
          details: { nullable: true },
        },
        required: ["success", "message"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "cmotac29c00008z2surf8zshl" },
          name: { type: "string", example: "Rafael" },
          email: { type: "string", format: "email", example: "rafael@example.com" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "email", "createdAt"],
      },
      AuthPayload: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        },
        required: ["user", "token"],
      },
      RegisterRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Rafael" },
          email: { type: "string", format: "email", example: "rafael@example.com" },
          password: { type: "string", format: "password", example: "secret123" },
        },
        required: ["name", "email", "password"],
      },
      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", example: "rafael@example.com" },
          password: { type: "string", format: "password", example: "secret123" },
        },
        required: ["email", "password"],
      },
      Wallet: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", example: "Main Bank" },
          type: { type: "string", enum: ["bank", "cash", "digital", "other"] },
          balance: { type: "number", example: 2500 },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "type", "balance", "userId", "createdAt", "updatedAt"],
      },
      WalletCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "NuBank" },
          type: { type: "string", enum: ["bank", "cash", "digital", "other"] },
          balance: { type: "number", minimum: 0, example: 1000 },
        },
        required: ["name", "type"],
      },
      WalletUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Reserve Wallet" },
          type: { type: "string", enum: ["bank", "cash", "digital", "other"] },
          balance: { type: "number", minimum: 0, example: 1500 },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", example: "Food" },
          type: { type: "string", enum: ["income", "expense"] },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "type", "userId", "createdAt", "updatedAt"],
      },
      CategoryCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Salary" },
          type: { type: "string", enum: ["income", "expense"] },
        },
        required: ["name", "type"],
      },
      CategoryUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Freelance" },
          type: { type: "string", enum: ["income", "expense"] },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string", example: "Salary payment" },
          amount: { type: "number", example: 500 },
          type: { type: "string", enum: ["income", "expense"] },
          date: { type: "string", format: "date-time" },
          categoryId: { type: "string" },
          walletId: { type: "string" },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          category: { $ref: "#/components/schemas/Category" },
          wallet: { $ref: "#/components/schemas/Wallet" },
        },
        required: [
          "id",
          "title",
          "amount",
          "type",
          "date",
          "categoryId",
          "walletId",
          "userId",
          "createdAt",
          "updatedAt",
        ],
      },
      TransactionCreateRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Groceries" },
          amount: { type: "number", exclusiveMinimum: 0, example: 200 },
          type: { type: "string", enum: ["income", "expense"] },
          date: { type: "string", format: "date-time", example: "2026-05-05T11:00:00.000Z" },
          categoryId: { type: "string" },
          walletId: { type: "string" },
        },
        required: ["title", "amount", "type", "date", "categoryId", "walletId"],
      },
      TransactionUpdateRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Updated groceries" },
          amount: { type: "number", exclusiveMinimum: 0, example: 230 },
          type: { type: "string", enum: ["income", "expense"] },
          date: { type: "string", format: "date-time", example: "2026-05-06T11:00:00.000Z" },
          categoryId: { type: "string" },
          walletId: { type: "string" },
        },
      },
      TransactionListResponse: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Transaction" },
          },
          page: { type: "integer", example: 1 },
          pageSize: { type: "integer", example: 20 },
        },
        required: ["items", "page", "pageSize"],
      },
      Transfer: {
        type: "object",
        properties: {
          id: { type: "string" },
          fromWalletId: { type: "string" },
          toWalletId: { type: "string" },
          amount: { type: "number", example: 100 },
          date: { type: "string", format: "date-time" },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          fromWallet: { $ref: "#/components/schemas/Wallet" },
          toWallet: { $ref: "#/components/schemas/Wallet" },
        },
        required: [
          "id",
          "fromWalletId",
          "toWalletId",
          "amount",
          "date",
          "userId",
          "createdAt",
          "updatedAt",
        ],
      },
      TransferCreateRequest: {
        type: "object",
        properties: {
          fromWalletId: { type: "string" },
          toWalletId: { type: "string" },
          amount: { type: "number", exclusiveMinimum: 0, example: 100 },
          date: { type: "string", format: "date-time", example: "2026-05-05T12:00:00.000Z" },
        },
        required: ["fromWalletId", "toWalletId", "amount", "date"],
      },
      SummaryReport: {
        type: "object",
        properties: {
          totalBalance: { type: "number", example: 1350 },
          income: { type: "number", example: 500 },
          expense: { type: "number", example: 200 },
          net: { type: "number", example: 300 },
          wallets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                type: { type: "string", enum: ["bank", "cash", "digital", "other"] },
                balance: { type: "number" },
              },
              required: ["id", "name", "type", "balance"],
            },
          },
        },
        required: ["totalBalance", "income", "expense", "net", "wallets"],
      },
      CategoryReportItem: {
        type: "object",
        properties: {
          categoryId: { type: "string" },
          categoryName: { type: "string", example: "Food" },
          type: { type: "string", enum: ["income", "expense"] },
          total: { type: "number", example: 200 },
        },
        required: ["categoryId", "categoryName", "type", "total"],
      },
      PeriodReportItem: {
        type: "object",
        properties: {
          period: { type: "string", example: "2026-05" },
          income: { type: "number", example: 500 },
          expense: { type: "number", example: 200 },
          net: { type: "number", example: 300 },
        },
        required: ["period", "income", "expense", "net"],
      },
    },
  },
  paths: {
    "/docs.json": {
      get: {
        tags: ["Health"],
        summary: "Get the OpenAPI JSON document",
        responses: {
          200: successResponse("OpenAPI document", {
            type: "object",
            additionalProperties: true,
          }),
        },
      },
    },
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Check service health",
        responses: {
          200: successResponse("Health status", {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "OK" },
            },
            required: ["success", "message"],
          }),
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: successResponse("User registered successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: {
                  data: { $ref: "#/components/schemas/AuthPayload" },
                },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          409: errorResponse(409, "Email already in use"),
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: successResponse("Login successful", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: {
                  data: { $ref: "#/components/schemas/AuthPayload" },
                },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Invalid credentials"),
        },
      },
    },
    "/api/wallets": {
      get: {
        tags: ["Wallets"],
        summary: "List user wallets",
        security: securityRequirement,
        responses: {
          200: successResponse("Wallets returned", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Wallet" },
                  },
                },
              },
            ],
          }),
          401: errorResponse(401, "Authentication token missing"),
        },
      },
      post: {
        tags: ["Wallets"],
        summary: "Create a wallet",
        security: securityRequirement,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WalletCreateRequest" },
            },
          },
        },
        responses: {
          201: successResponse("Wallet created successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              { type: "object", properties: { data: { $ref: "#/components/schemas/Wallet" } } },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
        },
      },
    },
    "/api/wallets/{id}": {
      patch: {
        tags: ["Wallets"],
        summary: "Update a wallet",
        security: securityRequirement,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WalletUpdateRequest" },
            },
          },
        },
        responses: {
          200: successResponse("Wallet updated successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              { type: "object", properties: { data: { $ref: "#/components/schemas/Wallet" } } },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Wallet not found"),
        },
      },
      delete: {
        tags: ["Wallets"],
        summary: "Delete a wallet",
        security: securityRequirement,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: successResponse("Wallet deleted successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              { type: "object", properties: { data: { nullable: true } } },
            ],
          }),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Wallet not found"),
          409: errorResponse(409, "Operation blocked by related records"),
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "List user categories",
        security: securityRequirement,
        responses: {
          200: successResponse("Categories returned", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            ],
          }),
          401: errorResponse(401, "Authentication token missing"),
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a category",
        security: securityRequirement,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryCreateRequest" },
            },
          },
        },
        responses: {
          201: successResponse("Category created successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: { data: { $ref: "#/components/schemas/Category" } },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
          409: errorResponse(409, "Unique constraint violation"),
        },
      },
    },
    "/api/categories/{id}": {
      patch: {
        tags: ["Categories"],
        summary: "Update a category",
        security: securityRequirement,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryUpdateRequest" },
            },
          },
        },
        responses: {
          200: successResponse("Category updated successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: { data: { $ref: "#/components/schemas/Category" } },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Category not found"),
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete a category",
        security: securityRequirement,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: successResponse("Category deleted successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              { type: "object", properties: { data: { nullable: true } } },
            ],
          }),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Category not found"),
          409: errorResponse(409, "Operation blocked by related records"),
        },
      },
    },
    "/api/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "List user transactions",
        security: securityRequirement,
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "type", in: "query", schema: { type: "string", enum: ["income", "expense"] } },
          { name: "categoryId", in: "query", schema: { type: "string" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
        ],
        responses: {
          200: successResponse("Transactions returned", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: {
                  data: { $ref: "#/components/schemas/TransactionListResponse" },
                },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
        },
      },
      post: {
        tags: ["Transactions"],
        summary: "Create a transaction",
        security: securityRequirement,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TransactionCreateRequest" },
            },
          },
        },
        responses: {
          201: successResponse("Transaction created successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: { data: { $ref: "#/components/schemas/Transaction" } },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Wallet not found"),
        },
      },
    },
    "/api/transactions/{id}": {
      patch: {
        tags: ["Transactions"],
        summary: "Update a transaction",
        security: securityRequirement,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TransactionUpdateRequest" },
            },
          },
        },
        responses: {
          200: successResponse("Transaction updated successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: { data: { $ref: "#/components/schemas/Transaction" } },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Transaction not found"),
        },
      },
      delete: {
        tags: ["Transactions"],
        summary: "Delete a transaction",
        security: securityRequirement,
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: successResponse("Transaction deleted successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              { type: "object", properties: { data: { nullable: true } } },
            ],
          }),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Transaction not found"),
        },
      },
    },
    "/api/transfers": {
      post: {
        tags: ["Transfers"],
        summary: "Create a transfer between wallets",
        security: securityRequirement,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TransferCreateRequest" },
            },
          },
        },
        responses: {
          201: successResponse("Transfer created successfully", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: { data: { $ref: "#/components/schemas/Transfer" } },
              },
            ],
          }),
          400: errorResponse(400, "Transfer wallets must be different"),
          401: errorResponse(401, "Authentication token missing"),
          404: errorResponse(404, "Source wallet not found"),
        },
      },
    },
    "/api/reports/summary": {
      get: {
        tags: ["Reports"],
        summary: "Get balance summary",
        security: securityRequirement,
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } },
        ],
        responses: {
          200: successResponse("Summary report returned", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              { type: "object", properties: { data: { $ref: "#/components/schemas/SummaryReport" } } },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
        },
      },
    },
    "/api/reports/by-category": {
      get: {
        tags: ["Reports"],
        summary: "Group report by category",
        security: securityRequirement,
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } },
        ],
        responses: {
          200: successResponse("Category report returned", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/CategoryReportItem" },
                  },
                },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
        },
      },
    },
    "/api/reports/by-period": {
      get: {
        tags: ["Reports"],
        summary: "Group report by period",
        security: securityRequirement,
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "period", in: "query", schema: { type: "string", enum: ["day", "month"] } },
        ],
        responses: {
          200: successResponse("Period report returned", {
            allOf: [
              { $ref: "#/components/schemas/SuccessEnvelope" },
              {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/PeriodReportItem" },
                  },
                },
              },
            ],
          }),
          400: errorResponse(400, "Validation error"),
          401: errorResponse(401, "Authentication token missing"),
        },
      },
    },
  },
};
