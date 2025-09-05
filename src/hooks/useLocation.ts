// src/hooks/useLocation.ts
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function useLocation() {
  const [location, setLocation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("A permissão para acessar a localização foi negada.");
        return;
      }

      try {
        let currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        });

        console.log(
          "RESPOSTA COMPLETA DA API:",
          JSON.stringify(reverseGeocode, null, 2)
        );

        if (reverseGeocode.length > 0) {
          const { subregion, country } = reverseGeocode[0];
          setLocation(`${subregion}, ${country}`);
        }
      } catch (error) {
        setErrorMsg("Não foi possível obter a localização.");
        console.error(error);
      }
    })();
  }, []);

  return { location, errorMsg };
}
