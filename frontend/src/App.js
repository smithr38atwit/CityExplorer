import mapboxgl from 'mapbox-gl';
import { useEffect, useState} from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";

const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    location: "New York",
    avatar: "https://example.com/avatar.jpg"
  };
const questData = [
    { id: 1, name: "Collect 10 gems", status: "In Progress" },
    { id: 2, name: "Defeat the dragon", status: "Completed" },
    { id: 3, name: "Explore the hidden cave", status: "Not Started" }
  ];

const friendData = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
  ];


function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDataVisible, setUserDataVisible] = useState(false);
    const [displayQuests, setDisplayQuests] = useState(false);
    const [displayFriends, setDisplayFriends] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setUserDataVisible(false); // Toggle the value of menuOpen
        setDisplayQuests(false);
        setDisplayFriends(false);
    };
    const toggleUserData = () => {
        setUserDataVisible(!userDataVisible); // Toggle the value of userDataVisible
      };
    const toggleDisplayQuests = () => {
        setDisplayQuests(!displayQuests); // Toggle the value of displayQuests
      };

    const toggleDisplayFriends = () => {
        setDisplayFriends(!displayFriends); // Toggle the value of displayFriends
      };


    useEffect(() => {
        var map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-71.095019, 42.336611],
            zoom: 2,
            projection: 'globe'
        });
        map.on('load', () => {
            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true,
                    },
                    trackUserLocation: true,
                    showUserHeading: true,
                })
            );
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: "Search for a location",
            });

            map.addControl(geocoder, 'top-left');

            // map.setFog({
            //     color: 'rgb(186, 210, 235)', // Lower atmosphere
            //     'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
            //     'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
            //     'space-color': 'rgb(11, 11, 25)', // Background color
            //     'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
            // });

            // map.addLayer({
            //     id: 'building-heights',
            //     type: 'fill-extrusion',
            //     source: 'composite',
            //     'source-layer': 'building',
            //     paint: {
            //         'fill-extrusion-color': '#888888',
            //         'fill-extrusion-height': ['get', 'height'],
            //         'fill-extrusion-base': 0,
            //         'fill-extrusion-opacity': 0.6
            //     }
            // });
            const popup = new mapboxgl.Popup({
                closeButton: false
            });
            geocoder.on('result', (e) => {
                const { result } = e;
                popup.setLngLat(result.center)
                    .setHTML(`<h3>${result.place_name}</h3>`)
                    .addTo(map);
            });
            var marker = new mapboxgl.Marker({
                color: "#FF0000",
                draggable: false
              })
                .setLngLat([-71.0596, 42.3601])
                .addTo(map);
        });


        return () => {
            map.remove();
        };
    }, []);

    return (
        <div className="App">
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <div id='map' style={{ width: '100%', height: '100%' }}></div>
        <div style={{ position: 'absolute', bottom: '35px', left: '10px', zIndex: '1' }}>
          <button onClick={toggleMenu}>Open Menu</button>
            {menuOpen && (
              <ul style={{ position: 'absolute', top: '-25px', left: '100px', background: '#fff', padding: '10px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)', display: 'flex', listStyle: 'none'}}>
                <button onClick={toggleUserData}>Account</button>
                <button onClick={toggleDisplayQuests}>Quests</button>
                <button onClick={toggleDisplayFriends}>Friends</button>
              </ul>
            )}
            {userDataVisible && (
              <div style={{ position: 'absolute', top: '-250px', right: '-150px', backgroundColor: '#fff', padding: '20px', border: '1px solid #ccc' }}>
                <h2>User Data</h2>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
                <p>Location: {userData.location}</p>
              </div>
            )}
            {displayQuests && (
              <div style={{ position: 'absolute', top: '-250px', right: '-475px', backgroundColor: '#fff', padding: '20px', border: '1px solid #ccc' }}>
                <h2>Quests</h2>
                <ul>
                {questData.map((quest) => (
                    <li key={quest.id}>{quest.name} - {quest.status}</li>
                  ))}
                </ul>
                </div>
              )}
            {displayFriends && (
              <div style={{ position: 'absolute', top: '-250px', right: '-620px', backgroundColor: '#fff', padding: '20px', border: '1px solid #ccc' }}>
                  <h2>Friends</h2>
                  <ul>
                    {friendData.map(friend => (
                      <li key={friend.id}>{friend.name}</li>
                    ))}
                  </ul>
                </div>
              )}
        </div>
      </div>
    </div>
    );
}


export default App;
