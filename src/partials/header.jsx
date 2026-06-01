import "./header.css"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../config/firebase.js'

export default function Header(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);

    function handleLogout() {
        signOut(auth).then(() => {
            console.log("Uitgelogd")
        });
    }

    let loginButton;
        if (user) {
            loginButton = <button onClick={handleLogout} className="btn-login">Uitloggen</button>;
        } else {
            loginButton = <button onClick={() => navigate('/login')} className="btn-login">Inloggen</button>;
        }

    return(
        <header className="header">
            <a className="logo" href="/">
                <div className="logo-icon">

                    <span className="logo-dot"></span>
                </div>
                <div className="logo text">
                    <span className="logo-name">Bierbaas</span>
                    <span className="logo-text-under">Proef &amp; Deel</span>
                </div>
            </a>

            {loginButton}
        </header>
    );
}
