import { createContext, useRef } from "react";

// Creating a new React context with an empty object as the default value.
const MapContext = createContext({});

// Defining a custom component called "MapProvider" using the function syntax.
export function MapProvider({ children }) {
    const map = useRef(null);

    return (
        <MapContext.Provider value={map}>
            {children}
        </MapContext.Provider>
    );
}
export default MapContext;