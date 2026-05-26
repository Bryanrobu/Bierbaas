import {useState} from 'react'
import './App.css'
import {db} from "../config/firebase.js";
import { collection, getDocs } from 'firebase/firestore';
import { Routes, Route } from 'react-router-dom'

import Header from "./partials/header.jsx"
import Footer from "./partials/footer.jsx"
import Home from "./pages/home.jsx"
import Review from "./pages/review.jsx"
import Kaart from "./pages/kaart.jsx"

function App() {

    async function getUsers() {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().isAdmin}`); // doc.data() returns the document's fields as an object
        });
    }
    return (
        <>
            <Header />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/kaart" element={<Kaart />} />
                </Routes>
            </main>

            <Footer />
        </>
    )
}

export default App
