"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const categories_1 = __importDefault(require("./routes/categories"));
const summary_1 = __importDefault(require("./routes/summary"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/transactions', transactions_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/summary', summary_1.default);
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
exports.default = app;
//# sourceMappingURL=app.js.map