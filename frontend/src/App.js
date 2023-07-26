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
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDataVisible, setUserDataVisible] = useState(false);
  const [displayQuests, setDisplayQuests] = useState(false);
  const [displayFriends, setDisplayFriends] = useState(false);
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


  //User Menu Handlers
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setUserDataVisible(false); // Toggle the value of menuOpen
    setDisplayQuests(false);
    setDisplayFriends(false);
    if (showConfirmation) {
      setShowConfirmation(false);
      currentMarker.remove();
      setCurrentMarker(null);
    }
    if (displayFriends) {
      friendData.forEach(friend => {
        friend.marker.remove();
      });
    }
  };

  //show user account data
  const toggleUserData = () => {
    setUserDataVisible(!userDataVisible); // Toggle the value of userDataVisible
  };


  //Quests LMAO
  const toggleDisplayQuests = () => {
    setDisplayQuests(!displayQuests); // Toggle the value of displayQuests
  };


  // displaying firiends and adding a friend
  const toggleDisplayFriends = () => {
    if (displayFriends) {
      friendData.forEach(friend => {
        if (friend.marker) {
          friend.marker.remove();
        }
      });
      setSelectedPin(null); // Clear the selected pin details
    } else {
      friendData.forEach(friend => {
        const marker = new mapboxgl.Marker({ color: redColor })
          .setLngLat(friend.location)
          .addTo(map.current);
        friend.marker = marker;

        marker.getElement().addEventListener('click', () => {
          map.current.flyTo({ center: friend.location });
          setSelectedPin(prevSelectedPin =>
            prevSelectedPin === friend ? null : friend
          ); // Toggle the selected pin details
        });
      });
    }
    setDisplayFriends(!displayFriends); // Toggle the value of displayFriends
  };

  //adding new friend

  const handleAddFriend = () => {
    if (newFriendName.trim() !== '') {
      const newFriend = {
        id: friendData.length + 1,
        name: newFriendName.trim()
      };
      setFriendData([...friendData, newFriend]);
      setNewFriendName('');
    }
  };

  const [selectedPin, setSelectedPin] = useState(null);
  const PinDetails = ({ pinName, description }) => {
    const [showButtons, setShowButtons] = useState(true);

    const handleLike = () => {
      // Handle like button click
    };

    const handleDislike = () => {
      // Handle dislike button click
    };
    const handleDropPin = () => {
      // Handle drop pin button click
    };
    return (
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', border: '1px solid #ccc', zIndex: 999 }}>
        <h2>{pinName}</h2>
        <p>{description}</p>
        {showButtons ? (
          <div>
            <button onClick={() => setShowButtons(false)}>Log</button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleLike}>Like</button>
              <button onClick={handleDislike}>Dislike</button>
            </div>
            <button onClick={handleDropPin} style={{ marginTop: '10px' }}>Drop My Pin</button>
          </div>
        )}
      </div>
    );
  };



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
        <div style={{ position: 'absolute', bottom: '35px', left: '10px', zIndex: '1' }}>
          <button onClick={toggleMenu}>Open Menu</button>
          <button onClick={handleAddPin}>userpin</button>
          {selectedPin && (
            <PinDetails pinName={selectedPin.pinName} description={selectedPin.description} />
          )}
          {showConfirmation && (
            <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', border: '1px solid #ccc' }}>
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
              <p>Name: {auth.username}</p>
              <p>Email: {auth.email}</p>

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
              <input type="text" value={newFriendName} onChange={e => setNewFriendName(e.target.value)} />
              <button onClick={handleAddFriend}>Add Friend</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default App;
