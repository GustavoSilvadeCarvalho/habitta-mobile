// hooks/useFavorites.ts
// Hook mantido para compatibilidade, mas agora usa o contexto global
import { useFavoritesContext } from "../contexts/FavoritesContext";

export const useFavorites = () => {
  return useFavoritesContext();
};
