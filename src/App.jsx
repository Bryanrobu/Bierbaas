import {useState} from 'react'
import './App.css'
import {db} from "../config/firebase.js";
import { collection, getDocs } from 'firebase/firestore';

function App() {

    async function getUsers() {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().isAdmin}`); // doc.data() returns the document's fields as an object
        });
    }
    return (
        <>
            <button onClick={getUsers}>
                Click me for data
            </button>
        </>
    )
}

export default App
