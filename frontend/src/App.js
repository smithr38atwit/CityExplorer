import mapboxgl from 'mapbox-gl';
import { useEffect, useState, useRef, useContext } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import LoginPopup from './login/Login';
import AuthContext from './context/AuthProvider';

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
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const [userlng, setuserLng] = useState(null);
  const [userlat, setuserLat] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDataVisible, setUserDataVisible] = useState(false);
  const [displayQuests, setDisplayQuests] = useState(false);
  const [displayFriends, setDisplayFriends] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [marker, setMarker] = useState(null);


  const { auth } = useContext(AuthContext);

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

  const handleButtonClick = () => {
    setShowConfirmation(true);
  };


  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe'
    });
    map.current.addControl(
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
    map.current.addControl(geocoder, 'top-left');
    const popup = new mapboxgl.Popup({
      closeButton: false
    });
    geocoder.on('result', (e) => {
      const { result } = e;
      popup.setLngLat(result.center)
        .setHTML(`<h3>${result.place_name}</h3>`)
        .addTo(map.current);
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on('load', () => {
      map.current.on('geolocate', (position) => {
        const { coords } = position;
        setuserLat(coords.latitude);
        setuserLng(coords.longitude);

      });
    });
  }, []);

  useEffect(() => {
    auth.pins?.forEach(pin => {
      new mapboxgl.Marker()
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map.current);
    });
    console.debug(auth.pins)
  }, [auth.pins]);

  const handleAddPin = () => {
    if (marker == null) {
      const tempMark = new mapboxgl.Marker({ draggable: true }).setLngLat([lng, lat]).addTo(map.current);
      setMarker(tempMark)
      setShowConfirmation(true);
    }

  };
  const handleConfirmClick = () => {
    // Perform actions when the confirm button is clicked
    console.log('Confirmed');
  };

  const handleDenyClick = () => {
    // Perform actions when the deny button is clicked
    console.log('Denied');
    marker.remove();
    setMarker(null);

  };




  return (
    <div className="App">
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100vh' }} />
        <LoginPopup />
        <div style={{ position: 'absolute', bottom: '35px', left: '10px', zIndex: '1' }}>
          <button onClick={toggleMenu}>Open Menu</button>
          <button onClick={handleAddPin}>userpin</button>
          {showConfirmation && (
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', textAlign: 'center', paddingBottom: '10px' }}>
              <button onClick={handleConfirmClick}>Confirm</button>
              <button onClick={handleDenyClick}>Deny</button>
            </div>
          )}
          {menuOpen && (
            <ul style={{ position: 'absolute', top: '-25px', left: '100px', background: '#fff', padding: '10px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)', display: 'flex', listStyle: 'none' }}>
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
