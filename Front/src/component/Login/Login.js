import './Login.css';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login ({ userInfo, setUserInfo }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error_message, setErrorMessage] = useState(undefined);

    const sendUsersDetails = async (e) => {
        e.preventDefault();
        try { 
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { username, password });
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
                <h1>Identifiez-vous</h1>
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

                    <p className='error'>
                        {error_message}
                    </p>

                    <button type='submit'>
                        Se connecter
                    </button>

                    {/* <p className="form-input-login">
                        Vous n'avez pas encore de compte ?
                    </p>
                    <Link to='/signup' className='button'>Créer un compte</Link> */}
                </form>
            )}
        </div>
    );
}
