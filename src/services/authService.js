import api from "./api";

export async function login(data) {
	const response = await api.post("/login", data);
	return response.data;
}
export async function getMe() {
 	const response = await api.get("/me");
 	return response.data;
}