import { MOCKED_USERS } from "../mocks/users";

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCKED_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        const { password, ...userData } = user;
        resolve(userData);
      } else {
        reject(new Error("Email ou senha inválidos."));
      }
    }, 1000);
  });
};
