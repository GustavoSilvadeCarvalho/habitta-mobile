import * as SecureStore from "expo-secure-store";

const isWeb = typeof window !== "undefined" && typeof window.document !== "undefined";

export async function saveCredentials(email: string, password: string) {
  if (isWeb) {
    window.localStorage.setItem("userEmail", email);
    window.localStorage.setItem("userPassword", password);
  } else {
    await SecureStore.setItemAsync("userEmail", email);
    await SecureStore.setItemAsync("userPassword", password);
  }
}

export async function getCredentials() {
  if (isWeb) {
    const email = window.localStorage.getItem("userEmail");
    const password = window.localStorage.getItem("userPassword");
    if (email && password) {
      return { email, password };
    }
    return null;
  } else {
    const email = await SecureStore.getItemAsync("userEmail");
    const password = await SecureStore.getItemAsync("userPassword");
    if (email && password) {
      return { email, password };
    }
    return null;
  }
}

export async function clearCredentials() {
  if (isWeb) {
    window.localStorage.removeItem("userEmail");
    window.localStorage.removeItem("userPassword");
  } else {
    await SecureStore.deleteItemAsync("userEmail");
    await SecureStore.deleteItemAsync("userPassword");
  }
}
