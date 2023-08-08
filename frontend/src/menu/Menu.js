import { useEffect, useState, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { User, Users, SignOut, X, UserCircle, CaretCircleLeft, CaretCircleDown, PushPin, List, Trophy } from '@phosphor-icons/react'

import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';

import logo from '../assets/logo.svg'
import "./Menu.css";

import { userModel } from '../scripts/data';
import { addFriend } from '../scripts/api';




// Define the Menu component
function Menu({ isOpen, setIsOpen, setDisplayLogin, showPopup }) {
    // Use the AuthContext and MapContext
    const auth = useContext(AuthContext);
    const map = useContext(MapContext);

    // Define state variables for the component
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [userDataVisible, setUserDataVisible] = useState(false);
    const [friendsVisible, setFriendsVisible] = useState(false);
    const [newFriendEmail, setNewFriendEmail] = useState("");
    const [tempMark, setTempMark] = useState(new mapboxgl.Marker())
    const [isCarrotOpen, setIsCarrotOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(true)

    // Test data
    /*
    const [friendData, setFriendData] = useState([
        {
            id: 1,
            username: "Josh Gyllinsky",
            email: "joshg@email.com",

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
            username: "Ryan Smith",
            email: "ryans@email.com",

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
    */

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


    // ---------- Define event handler functions for user actions ----------

    // Master home button (logo click)
    const goHome = () => {
        // Close all menus; open search bar
        setFriendsVisible(false);
        setUserDataVisible(false);
        setIsOpen(false);
        setSearchOpen(true);
    }

    const myProfileClick = () => {
        setUserDataVisible(true);
        setFriendsVisible(false);
        setIsOpen(false);
    };

    const friendActivityClick = () => {
        setFriendsVisible(true);
        setUserDataVisible(false);
        setIsOpen(false);
    };

    const logOut = () => {
        goHome();
        const newAuth = userModel(0, '', '', [], []);
        auth.current = newAuth;
        setDisplayLogin(true);
    }

    const friendClick = (friend) => {
        setSelectedFriend(selectedFriend === friend ? null : friend);
        setIsCarrotOpen(!isCarrotOpen);
    };

    const friendPinClick = (pin) => {
        setSearchOpen(true);
        setFriendsVisible(false);
        pin.marker.getElement().click();
    }

    const addFriendClick = async (e) => {
        e.preventDefault();
        const email = newFriendEmail.trim();
        if (email !== "") {
            try {
                const response = await addFriend(auth.current.id, email);
                const data = await response.json()

                if (response.status === 404) {
                    alert(data.detail)
                    console.debug(data.detail)
                } else {
                    // Handle new friend data
                    const newFriend = userModel(data.id, data.username, data.email, data.pins, data.friends);
                    auth.current.friends.push(newFriend)
                }
            } catch (error) {
                alert("Error adding friend")
                console.debug('Login error: ', error)
            }

            setNewFriendEmail("");
        }
    };


    return (
        <div id='menu-container'>
            <div className='menu-bar'>
                <button id='menu-button' className='open-menu-button' onClick={() => setIsOpen(!isOpen)}>
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
                    <button className="menu-button" onClick={myProfileClick}>
                        <User size={24} />My Profile
                    </button>
                    <button className="menu-button" onClick={friendActivityClick}>
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

                    <div className='leaderboard-header'>
                        <Trophy size={36} />
                        <p className='header'>Leaderboard</p>

                        <label htmlFor="timespan-menu">Pins Visited:</label>
                        <div className="timespan-menu">
                            <select>
                                <option value="7">Past Week</option>
                                <option value="30">Past Month</option>
                                <option value="0">All Time</option>
                            </select>
                        </div>
                    </div>

                    <div className='leaderboard-container'>
                        <div className="leaderboard">
                            <ol>
                                <li>
                                    <p className="leaderboardUser">Ryan Smith</p>
                                    <p className="pinsVisted">24</p>
                                </li>
                                <li>
                                    <p className="leaderboardUser">Marcus Severo</p>
                                    <p className="pinsVisted">14</p>
                                </li>
                                <li>
                                    <p className="leaderboardUser">Peter Paravalos</p>
                                    <p className="pinsVisted">8</p>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div className='myfriends-header'>
                        <Users size={24} /> Friends
                    </div>

                    <form className='addfriends' onSubmit={addFriendClick}>
                        <input
                            type="email"
                            value={newFriendEmail}
                            onChange={(e) => setNewFriendEmail(e.target.value)}
                            placeholder="Enter friend's email"
                        />
                        <button type='submit'>Add Friend</button>
                    </form>
                    <ul className='myfriendsList'>
                        {auth.current.friends.map((friend) => (
                            <li key={friend.id}>
                                <div>
                                    <button className='FriendButton' onClick={() => friendClick(friend)}>
                                        <User className='friendUserIcon' size={24} />
                                        <span className='friendName'>{friend.username}</span>
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
