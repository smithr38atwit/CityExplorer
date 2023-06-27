import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWarning } from '@fortawesome/free-solid-svg-icons';

import { createAccount } from '../scripts/api';
import "./Login.css";

function LoginPopup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [validConfirm, setValidConfirm] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [displayPopup, setDisplayPopup] = useState(true);


    useEffect(() => {
        const match = password === confirmPassword;
        setValidConfirm(match);
    }, [password, confirmPassword]);


    const handleLogin = (e) => {
        e.preventDefault();
        // Perform login logic using loginEmail and loginPassword
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await createAccount(username, email, password);
            if (response.ok) {
                console.debug("Account created successfully")
                setDisplayPopup(false);
            } else if (response.status === 400) {
                console.debug("Email already in use")
            } else {
                console.debug("Account could not be created")
            }
        } catch (error) {

        }
    };

    const togglePopup = () => {
        setShowCreateAccount(!showCreateAccount);
    };

    return (
        <div className="popup-container" style={{ display: displayPopup ? "block" : "none" }}>
            {showCreateAccount ? (
                <div id='create-account' className="popup">
                    <p className='close-popup' onClick={() => setDisplayPopup(false)}>X</p>
                    <h2>Create Account</h2>
                    <form onSubmit={handleCreateAccount}>
                        <input
                            type="text"
                            name='username'
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete='username'
                        />
                        <input
                            type="email"
                            name='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='email'
                        />
                        <input
                            type="password"
                            name='password'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='new-password'
                        />
                        <input
                            type="password"
                            name='confirmPassword'
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete='new-password'
                            onFocus={() => setConfirmFocus(true)}
                            onBlur={() => setConfirmFocus(false)}
                        />
                        <p className='confirmnote' style={{ display: confirmFocus && !validConfirm ? 'flex' : 'none' }}>
                            <FontAwesomeIcon icon={faWarning} /><span>Passwords must match</span>
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
                        <p>Already have an account? <button onClick={togglePopup}>LOG IN</button></p>
                    </form>
                </div>
            ) : (
                <div id='login' className="popup">
                    <p className='close-popup' onClick={() => setDisplayPopup(false)}>X</p>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            name='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='email'
                        />
                        <input
                            type="password"
                            name='password'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='current-password'
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember me
                        </label>
                        <button type="submit" disabled={!validConfirm}>Login</button>
                        <p>No account? <button onClick={togglePopup}>CREATE ONE</button></p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
