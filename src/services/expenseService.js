import { createCrudService } from "./serviceUtils";

export const expenseCategoryService = createCrudService("/expense-categories", {
  messageKey: "message",
});

export const expenseService = createCrudService("/expenses", {
  messageKey: "message",
});
