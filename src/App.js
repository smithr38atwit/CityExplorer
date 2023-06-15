import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";

function App() {
    useEffect(() => {
        var map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-71.095019, 42.336611],
            zoom: 14,
        });
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
            })
        );

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div className="App">
            <div id='map' style={{ width: 400, height: 300 }}></div>
        </div>
    );
}




export default App;
