import { useEffect, useState } from "react";

export enum LocationErrorType {
  UNSUPPORTED = "UNSUPPORTED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  POSITION_UNAVAILABLE = "POSITION_UNAVAILABLE",
  TIMEOUT = "TIMEOUT",
  UNKNOWN = "UNKNOWN",
}

export type MyLocation = {
  lat: number;
  lng: number;
};

export type UseMyLocationResult = {
  location: MyLocation | null;
  isLoading: boolean;
  error: LocationErrorType | null;
};

export function useMyLocation(): UseMyLocationResult {
  const [location, setLocation] = useState<MyLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<LocationErrorType | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(LocationErrorType.UNSUPPORTED);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(LocationErrorType.PERMISSION_DENIED);
            break;
          case err.POSITION_UNAVAILABLE:
            setError(LocationErrorType.POSITION_UNAVAILABLE);
            break;
          case err.TIMEOUT:
            setError(LocationErrorType.TIMEOUT);
            break;
          default:
            setError(LocationErrorType.UNKNOWN);
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60_000,
      }
    );
  }, []);

  return { location, isLoading, error };
}
