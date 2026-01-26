import React, { useContext, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import { USER_LAST_LOCATION } from "settings/constants";

type LocationProps = {
  getLocation: () => any;
};

export const LocationContext = React.createContext({} as LocationProps);

export const useLocation = () => useContext(LocationContext);

const LocationProvider = ({ children }) => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const getLocation = () => {
    const location = localStorage.getItem(USER_LAST_LOCATION);
    return JSON.parse(location);
  };

  useEffect(() => {
    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
      const coordinates = {
        lat: coords.latitude,
        lng: coords.longitude,
      };
      localStorage.setItem(USER_LAST_LOCATION, JSON.stringify(coordinates));
    }
  }, [coords]);

  return (
    <LocationContext.Provider
      value={{
        getLocation,
      }}
    >
      <>{children}</>
    </LocationContext.Provider>
  );
};

export default LocationProvider;
