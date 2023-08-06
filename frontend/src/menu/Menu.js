import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { User, Users, SignOut, X, UserCircle, CaretCircleLeft, CaretCircleDown, PushPin, List } from '@phosphor-icons/react'

import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';
import logo from '../assets/logo.svg'
import "./Menu.css";
import { authModel } from '../scripts/data';


function Menu({ isOpen, setIsOpen, setDisplayLogin, setPopupData, showPopup, setShowPopup }) {
    const auth = useContext(AuthContext);
    const map = useContext(MapContext);

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [userDataVisible, setUserDataVisible] = useState(false);
    const [friendsVisible, setFriendsVisible] = useState(false);
    const [newFriendName, setNewFriendName] = useState("");
    const [tempMark, setTempMark] = useState(new mapboxgl.Marker())
    const [isCarrotOpen, setIsCarrotOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(true)

    // Test data
    const [friendData, setFriendData] = useState([
        {
            id: 1,
            name: "Josh Gyllinsky",

            pins: [
                {
                    name: "My House",
                    address: "New Crip Alert!",
                    longitude: -71.5724,
                    latitude: 43.1939, // New Hampshire coordinates for the first pin
                    date_logged: null,
                    thumbs_up: 1,
                    thumbs_down: 0,
                    feature_id: -1
                },
                {
                    name: "My favorite restaurant",
                    address: "Best Burgers here for sure",
                    longitude: -71.5376, // New Hampshire coordinates for the second pin
                    latitude: 43.2081,
                    date_logged: null,
                    thumbs_up: 1,
                    thumbs_down: 0,
                    feature_id: -1
                },
            ],
        },
        {
            id: 2,
            name: "Ryan Smith",

            pins: [
                {
                    name: "bull riding!",
                    address: "I almost got smoked by a bull here, good time tho",
                    longitude: -97.7431, // Texas coordinates for the first pin
                    latitude: 30.2672,
                    date_logged: null,
                    thumbs_up: 1,
                    thumbs_down: 0,
                    feature_id: -1
                },
                {
                    name: "First Iphone!",
                    address: "I got my iphone 2 here!",
                    longitude: -119.4179, // California coordinates for the second pin
                    latitude: 36.7783,
                    date_logged: null,
                    thumbs_up: 1,
                    thumbs_down: 0,
                    feature_id: -1
                },
            ],
        },
    ]);

    // Add temp pin if popup is showing and a temp pin exists; reset the temp pin every time popup changes
    useEffect(() => {
        if (tempMark.getLngLat() && showPopup) {
            tempMark.addTo(map.current);
        }

        return () => {
            tempMark.remove()
            setTempMark(new mapboxgl.Marker())
        }
    }, [showPopup]);

    // Hide search bar if menu or popup are open; otherwise show
    useEffect(() => {
        if (isOpen || userDataVisible || friendsVisible)
            setSearchOpen(false);
        else if (showPopup)
            setSearchOpen(false);
        else
            setSearchOpen(true)
    }, [isOpen, showPopup]);


    const handleUserButtonClick = () => {
        setUserDataVisible(true);
        setFriendsVisible(false);
        setIsOpen(false);
    };

    const handleFriendsButtonClick = () => {
        setFriendsVisible(true);
        setUserDataVisible(false);
        setIsOpen(false);
    };

    const logOut = () => {
        setIsOpen(false);
        const newAuth = authModel(0, '', '', []);
        auth.current = newAuth;
        setDisplayLogin(true);
    }

    const flyToPinLocation = (longitude, latitude) => {
        map.current.flyTo({ center: [longitude, latitude], zoom: 16 });
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(selectedFriend === friend ? null : friend);
        setIsCarrotOpen(!isCarrotOpen);
    };

    const friendPinClick = (pin) => {
        setShowPopup(false);
        setFriendsVisible(false);
        flyToPinLocation(pin.longitude, pin.latitude); // Fly to the pin's location
        setPopupData(pin);
        setTimeout(() => {
            setTempMark(new mapboxgl.Marker({ color: "blue" }).setLngLat([pin.longitude, pin.latitude]));
            setShowPopup(true);
        }, 100);
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

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const goHome = () => {
        setFriendsVisible(false);
        setUserDataVisible(false);
        setIsOpen(false);
        setSearchOpen(true);
    }

    return (
        <div id='menu-container'>
            <div className='menu-bar'>
                <button id='menu-button' className='open-menu-button' onClick={toggleMenu}>
                    {isOpen ? <X size={24} /> : <List size={24} />}
                </button>
                <img src={logo} alt='city explorer logo' onClick={goHome}></img>
            </div>
            <div className={`searchbar ${searchOpen ? '' : 'closed'}`}>
                <div id='geocoder-container'></div>
                <div id='geolocate-container'></div>
            </div>
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
            </div>
            {userDataVisible && (
                <div className="user-data sub-menuProfile">
                    <div className='myprofile'>
                        <User size={24} />My Profile
                    </div>
                    <div className='profileDetails'>
                        <UserCircle size={32} />{auth.current.username}
                    </div>
                    <div className='profileEmail'>
                        <p >{auth.current.email}</p>
                    </div>
                    <h3>Recent Pins</h3>
                    <ul className='mypins'>
                        {auth.current.pins.map((pin, index) => (
                            <li key={index}>
                                <button className='gotopin' onClick={() => {
                                    setSearchOpen(true);
                                    setUserDataVisible(false);
                                    pin.marker.getElement().click();
                                }}>
                                    <PushPin size={24} />
                                    {pin.name}: {pin.address}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {friendsVisible && (
                <div className="friends-list sub-menuFriend">
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
                                            <div key={pin.name}>
                                                <button className='friendpins'
                                                    onClick={() => friendPinClick(pin)}>
                                                    <PushPin size={24} />
                                                    {pin.name}: {pin.address}
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
