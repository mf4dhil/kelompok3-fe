import api from "./api";

export async function login(data) {
	const response = await api.post("/api/login", data);
	return response.data;
}
export async function getMe() {
 	const response = await api.get("/api/me");
 	return response.data;
}