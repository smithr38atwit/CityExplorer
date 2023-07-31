import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { User, Users, SignOut, X, } from '@phosphor-icons/react'

import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';
import "./Menu.css";

mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";

function Menu({ isOpen, setIsOpen, setDisplayLogin }) {
    const redColor = '#FF0000'; // Define the color red
    const blueColor = '#0000FF';
    const { auth, setAuth } = useContext(AuthContext);
    const map = useContext(MapContext);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [userDataVisible, setUserDataVisible] = useState(false);
    const [friendsVisible, setFriendsVisible] = useState(false);
    const [newFriendName, setNewFriendName] = useState("");
    const [selectedPin, setSelectedPin] = useState(null);

    const [showLog, setShowLog] = useState(false);

    const [currentMarker, setCurrentMarker] = useState(null);

    const [friendData, setFriendData] = useState([
        {
            id: 1,
            name: "Josh Gyllinsky",

            pins: [
                {
                    id: 1,
                    name: "My House",
                    description: "New Crip Alert!",
                    location: [43.1939, -71.5724], // New Hampshire coordinates for the first pin
                },
                {
                    id: 2,
                    name: "My favorite restaurant",
                    description: "Best Burgers here for sure",
                    location: [43.2081, -71.5376], // New Hampshire coordinates for the second pin
                },
            ],
        },
        {
            id: 2,
            name: "Ryan Smith",

            pins: [
                {
                    id: 1,
                    name: "bull riding!",
                    description: "I almost got smoked by a bull here, good time tho",
                    location: [30.2672, -97.7431], // Texas coordinates for the first pin
                },
                {
                    id: 2,
                    name: "First Iphone!",
                    description: "I got my iphone 2 here!",
                    location: [36.7783, -119.4179], // California coordinates for the second pin
                },
            ],
        },
    ]);


    useEffect(() => {
        if (!isOpen) {
            // If the menu is closed, remove the friend pins from the map
            setFriendsVisible(false);
            setUserDataVisible(false);
        }
        else if (currentMarker != null) {
            currentMarker.remove();
            setCurrentMarker(null);
            setShowLog(false);
        }
    }, [isOpen]);


    const handleUserButtonClick = () => {
        setUserDataVisible(!userDataVisible);
        setFriendsVisible(false);

    };

    const handleFriendsButtonClick = () => {
        setFriendsVisible(!friendsVisible);
        setUserDataVisible(false);

    };

    const logOut = () => {
        setIsOpen(false);
        setAuth({ email: '', username: '', id: 0, pins: [] });
        setDisplayLogin(true);
    }


    //check & log friend pin

    const handleAddPin = (longitude, latitude) => {
        if (currentMarker == null) {
            setShowLog(true);
            const tempMark = new mapboxgl.Marker({ draggable: true, color: blueColor }).setLngLat([longitude, latitude]).addTo(map.current);
            setCurrentMarker(tempMark);

        }
        else {
            setShowLog(false);
            currentMarker.remove();
            setCurrentMarker(null);
        }

    };
    const handleConfirmClick = () => {
        console.log('Confirmed');

        setShowLog(false);
        setCurrentMarker(null)
    };

    const handleDenyClick = () => {
        if (currentMarker != null) {
            console.log('Denied');
            currentMarker.remove();
            setCurrentMarker(null);
            setShowLog(false);

        }
    };
    const closeFriendMenu = () => {
        setFriendsVisible(false);
        setSelectedFriend(false);
    }
    const closeProfileMenu = () => {
        setUserDataVisible(false);

    }


    const flyToPinLocation = (longitude, latitude) => {
        // Assuming you have access to the mapboxgl map instance
        // Replace 'map' with your map instance reference.
        map.current.flyTo({ center: [longitude, latitude], zoom: 12 });
    };




    const handleAddFriend = () => {
        if (newFriendName.trim() !== "") {
            const newFriend = {
                id: friendData.length + 1,
                name: newFriendName.trim(),
                pins: [], // Initialize an empty array for each new friend's pins
            };
            setFriendData([...friendData, newFriend]);
            setNewFriendName("");
        }
    };
    return (
        <div className={`menu ${isOpen ? 'open' : ''}`}>
            <div className="button-container">
                <button className="menu-button" onClick={handleUserButtonClick}>
                    <User size={24} />My Profile
                </button>
                <button className="menu-button" onClick={handleFriendsButtonClick}>
                    <Users size={24} />Friend Activity
                </button>
                <hr />
                <button className='menu-button sign-out' onClick={logOut}>
                    <SignOut size={24} />Log out
                </button>
            </div>
            {userDataVisible && (
                <div className="user-data sub-menuProfile">
                    <button className='sub-menuProfile-button' onClick={closeProfileMenu}>
                        <X size={20} />
                    </button>
                    <div className='myprofile'>
                        <User size={24} />My Profile
                    </div>
                    <div className='profileDetails'>
                        <User size={24} />{auth.username}
                    </div>
                    <div className='profileEmail'>
                        <p >{auth.email}</p>
                    </div>
                    <h3>Recent Pins</h3>
                    <ul className='mypins'>
                        {auth.pins.map((pin, index) => (
                            <li key={index}>
                                <button className='gotopin' onClick={() => flyToPinLocation(pin.longitude, pin.latitude) & setIsOpen(false)}>
                                    {pin.title}
                                </button>

                                <div className='userpindescription'>
                                    {pin.description}
                                </div>

                            </li>

                        ))}

                    </ul>
                </div>
            )}
            {friendsVisible && (
                <div className="friends-list sub-menuFriend">
                    <button className='Friends-button' onClick={closeFriendMenu}>
                        <X size={20} />
                    </button>
                    <div className='myfriends'>
                        <Users size={24} /> Friends
                    </div>

                    <ul className='myfriendsList'>
                        {friendData.map((friend) => (
                            <li key={friend.id}>
                                <button className='clickfriend' onClick={() => setSelectedFriend(selectedFriend === friend ? null : friend)}>
                                    {friend.name}
                                </button>
                                {selectedFriend === friend && (
                                    <div >
                                        {friend.pins.map((pin) => (
                                            <div key={pin.id}>
                                                <button className='friendpins'
                                                    onClick={() => {
                                                        flyToPinLocation(pin.location[1], pin.location[0]); // Fly to the pin's location
                                                        setIsOpen(false);// Close the menu
                                                        handleAddPin(pin.location[1], pin.location[0]);
                                                        setSelectedPin(pin);

                                                    }}
                                                >
                                                    {pin.name} - {pin.description}
                                                </button>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className='addfriends'>
                        <input
                            type="text"
                            value={newFriendName}
                            onChange={(e) => setNewFriendName(e.target.value)}
                            placeholder="Enter friend's name"
                        />
                        <button onClick={handleAddFriend}>Add Friend</button>
                    </div>
                </div>
            )}
            {showLog && (
                <div className="userpin-inputs-container">
                    <div className="userpin-inputs">
                        <div>
                            <h2>{selectedFriend.name}'s pin</h2>
                            <p>Title: {selectedPin.name}</p>
                            <p>Description: {selectedPin.description}</p>
                            <button onClick={handleConfirmClick}>Log</button>
                            <button onClick={handleDenyClick}>Deny</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Menu;
