import api from "./api";
import { getResponseData } from "./serviceUtils";

const getAll = (endpoint) => () => getResponseData(api.get(endpoint));

export const getShapes = getAll("/shapes");
export const getSizes = getAll("/size");
export const getFlavors = getAll("/flavors");
export const getTypes = getAll("/types");
export const getCategories = getAll("/categories");
