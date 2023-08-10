import { useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { User, Users, SignOut, X, UserCircle, CaretCircleLeft, CaretCircleDown, PushPin, List, Trophy, MinusCircle } from '@phosphor-icons/react'

import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';

import logo from '../assets/logo.svg'
import "./Menu.css";

import { userModel } from '../scripts/data';
import { addFriend, removeFriend } from '../scripts/api';




// Define the Menu component
function Menu({ isOpen, setIsOpen, showPopup, setShowPopup, setPopupData }) {
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
    const [timespan, setTimespan] = useState('This Month'); // State to keep track of the selected timespan

    // Test data
    const scoreData = [
        {
            user: 'Peter P',
            scores: [
                { month: 'January', score: 35 },
                { month: 'February', score: 43 },
            ],
        },
        {
            user: 'Ryan',
            scores: [
                { month: 'January', score: 12 },
                { month: 'February', score: 5 },
            ],
        },
        {
            user: 'Marcus',
            scores: [
                { month: 'January', score: 20 },
                { month: 'February', score: 18 },
            ],
        },
        {
            user: 'Josh',
            scores: [
                { month: 'January', score: 3 },
                { month: 'February', score: 900 },
            ],
        },
    ];

    const handleChangeTimespan = (event) => {
        setTimespan(event.target.value); // Update the selected timespan when dropdown changes
    };
    const filteredScores = timespan === 'This Month' ?
        scoreData.map(user => ({ user: user.user, score: user.scores[0].score })) :
        scoreData.map(user => ({ user: user.user, score: user.scores.reduce((total, entry) => total + entry.score, 0) }));
    filteredScores.sort((a, b) => b.score - a.score);


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
        window.location.reload();
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
                const data = await response.json();

                if (response.status === 404) {
                    alert(data.detail)
                    console.error(data.detail)
                } else {
                    // Handle new friend data
                    // Add new friend's marker to map
                    let newPins = []
                    const newFriend = userModel(data.id, data.username, data.email, data.pins, []);
                    for (const pin of newFriend.pins) {
                        const marker = new mapboxgl.Marker({ color: 'Blue' })
                            .setLngLat([pin.longitude, pin.latitude])
                            .addTo(map.current);
                        marker.getElement().addEventListener('click', () => {
                            setShowPopup(false);
                            map.current.flyTo({
                                center: [pin.longitude, pin.latitude],
                                zoom: 16
                            });
                            setTimeout(() => {
                                setPopupData({ ...pin, date_logged: null });
                                setShowPopup(true);
                            }, 100);
                        });

                        marker.addTo(map.current);
                        pin.marker = marker;

                        newPins.push({ ...pin, date_logged: null });
                    }

                    // Add new friend to user session data
                    newFriend.pins = newPins;
                    auth.current.friends.push(newFriend);
                }
            } catch (error) {
                alert("Error adding friend")
                console.error('Add friend error: ', error)
            }

            setNewFriendEmail("");
        }
    };

    const removeFriendClick = async (email) => {
        try {
            const response = await removeFriend(auth.current.id, email);

            if (response.status !== 204) {
                const data = await response.json();
                alert(data.detail)
                console.error(data.detail)
            } else {
                // Remove friends markers from map
                const friend = auth.current.friends.find((friend) => friend.email === email);
                for (const pin of friend.pins) {
                    pin.marker.remove();
                }

                // Remove friend from user session
                const newFriends = auth.current.friends.filter((friend) => friend.email !== email);
                auth.current.friends = newFriends;
                setSelectedFriend(null);
                setIsCarrotOpen(false);
            }
        } catch (error) {
            alert("Error removing friend")
            console.error('Remove friend error: ', error)
        }
    }


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
                            <select onChange={handleChangeTimespan} value={timespan}>
                                <option value="This Month">This Month</option>
                                <option value="All Time">All Time</option>
                            </select>
                        </div>
                    </div>

                    <div className='leaderboard-container'>
                        <div className="leaderboard">
                            <ol>
                                {filteredScores.map(({ user, score }) => (
                                    <li key={user}>
                                        <p className="leaderboardUser">{user}</p>
                                        <p className="pinsVisted">{score}</p>
                                    </li>
                                ))}
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
                                <div className='friend-container'>
                                    {selectedFriend === friend && (
                                        <button className='remove-friend' onClick={() => removeFriendClick(friend.email)}><MinusCircle size={20} /></button>
                                    )}
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
