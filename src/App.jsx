import './App.css'
import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'

import Header from "./partials/header.jsx"
import Footer from "./partials/footer.jsx"
import Home from "./pages/home.jsx"
import Review from "./pages/review.jsx"
import MapPage from "./pages/map.jsx"
import Login from "./pages/login.jsx"
import Register from "./pages/register.jsx"
import AgeVerification from "./Components/AgeCheck.jsx"

function App() {
    const [verified, setVerified] = useState(
        localStorage.getItem('age_verified') === 'true'
    )

    return (<>
        {!verified && <AgeVerification onVerified={() => setVerified(true)} />}

        <Header />
        <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/review" element={<Review />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </main>
        <Footer />
    </>)
}

export default App
