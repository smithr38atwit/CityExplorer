// Import necessary modules and components
import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MapPinLine } from '@phosphor-icons/react';

import LoginPopup from './login/Login';
import Menu from './menu/Menu';
import MapContext from './context/MapProvider';
import AuthContext from './context/AuthProvider';
import PinPopup from './pin-popup/PinPopup';
import { pinModel } from './scripts/data';

// Set the Mapbox access token for the API
mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";


function App() {
  const auth = useContext(AuthContext);
  const map = useContext(MapContext);
  const mapContainer = useRef(null);

  //User Location
  const [userCords, setuserCords] = useState({ lng: -70.9, lat: 42.35 });

  //User Menu
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [displayLogin, setDisplayLogin] = useState(true);

  //New Pin Menu
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [pinName, setPinName] = useState('');
  const [pinDescription, setPinDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupData] = useState(pinModel('', '', 0, 0, null, 0, 0, 0));
  const tempMark = useRef(new mapboxgl.Marker());

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
      style: "mapbox://styles/mapbox/outdoors-v12",
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

    map.current.on('click', async (e) => {
      tempMark.current.remove()
      const features = map.current.queryRenderedFeatures(e.point, { layers: ["poi-label"] })
      // console.debug(features)
      if (features.length > 0) {
        for (const pin of auth.current.pins) {
          if (pin.feature_id === features[0].id) {
            pin.marker.getElement().click();
            return;
          }
        }
        setShowPopup(false)
        const name = features[0].properties.name;
        const coords = features[0].geometry.coordinates;
        let address;
        const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxgl.accessToken}&types=address`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const firstFeature = data.features[0];
            address = firstFeature.place_name;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        map.current.flyTo({ center: coords, zoom: 16 });
        tempMark.current = new mapboxgl.Marker({ color: "blue" }).setLngLat(coords);
        tempMark.current.addTo(map.current);
        setPopupData(pinModel(name, address, coords[0], coords[1], null, 0, 0, features[0].id));
        setShowPopup(true);
      }
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
      console.debug(result);
      const title = result.place_name.substring(0, result.place_name.indexOf(','));
      const address = result.place_name.substring(result.place_name.indexOf(',') + 1);
      setPopupData(pinModel(title, address, result.center[0], result.center[1], null, 0, 0, -1))
      setShowPopup(true);
    });
  }, []);

  useEffect(() => {
    if (!showPopup) {
      tempMark.current.remove()
    }
  }, [showPopup]);


  // Adding a new pin on user location
  const handleAddPin = () => {
    if (currentMarker == null) {
      map.current.flyTo({ center: userCords, zoom: 16 });
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
    setPopupData(pinModel(pinName, pinDescription, userCords.lng, userCords.lat, null, 0, 0, -1))
    setShowPopup(true);
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
          <LoginPopup setDisplayLogin={setDisplayLogin} setPopupData={setPopupData} setShowPopup={setShowPopup} geolocateControl={geolocateControl} />
        </>}
        <Menu
          isOpen={isMenuOpen}
          setIsOpen={setMenuOpen}
          setDisplayLogin={setDisplayLogin}
          setPopupData={setPopupData}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
        {isMenuOpen && <div className='background-overlay'></div>}
        <button onClick={handleAddPin} className="userpin-button">
          <MapPinLine size={32} />
        </button>
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
        {showPopup && <PinPopup
          pin={popupData}
          userCoords={userCords}
          setPopupData={setPopupData}
          setShowPopup={setShowPopup}
        />}
      </div>
    </div>
  );
}


export default App;
