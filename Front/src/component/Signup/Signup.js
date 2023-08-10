import './Signup.css';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup ({ userInfo, setUserInfo }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secretPassword, setSecretPassword] = useState('');
    const [error_message, setErrorMessage] = useState(undefined);

    const sendUsersDetails = async (e) => {
        e.preventDefault();
        try { 
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, { username, password,confirmPassword, secretPassword });
            const data = response.data;
            
            if (data.status === 'success') {
                localStorage.setItem('userInfo', JSON.stringify({
                    userId: data.userId,
                    accessToken: data.access_token,
                    xsrfToken: data.xsrfToken,
                  }));
                navigate("/");
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error);
        }
    };
    
    const handleLogout = () => {
        // Supprimer les informations d'utilisateur dans le state
        setUserInfo(null);
    };

    return (
        <div className='sign_in'>
            <aside>
                <h1>Inscrivez-vous !</h1>
            </aside>

            {userInfo ? (
                <div>
                    <p>Bienvenue {username} !</p>
                    <button onClick={handleLogout}>Déconnexion</button>
                </div>
            ) : (
                <form action='' onSubmit={sendUsersDetails}> 
                    <label htmlFor='username'>Username</label>
                    <input type='text' placeholder='username' id='username'
                        value={username} onChange={(e)=>setUsername(e.target.value)} />

                    <label htmlFor='userPassword'>Password</label>
                    <input type='password' placeholder='*********' id='userPassword'
                        value={password} onChange={(e)=>setPassword(e.target.value)}/>

                    <label htmlFor='confirmPassword'>Confirm password</label>
                    <input type='password' placeholder='*********' id='confirmPassword'
                        value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>

                    <label htmlFor='secretPassword'>Secret Password</label>
                    <input type='password' placeholder='*********' id='secretPassword'
                        value={secretPassword} onChange={(e)=>setSecretPassword(e.target.value)}/>

                    <p className='error'>
                        {error_message}
                    </p>

                    <button type='submit'>
                        S'inscrire
                    </button>

                    <p className="form-input-login">
                        Déja inscrit ?
                    </p>
                    <Link to='/login' className='button'>Se connecter</Link> 
                </form>
            )}
        </div>
    );
}