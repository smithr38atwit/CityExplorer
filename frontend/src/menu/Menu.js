import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { User, Users, SignOut, X, UserCircle, CaretCircleLeft, CaretCircleDown, PushPin } from '@phosphor-icons/react'

import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';
import "./Menu.css";

mapboxgl.accessToken = "pk.eyJ1Ijoic2V2ZXJvbWFyY3VzIiwiYSI6ImNsaHRoOWN0bzAxOXIzZGwxaGl3M2NydGcifQ.xl99wY4570Gg6hh7F7tOxA";

function Menu({ isOpen, setIsOpen, setDisplayLogin, setPopupData, showPopup, setShowPopup }) {
    const { auth, setAuth } = useContext(AuthContext);
    const map = useContext(MapContext);

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [userDataVisible, setUserDataVisible] = useState(false);
    const [friendsVisible, setFriendsVisible] = useState(false);
    const [newFriendName, setNewFriendName] = useState("");
    const [tempMark, setTempMark] = useState(new mapboxgl.Marker())
    const [currentMarker, setCurrentMarker] = useState(null);
    const [isCarrotOpen, setIsCarrotOpen] = useState(false);
    // Test data
    const [friendData, setFriendData] = useState([
        {
            id: 1,
            name: "Josh Gyllinsky",

            pins: [
                {
                    id: 1,
                    title: "My House",
                    description: "New Crip Alert!",
                    location: [43.1939, -71.5724], // New Hampshire coordinates for the first pin
                },
                {
                    id: 2,
                    title: "My favorite restaurant",
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
                    title: "bull riding!",
                    description: "I almost got smoked by a bull here, good time tho",
                    location: [30.2672, -97.7431], // Texas coordinates for the first pin
                },
                {
                    id: 2,
                    title: "First Iphone!",
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
        }
    }, [isOpen]);

    useEffect(() => {
        if (tempMark.getLngLat() && showPopup) {
            tempMark.addTo(map.current);
        }

        return () => {
            tempMark.remove()
            setTempMark(new mapboxgl.Marker())
        }
    }, [showPopup]);


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

    const closeFriendMenu = () => {
        setFriendsVisible(false);
        setSelectedFriend(false);
    }

    const closeProfileMenu = () => {
        setUserDataVisible(false);
    }

    const flyToPinLocation = (longitude, latitude) => {
        map.current.flyTo({ center: [longitude, latitude], zoom: 16 });
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(selectedFriend === friend ? null : friend);
        setIsCarrotOpen(!isCarrotOpen);
    };

    const friendPinClick = (pin) => {
        setTempMark(new mapboxgl.Marker({ color: "blue" }).setLngLat([pin.location[1], pin.location[0]]));
        flyToPinLocation(pin.location[1], pin.location[0]); // Fly to the pin's location
        setIsOpen(false);// Close the menu
        setPopupData({ title: pin.title, address: pin.description, lngLat: [pin.location[1], pin.location[0]], logged: false });
        setShowPopup(true);
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
                    <button className='sub-menuProfile-button' onClick={closeProfileMenu}>
                        <X size={20} />
                    </button>
                    <div className='myprofile'>
                        <User size={24} />My Profile
                    </div>
                    <div className='profileDetails'>
                        <UserCircle size={32} />{auth.username}
                    </div>
                    <div className='profileEmail'>
                        <p >{auth.email}</p>
                    </div>
                    <h3>Recent Pins</h3>
                    <ul className='mypins'>
                        {auth.pins.map((pin, index) => (
                            <li key={index}>
                                <button className='gotopin' onClick={() => flyToPinLocation(pin.longitude, pin.latitude) & setIsOpen(false)}>
                                    <PushPin size={24} />
                                    {pin.title}: {pin.description}
                                </button>
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
                    <div className='addfriends'>
                        <input
                            type="text"
                            value={newFriendName}
                            onChange={(e) => setNewFriendName(e.target.value)}
                            placeholder="Enter friend's name"
                        />
                        <button onClick={handleAddFriend}>Add Friend</button>
                    </div>
                    <ul className='myfriendsList'>
                        {friendData.map((friend) => (
                            <li key={friend.id}>
                                <div>
                                    <button className='FriendButton' onClick={() => handleFriendClick(friend)}>
                                        <User className='friendUserIcon' size={24} />
                                        <span className='friendName'>{friend.name}</span>
                                        {isCarrotOpen ? <CaretCircleDown className="carrot" size={24} /> : <CaretCircleLeft className="carrot" size={24} />}
                                    </button>
                                </div>
                                {selectedFriend === friend && (
                                    <div >
                                        {friend.pins.map((pin) => (
                                            <div key={pin.id}>
                                                <button className='friendpins'
                                                    onClick={() => friendPinClick(pin)}>
                                                    <PushPin size={24} />
                                                    {pin.title}: {pin.description}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Menu;
