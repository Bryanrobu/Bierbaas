import './App.css'
import {Route, Routes} from 'react-router-dom'

import Header from "./partials/header.jsx"
import Footer from "./partials/footer.jsx"
import Home from "./pages/home.jsx"
import Review from "./pages/review.jsx"
import Kaart from "./pages/kaart.jsx"
import Login from "./pages/login.jsx"
import Register from "./pages/register.jsx"

function App() {
    return (<>
        <Header/>
        <main>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/review" element={<Review/>}/>
                <Route path="/kaart" element={<Kaart/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </main>

        <Footer/>
    </>)
}

export default App
