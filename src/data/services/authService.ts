export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("https://habitta-mobile.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Email ou senha inválidos.");
    }
  } catch (err) {
    throw err;
  }
};
