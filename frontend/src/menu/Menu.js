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

    const [userDataVisible, setUserDataVisible] = useState(false);
    const [friendsVisible, setFriendsVisible] = useState(false);
    const [newFriendName, setNewFriendName] = useState("");
    const [friendData, setFriendData] = useState([
        { id: 1, name: "Alice", location: [-71.0589, 42.3601], pinName: "PinA", description: "Friend A's pin description" },
        { id: 2, name: "Bob", location: [-71.0636, 42.3555], pinName: "PinB", description: "Friend B's pin description" },
        { id: 3, name: "Charlie", location: [-71.0712, 42.3662], pinName: "PinC", description: "Friend C's pin description" }
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
        toggleDisplayFriends(); // Call the function to toggle display of friend pins
    };

    const logOut = () => {
        setIsOpen(false);
        setAuth({});
        setDisplayLogin(true);
    }

    const removeFriendPins = () => {
        if (map.current) {
            friendData.forEach(friend => {
                if (friend.marker) {
                    friend.marker.remove();
                }
            });
            setSelectedPin(null); // Clear the selected pin details if needed
        }
    };

    // Function to display/hide friend pins on the map
    const toggleDisplayFriends = () => {
        if (friendsVisible && map.current) {
            friendData.forEach(friend => {
                if (friend.marker) {
                    friend.marker.remove();
                }
            });
            setSelectedPin(null); // Clear the selected pin details if needed
        } else if (!friendsVisible && map.current) {
            friendData.forEach(friend => {
                const marker = new mapboxgl.Marker({ color: 'red' })
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

    const handleAddFriend = () => {
        if (newFriendName.trim() !== "") {
            const newFriend = {
                id: friendData.length + 1,
                name: newFriendName.trim(),
                location: [], // Set the location as needed
                pinName: "", // Set the pin name as needed
                description: "" // Set the description as needed
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
                <div className="user-data sub-menu">
                    <h2>User Data</h2>
                    <p>Name: {auth.username}</p>
                    <p>Email: {auth.email}</p>
                </div>
            )}
            {friendsVisible && (
                <div className="friends-list sub-menu">
                    <h2>Friends List</h2>
                    <ul>
                        {friendData.map(friend => (
                            <li key={friend.id} onClick={() => setSelectedPin(friend)}>
                                {friend.name}
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
            {selectedPin && (
                <PinDetails
                    pinName={selectedPin.pinName}
                    description={selectedPin.description}
                />
            )}
        </div>
    );
}

export default Menu;
