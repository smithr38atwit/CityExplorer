import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from '@fortawesome/free-solid-svg-icons';

import LoginPopup from './login/Login';
import Sidebar from './sidebar/Sidebar';
import AuthContext from './context/AuthProvider';
import MapContext from './context/MapProvider';

mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";


function App() {
  const questData = [
    { id: 1, name: "Collect 10 gems", status: "In Progress" },
    { id: 2, name: "Defeat the dragon", status: "Completed" },
    { id: 3, name: "Explore the hidden cave", status: "Not Started" }
  ];

  //colah data
  const redColor = '#FF0000'; // Define the color red
  const blueColor = '#0000FF'; // Define the color blue


  const { auth } = useContext(AuthContext);
  const map = useContext(MapContext);
  const mapContainer = useRef(null);

  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  //User Location
  const [userlng, setuserLng] = useState(null);
  const [userlat, setuserLat] = useState(null);

  //User Menu
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [displayLogin, setDisplayLogin] = useState(true);


  //addFriend
  const [friendData, setFriendData] = useState([
    { id: 1, name: "Alice", location: [-71.0589, 42.3601], pinName: "PinA", description: "Friend A's pin description" },
    { id: 2, name: "Bob", location: [-71.0636, 42.3555], pinName: "PinB", description: "Friend B's pin description" },
    { id: 3, name: "Charlie", location: [-71.0712, 42.3662], pinName: "PinC", description: "Friend C's pin description" }

  ]);
  const [newFriendName, setNewFriendName] = useState('');

  //New Pin Menu
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [pinName, setPinName] = useState('');
  const [pinDescription, setPinDescription] = useState('');


  //Adding a new pin

  const handleAddPin = () => {
    if (currentMarker == null) {
      setShowConfirmation(true);
      const tempMark = new mapboxgl.Marker({ draggable: true, color: blueColor }).setLngLat([lng, lat]).addTo(map.current);
      setCurrentMarker(tempMark);
    }
    else {
      setShowConfirmation(false);
      currentMarker.remove();
      setCurrentMarker(null);
    }

  };
  const handleConfirmClick = () => {
    console.log('Confirmed');
    setShowConfirmation(false);
    setCurrentMarker(null)
  };

  const handleDenyClick = () => {
    if (currentMarker != null) {
      console.log('Denied');
      currentMarker.remove();
      setCurrentMarker(null);
      setShowConfirmation(false);

    }
  };
  const handleDescriptionChange = (event) => {
    setPinDescription(event.target.value);
  };
  const handleNameChange = (event) => {
    setPinName(event.target.value);
  };


  //Map creation & rendering
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 2,
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
      marker: { color: "red" }
    });
    geocoder.addTo('#geocoder-container');

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
      map.current.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
        'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
      });
    });
  }, []);


  return (
    <div className="App">
      <div className='map-container'>
        <div ref={mapContainer} className="map-container" />
        {displayLogin && <>
          <div className='background-overlay'></div>
          <LoginPopup setDisplayLogin={setDisplayLogin} />
        </>}
        <div id='top-bar'>
          <button id='menu-button' className='menu-button' onClick={() => setSidebarOpen(!isSidebarOpen)}><FontAwesomeIcon icon={faBars} /></button>
          <div id='geocoder-container' className='geo-container'></div>
        </div>
        <Sidebar isOpen={isSidebarOpen}></Sidebar>
        <button onClick={handleAddPin} className="userpin-button">userpin</button>
        {showConfirmation && (
          <div className="userpin-inputs-container">
            <div className="userpin-inputs">
              <div>
                <input
                  type="text"
                  value={pinName}
                  onChange={handleNameChange}
                  placeholder="Enter pin name"
                />
                <input
                  type="text"
                  value={pinDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter pin description"
                />
                <button onClick={handleConfirmClick}>Confirm</button>
                <button onClick={handleDenyClick}>Deny</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


export default App;
