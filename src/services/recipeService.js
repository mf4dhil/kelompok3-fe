import api from "./api";
import { withServiceErrorHandling } from "./serviceUtils";

const request = (promise) => withServiceErrorHandling(promise, "message");

export const recipeService = {
  getAll: () => request(api.get("/recipes")),
  updateVariant: (variantId, items) =>
    request(api.put(`/recipes/variants/${variantId}`, { items })),
};
