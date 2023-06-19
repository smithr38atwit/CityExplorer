import mapboxgl from 'mapbox-gl';
import { useEffect, useState} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Toggle the value of menuOpen
    };
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
        map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            placeholder: "Search for a location",
        }));

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div className="App">
            <div style={{ position: 'relative', width: '100%', height: '700px' }}>
                <div id='map' style={{ width: '100%', height: '100%' }}></div>
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '1' }}>
                    <button onClick={toggleMenu}>Open Menu</button>
                    {menuOpen && (
                        <ul>
                            <li>NUMERO UNO</li>
                            <li>RANK</li>
                            <li>QUEST3</li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}


export default App;
