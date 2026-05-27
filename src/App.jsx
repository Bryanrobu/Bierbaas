    import {useState, useEffect} from 'react'
    import './App.css'
    import {db} from "../config/firebase.js";
    import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
    import { Routes, Route } from 'react-router-dom'

    import Header from "./partials/header.jsx"
    import Footer from "./partials/footer.jsx"
    import Home from "./pages/home.jsx"
    import Review from "./pages/review.jsx"
    import Kaart from "./pages/kaart.jsx"

    function App() {

        const [title, setTitle] = useState("");
        const [message, setMessage] = useState("");

        async function addPost() {
            try {
                const newPost = {
                    title: title,
                    message: message,
                    createdAt: Date.now()
                };

                await addDoc(collection(db, "posts"), newPost);

                console.log("title: ", newPost.title);
                console.log("message: ", newPost.message);

            } catch (e) {
                console.error("Error adding document: ", e);
            }
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
