import React, { useContext, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Cookies from 'js-cookie';
import { Warning } from '@phosphor-icons/react';

import { createAccount, login } from '../scripts/api';
import { userModel } from '../scripts/data';
import AuthContext from '../context/AuthProvider';
import MapContext from '../context/MapProvider';
import "./Login.css";

function LoginPopup({ setDisplayLogin, setPopupData, setShowPopup, geolocateControl }) {
    const map = useContext(MapContext);
    const auth = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [validConfirm, setValidConfirm] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const [showCreateAccount, setShowCreateAccount] = useState(false);

    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        const storedEmail = Cookies.get('email');
        const storedPassword = Cookies.get('password');

        if (storedEmail && storedPassword) {
            setEmail(storedEmail);
            setPassword(storedPassword);
            setRememberMe(true)
        }
    }, []);

    useEffect(() => {
        const match = password === confirmPassword;
        setValidConfirm(match);
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrMsg('');
    }, [username, email, password, confirmPassword]);


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
            const response = await login(email, password);
            const data = await response.json()

            if (response.status === 404) {
                setErrMsg(data.detail)
                console.debug("User not found")
            } else if (response.status === 401) {
                setErrMsg(data.detail)
                console.debug("Invalid password")
            } else {
                console.debug(data)
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
                const newAuth = userModel(data.id, data.username, data.email, data.pins, data.friends)
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
            const response = await createAccount(username, email, password);
            const data = await response.json()

            if (response.status === 400) {
                setErrMsg(data.detail)
                console.debug("Email already in use")
            } else {
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

    const togglePopup = () => {
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
