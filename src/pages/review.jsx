import {useEffect, useState} from 'react'
import '../App.css'
import './css/review.css'
import {auth, db} from "../../config/firebase.js";
import {addDoc, collection} from 'firebase/firestore';
import BeerAutocomplete from '../Components/BeerAutocomplete.jsx';
import {onAuthStateChanged} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Review() {
    const [beer, setBeer] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [rating, setRating] = useState(0);
    const [user, setUser] = useState("")
    const [loading, setLoading] = useState(true);
    const [publicity, setPublicity] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    async function getCoordinatesFromAddress(searchAddress) {
        try {
            const response = await fetch(`https://eu1.locationiq.com/v1/search?key=pk.f7af2e73cb91925d60f1da88cf0f6715&format=json&q=${encodeURIComponent(searchAddress)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon)
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Fout bij ophalen coördinaten:", error);
            return null;
        }
    }

    async function addPost() {
        if (!beer || !message || !street || !city || !rating || publicity == null) {
            alert("Vul a.u.b. alle velden in!");
            return;
        }

        setIsSubmitting(true);
        try {
            const fullAddressQuery = `${street}, ${city}`;
            const coordinates = await getCoordinatesFromAddress(fullAddressQuery);

            if (!coordinates) {
                alert("We konden dit adres niet vinden. Probeer het specifieker in te voeren (bijv. straat, huisnummer, stad).");
                setIsSubmitting(false);
                return;
            }

            const newPost = {
                beer: beer,
                message: message,
                fullAddress: fullAddressQuery,
                location: coordinates,
                createdAt: Date.now(),
                rating: rating,
                user: user.uid,
                publicity: publicity
            };

            await addDoc(collection(db, "posts"), newPost);

            setBeer("");
            setMessage("");
            setStreet("");
            setCity("");
            setRating(0);
            setPublicity(null)

        } catch (e) {
            console.error("Fout bij toevoegen document: ", e);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="review-page">
            <div className="review-form">
                <h1 className="review-title">Nieuwe review</h1>

                <BeerAutocomplete
                    value={beer}
                    onSelect={(selected) => setBeer(selected)}
                />

                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value="0">Kies een rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>

                <textarea
                    className="review-message"
                    placeholder="Post Bericht"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Straat en huisnummer (bijv. Dam 1)"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Woonplaats (bijv. Amsterdam)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <select value={publicity} onChange={(e) => setPublicity(e.target.value)}>
                    <option>Openbaar of privé?</option>
                    <option value={true}>Openbaar</option>
                    <option value={false}>Prive</option>
                </select>

                <button className="review-button" onClick={addPost} disabled={isSubmitting}>
                    {isSubmitting ? "Laden..." : "Klik om toe te voegen"}
                </button>
            </div>
        </div>
    );
}