import { createContext, useRef } from "react";

const MapContext = createContext({});

// Provides the Mapbox map instance
export function MapProvider({ children }) {
    const map = useRef(null);

    return (
        <MapContext.Provider value={map}>
            {children}
        </MapContext.Provider>
    );
}
export default MapContext;