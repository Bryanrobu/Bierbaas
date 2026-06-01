import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import {auth, provider} from '../../config/firebase.js'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                navigate("/");
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
    }

    function handleGoogleLogin() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
                navigate("/");
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Inloggen</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    E-mailadres
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Wachtwoord
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <button type="submit">Inloggen</button>
            </form>

            <button type="button" onClick={handleGoogleLogin}>Inloggen met Google</button>

            <p>
                Nog geen account?{" "}
                <span onClick={() => navigate("/register")}>Registreer hier</span>
            </p>
        </div>
    );
}
