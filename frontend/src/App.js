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
        var marker = new mapboxgl.Marker({ 
            color: "#FF0000", 
            draggable: false 
          })
            .setLngLat([-71.0596, 42.3601])
            .addTo(map);


        return () => {
            map.remove();
        };
    }, []);

    return (
        <div className="App">
            <div style={{ position: 'relative', width: '100%', height: '700px' }}>
                <div id='map' style={{ width: '100%', height: '100%' }}></div>
                <div style={{ position: 'absolute', bottom: '35px', left: '10px', zIndex: '1' }}>
                    <button onClick={toggleMenu}>Open Menu</button>
                    {menuOpen && (
                          <ul style={{ position: 'absolute', top: '-130px', background: '#fff', padding: '10px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
                          <button>Account</button>
                          <button>Quests</button>
                          <button>Friends</button>
                      </ul>
                    )}
                </div>
            </div>
        </div>
    );
}


export default App;
