import React, { useContext, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Cookies from 'js-cookie';
import { Warning } from '@phosphor-icons/react';

import { createAccount, login } from '../scripts/api';
import { pinModel, userModel } from '../scripts/data';
import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';

import "./Login.css";

// Function component for LoginPopup
function LoginPopup({ setDisplayLogin, setPopupData, setShowPopup, geolocateControl }) {
    // Get the map and authentication context
    const map = useContext(MapContext);
    const auth = useContext(AuthContext);

    // State variables to manage form inputs and validation
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [validConfirm, setValidConfirm] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [errMsg, setErrMsg] = useState('');


    // Load stored email and password from cookies if available
    useEffect(() => {
        const storedEmail = Cookies.get('email');
        const storedPassword = Cookies.get('password');

        if (storedEmail && storedPassword) {
            setEmail(storedEmail);
            setPassword(storedPassword);
            setRememberMe(true)
        }
    }, []);

    // Check if the password and confirm password match
    useEffect(() => {
        const match = password === confirmPassword;
        setValidConfirm(match);
    }, [password, confirmPassword]);

    // Clear error message when any of the form inputs change
    useEffect(() => {
        setErrMsg('');
    }, [username, email, password, confirmPassword]);


    // Function to handle login process
    const handleLogin = async (e) => {
        e.preventDefault();
        if (rememberMe) {
            // Store the login credentials in cookies
            Cookies.set('email', email, { expires: 7 }); // Cookie expires in 7 days
            Cookies.set('password', password, { expires: 7 });
        } else {
            Cookies.remove('email');
            Cookies.remove('password');
        }

        try {
            // Make API call to login with provided email and password
            const response = await login(email, password);
            const data = await response.json()

            // Handle different response statuses
            if (response.status === 404) {
                setErrMsg(data.detail)
                console.debug("User not found")
            } else if (response.status === 401) {
                setErrMsg(data.detail)
                console.debug("Invalid password")
            } else {
                // Handle successful login
                console.debug(data)
                // Add pins to the map for the user and their friends
                // Set the new authenticated user in the context
                // Hide the login popup and trigger the geolocation control
                for (const pin of data.pins) {
                    // create marker
                    const marker = new mapboxgl.Marker({ color: 'red' })
                        .setLngLat([pin.longitude, pin.latitude])
                        .addTo(map.current);
                    marker.getElement().addEventListener('click', () => {
                        setShowPopup(false);
                        map.current.flyTo({
                            center: [pin.longitude, pin.latitude],
                            zoom: 16
                        });
                        setTimeout(() => {
                            setPopupData(pin);
                            setShowPopup(true);
                        }, 100);
                    });

                    marker.addTo(map.current);
                    pin.marker = marker;
                }
                let newFriends = []
                for (const friend of data.friends) {
                    let newPins = []
                    for (const pin of friend.pins) {
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
                    newFriends.push({ ...friend, pins: newPins });
                }
                const newAuth = userModel(data.id, data.username, data.email, data.pins, newFriends)
                auth.current = newAuth;
                setDisplayLogin(false);
                console.debug("Successfully logged in");
                geolocateControl.trigger();
                // console.debug(data);
            }
        } catch (error) {
            setErrMsg('Error with login');
            console.debug('Login error: ', error)
            const newAuth = userModel(0, '', '', [], []);
            auth.current = newAuth;
        }
    };

    // Function to handle account creation process
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (rememberMe) {
            // Store the login credentials in cookies
            Cookies.set('email', email, { expires: 7 }); // Cookie expires in 7 days
            Cookies.set('password', password, { expires: 7 });
        } else {
            Cookies.remove('email');
            Cookies.remove('password');
        }

        try {
            // Make API call to create a new account with provided details
            const response = await createAccount(username, email, password);
            const data = await response.json()

            // Handle different response statuses
            if (response.status === 400) {
                setErrMsg(data.detail)
                console.debug("Email already in use")
            } else {
                // Handle successful account creation
                // Create a new authenticated user model with the returned data
                // Hide the login popup and trigger the geolocation control
                const newAuth = userModel(data.id, data.username, data.email, data.pins, data.friends);
                auth.current = newAuth;
                setDisplayLogin(false);
                console.debug("Account created successfully");
                geolocateControl.trigger();
            }
        } catch (error) {
            setErrMsg('Error with login');
            console.debug('Login error: ', error)
        }
    };

    // Function to toggle between login and create account forms
    const togglePopup = () => {
        // Clear form inputs and switch between login and create account forms
        setUsername('');
        setEmail('')
        setPassword('');
        setConfirmPassword('');
        setRememberMe(false);
        setShowCreateAccount(!showCreateAccount);
    }

    return (
        <div className="popup-container">
            <p className='errMsg' style={{ display: errMsg ? 'block' : 'none' }}>{errMsg}</p>
            {showCreateAccount ? (
                <div id='create-account' className="popup">
                    <h2>Create Account</h2>
                    <form onSubmit={handleCreateAccount}>
                        <input
                            type="text"
                            id='username'
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete='username'
                            autoFocus
                            className='input-box'
                        />
                        <input
                            type="email"
                            id='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='email'
                            className='input-box'
                        />
                        <input
                            type="password"
                            id='password'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='new-password'
                            className='input-box'
                        />
                        <input
                            type="password"
                            id='confirmPassword'
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete='new-password'
                            onFocus={() => setConfirmFocus(true)}
                            onBlur={() => setConfirmFocus(false)}
                            className='input-box'
                        />
                        <p className='confirmnote' style={{ display: confirmFocus && !validConfirm ? 'flex' : 'none' }}>
                            <Warning weight='fill' /><span>Passwords must match</span>
                        </p>
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember me
                        </label>
                        <button type="submit" disabled={!validConfirm}>Create Account</button>
                        <p className='switch-form'>Already have an account? <button type='button' onClick={togglePopup}>Log In</button></p>
                    </form>
                </div>
            ) : (
                <div id='login' className="popup">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            id='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='email'
                            autoFocus
                            className='input-box'
                        />
                        <input
                            type="password"
                            id='password'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='current-password'
                            className='input-box'
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember me
                        </label>
                        <button type="submit">Log In</button>
                        <p className='switch-form'>No account? <button type='button' onClick={togglePopup}>Create One</button></p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
