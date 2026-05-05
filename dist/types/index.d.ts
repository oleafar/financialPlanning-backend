export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense' | 'both';
export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
    createdAt: string;
}
export interface CreateTransactionInput {
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
}
export interface UpdateTransactionInput {
    type?: TransactionType;
    amount?: number;
    description?: string;
    category?: string;
    date?: string;
}
export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    createdAt: string;
}
export interface CreateCategoryInput {
    name: string;
    type: CategoryType;
}
export interface UpdateCategoryInput {
    name?: string;
    type?: CategoryType;
}
export interface TransactionFilters {
    type?: TransactionType;
    category?: string;
    startDate?: string;
    endDate?: string;
}
export interface CategoryBreakdown {
    category: string;
    total: number;
    count: number;
}
export interface Summary {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    incomeByCategory: CategoryBreakdown[];
    expensesByCategory: CategoryBreakdown[];
}
//# sourceMappingURL=index.d.ts.map