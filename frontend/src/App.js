import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { X, List } from '@phosphor-icons/react';

import LoginPopup from './login/Login';
import Menu from './menu/Menu';
import AuthContext from './context/AuthProvider';
import MapContext from './context/MapProvider';
import PinPopup from './pin-popup/PinPopup';


mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";


function App() {
  const { auth } = useContext(AuthContext);
  const map = useContext(MapContext);
  const mapContainer = useRef(null);

  //User Location
  const [userCords, setuserCords] = useState({ lng: -70.9, lat: 42.35 });

  //User Menu
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [displayLogin, setDisplayLogin] = useState(true);
  const [newFriendName, setNewFriendName] = useState('');

  //New Pin Menu
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [pinName, setPinName] = useState('');
  const [pinDescription, setPinDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false)
  const [geocodeResult, setGeocodeResult] = useState({})

  // Map controls
  const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true,
  });
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Search for a location",
    marker: { color: "blue" },
    proximity: 'ip'
  });


  //Map creation & rendering
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userCords.lng, userCords.lat],
      zoom: 2,
      projection: 'globe'
    });

    map.current.on('load', () => {
      map.current.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
        'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
      });
    });

    // add geolocator (user location)
    document.getElementById("geolocate-container").append(geolocateControl.onAdd(map.current))
    geolocateControl.on('geolocate', (position) => {
      const { coords } = position;
      setuserCords({ lng: coords.longitude, lat: coords.latitude })
    });

    // add geocoder (search bar)
    document.getElementById('geocoder-container').appendChild(geocoder.onAdd(map.current));
    geocoder.on('result', (e) => {
      const { result } = e;
      console.debug(result)
      setShowPopup(true);
      setGeocodeResult(result);
    });
  }, []);


  // Adding a new pin on user location
  const handleAddPin = () => {
    if (currentMarker == null) {
      setShowConfirmation(true);
      const tempMark = new mapboxgl.Marker({ draggable: true, color: 'blue' }).setLngLat(userCords).addTo(map.current);
      setCurrentMarker(tempMark);
    }
    else {
      setShowConfirmation(false);
      currentMarker.remove();
      setCurrentMarker(null);
    }

  };

  // Confirm pin location
  const handleConfirmClick = () => {
    console.log('Confirmed');
    setShowConfirmation(false);
    setCurrentMarker(null)
  };

  // Deny pin location
  const handleDenyClick = () => {
    if (currentMarker != null) {
      console.log('Denied');
      currentMarker.remove();
      setCurrentMarker(null);
      setShowConfirmation(false);

    }
  };


  return (
    <div className="App">
      <div className='map-container'>
        <div ref={mapContainer} className="map-container" />
        {displayLogin && <>
          <div className='background-overlay login-bg'></div>
          <LoginPopup setDisplayLogin={setDisplayLogin} geolocateControl={geolocateControl} />
        </>}
        <div className='top-bar-container'>
          <div id='top-bar'>
            <button id='menu-button' className='open-menu-button' onClick={() => setMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
            <div id='geocoder-container' className='geo-container'></div>
            <div id='geolocate-container'></div>
          </div>
        </div>
        <Menu isOpen={isMenuOpen} setIsOpen={setMenuOpen} setDisplayLogin={setDisplayLogin}></Menu>
        {isMenuOpen && <div className='background-overlay'></div>}
        <button onClick={handleAddPin} className="userpin-button">userpin</button>
        {showConfirmation && (
          <div className="userpin-inputs-container">
            <div className="userpin-inputs">
              <div>
                <input
                  type="text"
                  value={pinName}
                  onChange={(e) => setPinName(e.target.value)}
                  placeholder="Enter pin name"
                />
                <input
                  type="text"
                  value={pinDescription}
                  onChange={(e) => setPinDescription(e.target.value)}
                  placeholder="Enter pin description"
                />
                <button onClick={handleConfirmClick}>Confirm</button>
                <button onClick={handleDenyClick}>Deny</button>
              </div>
            </div>
          </div>
        )}
        {showPopup && <PinPopup result={geocodeResult} userCoords={userCords} setShowPopup={setShowPopup} />}
      </div>
    </div>
  );
}


export default App;
