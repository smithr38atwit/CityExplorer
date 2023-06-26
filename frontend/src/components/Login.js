import React, { useState } from 'react';
import { createAccount } from '../scripts/api';
import "./Login.css";

const LoginPopup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });
    const [showCreateAccount, setShowCreateAccount] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Perform login logic using loginEmail and loginPassword
    };

    const handleCreateAccount = (e) => {
        e.preventDefault();
        const response = createAccount(formData.username, formData.email, formData.password);
        if (response.ok) {
            console.debug("Account created successfully")
        } else if (response.status === 400) {
            console.debug("Email already in use")
        } else {
            console.debug("Account could not be created")
        }
    };

    const togglePopup = () => {
        setShowCreateAccount(!showCreateAccount);
    };

    const closePopup = () => {
        document.getElementById("login-popup-container").style.display = 'none';
    };


    return (
        <div id='login-popup-container' className="popup-container">
            {showCreateAccount ? (
                <div id='create-account' className="popup">
                    <p className='close-popup' onClick={closePopup}>X</p>
                    <h2>Create Account</h2>
                    <form onSubmit={handleCreateAccount}>
                        <input
                            type="text"
                            name='username'
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete='username'
                        />
                        <input
                            type="email"
                            name='email'
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete='email'
                        />
                        <input
                            type="password"
                            name='password'
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete='new-password'
                        />
                        <input
                            type="password"
                            name='confirmPassword'
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete='new-password'
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={() => setFormData(prevData => ({ ...prevData, rememberMe: !formData.rememberMe }))}
                            />
                            Remember me
                        </label>
                        <button type="submit">Create Account</button>
                        <p>Already have an account? <button onClick={togglePopup}>LOG IN</button></p>
                    </form>
                </div>
            ) : (
                <div id='login' className="popup">
                    <p className='close-popup' onClick={closePopup}>X</p>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            name='email'
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete='email'
                        />
                        <input
                            type="password"
                            name='password'
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete='current-password'
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={() => setFormData(prevData => ({ ...prevData, rememberMe: !formData.rememberMe }))}
                            />
                            Remember me
                        </label>
                        <button type="submit">Login</button>
                        <p>No account? <button onClick={togglePopup}>CREATE ONE</button></p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
