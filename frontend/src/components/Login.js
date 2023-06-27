import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWarning, faXmark } from '@fortawesome/free-solid-svg-icons';

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

    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        const match = password === confirmPassword;
        setValidConfirm(match);
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrMsg('');
    }, [username, email, password, confirmPassword]);


    const handleLogin = (e) => {
        e.preventDefault();
        // Perform login logic using loginEmail and loginPassword
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await createAccount(username, email, password);
            const data = await response.json()

            if (response.status === 400) {
                setErrMsg(data.detail)
                console.debug("Email already in use")
            } else {
                setErrMsg('Account could not be created')
                console.debug("Account could not be created")
            }

            console.debug("Account created successfully", data)
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Account could not be created')
                console.debug("Account could not be created", error)
            }
        }
    };

    return (
        <div className="popup-container" style={{ display: displayPopup ? "block" : "none" }}>
            <button className='close-popup' onClick={() => setDisplayPopup(false)}>
                <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </button>
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
                        />
                        <input
                            type="email"
                            id='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='email'
                        />
                        <input
                            type="password"
                            id='password'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='new-password'
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
                        <p>Already have an account? <button type='button' onClick={() => setShowCreateAccount(!showCreateAccount)}>LOG IN</button></p>
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
                        />
                        <input
                            type="password"
                            id='password'
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
                        <p>No account? <button type='button' onClick={() => setShowCreateAccount(!showCreateAccount)}>CREATE ONE</button></p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
