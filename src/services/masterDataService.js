import { createCrudService } from "./serviceUtils";

export const shapesService = createCrudService("/shapes");
export const sizesService = createCrudService("/size");
export const flavorsService = createCrudService("/flavors");
export const typesService = createCrudService("/types");
export const categoriesService = createCrudService("/categories");
export const rekeningsService = createCrudService("/rekenings");
