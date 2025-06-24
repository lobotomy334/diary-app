import apiClient from "../utils/apiClient";

export async function login(username, password) {
  const res = await apiClient.post("/auth/login", { username, password });
  return res.data;
}

export async function signup({ username, password, name, birth }) {
  const res = await apiClient.post("/auth/signup", { username, password, name, birth });
  return res.data;
}

export async function checkUsername(username) {
  const res = await apiClient.post("/auth/check", { username });
  return res.data;
}

export async function deleteUser() {
  const res = await apiClient.delete("/auth/delete");
  return res.data;
}