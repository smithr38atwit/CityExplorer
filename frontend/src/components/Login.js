import React, { useState } from 'react';
import { createAccount } from '../scripts/api';
import "./Login.css";

const LoginPopup = () => {
    const [formData, setFormData] = useState({
        name: '',
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
        const response = createAccount(formData.name, formData.email, formData.password);
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
        document.getElementsByClassName("popup-container")[0].style.display = 'none';
    }

    return (
        <div className="popup-container">
            {showCreateAccount ? (
                <div id='create-account' className="popup">
                    <p className='close-popup' onClick={closePopup}>X</p>
                    <h2>Create Account</h2>
                    <form onSubmit={handleCreateAccount}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
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
                        <p>Already have an account? <a href='#login' onClick={togglePopup}>LOG IN</a></p>
                    </form>
                </div>
            ) : (
                <div id='login' className="popup">
                    <p className='close-popup' onClick={closePopup}>X</p>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
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
                        <p>No account? <a href='#create-account' onClick={togglePopup}>CREATE ONE</a></p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
