import "./header.css"

export default function Header(){
    return(
        <header className="header">
            <a className="logo" href="#">
                <div className="logo-icon">

                    <span className="logo-dot"></span>
                </div>
                <div className="logo text">
                    <span className="logo-name">Bierbaas</span>
                    <span className="logo-text-under">Proef &amp; Deel</span>
                </div>
            </a>

            <button className="btn-login">Inloggen</button>
        </header>
    );
}