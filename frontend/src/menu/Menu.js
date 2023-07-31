import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { User, Users, SignOut } from '@phosphor-icons/react'

import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';
import "./Menu.css";

mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";

function Menu({ isOpen, setIsOpen, setDisplayLogin }) {
    const { auth, setAuth } = useContext(AuthContext);
    const map = useContext(MapContext);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [userDataVisible, setUserDataVisible] = useState(false);
    const [friendsVisible, setFriendsVisible] = useState(false);
    const [newFriendName, setNewFriendName] = useState("");
    const [clickedPin, setClickedPin] = useState(null);
    const [selectedPin, setSelectedPin] = useState(null);


    const [friendData, setFriendData] = useState([
        {
            id: 1,
            name: "Alice",
            location: [-71.0589, 42.3601],
            pins: [
                {
                    id: 1,
                    name: "PinA",
                    description: "Friend A's first pin description",
                    location: [43.1939, -71.5724], // New Hampshire coordinates for the first pin
                },
                {
                    id: 2,
                    name: "PinB",
                    description: "Friend A's second pin description",
                    location: [43.2081, -71.5376], // New Hampshire coordinates for the second pin
                },
            ],
        },
    ]);

    useEffect(() => {
        if (!isOpen) {
            // If the menu is closed, remove the friend pins from the map
            removeFriendPins();
            setFriendsVisible(false);
            setUserDataVisible(false);
        }
    }, [isOpen]);


    const handleUserButtonClick = () => {
        setUserDataVisible(!userDataVisible);
        setFriendsVisible(false);
        removeFriendPins();
    };

    const handleFriendsButtonClick = () => {
        setFriendsVisible(!friendsVisible);
        setUserDataVisible(false);
        setClickedPin(null); // Reset clicked pin state
    };

    const logOut = () => {
        setIsOpen(false);
        setAuth({});
        setDisplayLogin(true);
    }

    const removeFriendPins = () => {
        if (map.current) {
            friendData.forEach((friend) => {
                if (friend.marker && friend.pins.indexOf(clickedPin) === -1) { // Check if the friend's pin is not the clicked pin
                    friend.marker.remove();
                }
            });
            setSelectedPin(null); // Clear the selected pin details if needed
        }
    };

    const flyToPinLocation = (longitude, latitude) => {
        // Assuming you have access to the mapboxgl map instance
        // Replace 'map' with your map instance reference.
        map.current.flyTo({ center: [longitude, latitude], zoom: 12 });
    };

    const friendsPin = (longitude, latitude) => {
        const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([longitude, latitude])
            .addTo(map.current);
    }

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
                    <h2>User Data</h2>
                    <p>Name: {auth.username}</p>
                    <p>Email: {auth.email}</p>
                    <h3>Pins:</h3>
                    <ul>
                        {auth.pins.map((pin, index) => (
                            <li key={index}>
                                <button onClick={() => flyToPinLocation(pin.longitude, pin.latitude) & setIsOpen(false)}>
                                    {pin.title}
                                </button>
                                - {pin.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {friendsVisible && (
                <div className="friends-list sub-menuFriend">
                    <h2>Friends List</h2>
                    <ul>
                        {friendData.map((friend) => (
                            <li key={friend.id}>
                                <button onClick={() => setSelectedFriend(selectedFriend === friend ? null : friend)}>
                                    {friend.name}
                                </button>
                                {selectedFriend === friend && (
                                    <div className="friend-pins">
                                        {friend.pins.map((pin) => (
                                            <div key={pin.id}>
                                                <button
                                                    onClick={() => {
                                                        setClickedPin(pin); // Set the clicked pin
                                                        flyToPinLocation(pin.location[1], pin.location[0]); // Fly to the pin's location
                                                        setIsOpen(false);// Close the menu
                                                        friendsPin(pin.location[1], pin.location[0])
                                                    }}
                                                >
                                                    {pin.name}
                                                </button>
                                                {selectedPin === pin && (
                                                    <div className="pin-details">
                                                        <p>{pin.description}</p>
                                                        {/* Add additional details or buttons for each pin as needed */}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newFriendName}
                        onChange={(e) => setNewFriendName(e.target.value)}
                        placeholder="Enter friend's name"
                    />
                    <button onClick={handleAddFriend}>Add Friend</button>
                </div>
            )}

        </div>
    );
}

export default Menu;
