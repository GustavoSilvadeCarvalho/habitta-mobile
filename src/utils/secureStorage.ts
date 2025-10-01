import * as SecureStore from "expo-secure-store";

export async function saveCredentials(email: string, password: string) {
  await SecureStore.setItemAsync("userEmail", email);
  await SecureStore.setItemAsync("userPassword", password);
}

export async function getCredentials() {
  const email = await SecureStore.getItemAsync("userEmail");
  const password = await SecureStore.getItemAsync("userPassword");

  if (email && password) {
    return { email, password };
  }
  return null;
}

export async function clearCredentials() {
  await SecureStore.deleteItemAsync("userEmail");
  await SecureStore.deleteItemAsync("userPassword");
}
