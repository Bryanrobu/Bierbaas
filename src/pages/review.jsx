import {useState} from 'react'
import '../App.css'
import './css/review.css'
import {db} from "../../config/firebase.js";
import {addDoc, collection} from 'firebase/firestore';
import BeerAutocomplete from '../Components/BeerAutocomplete.jsx';

export default function Review() {
    const [beer, setBeer] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");

    async function getCoordinatesFromAddress(searchAddress) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`);
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
        if (!beer || !message || !street || !city) {
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
                createdAt: Date.now()
            };

            await addDoc(collection(db, "posts"), newPost);

            setBeer("");
            setMessage("");
            setStreet("");
            setCity("");

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

                <button className="review-button" onClick={addPost} disabled={isSubmitting}>
                    {isSubmitting ? "Laden..." : "Klik om toe te voegen"}
                </button>
            </div>
        </div>
    );
}