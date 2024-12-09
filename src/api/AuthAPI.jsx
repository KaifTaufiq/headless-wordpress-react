import { api } from "./api";

const AUTH_KEY = `AUTH_KEY=${import.meta.env.VITE_AUTH_KEY}`;

export const validateAPI = async (token) => {
  return api.post(`auth/validate&JWT=${token}`);
};

export const revokeAPI = async (token) => {
  return api.post(`auth/revoke&JWT=${token}`);
};

export const loginAPI = async ({ login, password }) => {
  return api.post(
    "/auth",
    login.includes("@")
      ? { email: login, password }
      : { username: login, password }
  );
};

export const reqResetAPI = async ({ email }) => {
  return api.post("user/reset_password", {
    email,
  });
};

export const setPasswordAPI = async ({ emailParam, code, Pass }) => {
  return api.put("user/reset_password", {
    email: emailParam,
    code,
    new_password: Pass,
  });
};

export const registerAPI = async ({
  email,
  password,
  username,
  firstName,
  lastName,
}) => {
  const url = `/users&${AUTH_KEY}`;
  return api.post(url, {
    email,
    password,
    user_login: username,
    first_name: firstName,
    last_name: lastName,
  });
};
