import {useState, useEffect} from 'react'
import './App.css'
import {db} from "../config/firebase.js";
import { collection, getDocs, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
function App() {

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 1. Maak een query die direct op de database sorteert (desc = descending / nieuwste bovenaan)
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        // 2. Luister naar de query en zet de data direct in de state
        return onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }, []);

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

    async function deletePost(id) {
        try {
            await deleteDoc(doc(db, "posts", id));
        } catch (e) {
            console.error("Fout bij verwijderen: ", e);
        }
    }

        return (

            <>
                <input
                    type="text"
                    placeholder="Post Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Post Bericht"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button onClick={addPost}>
                    Klik om toe te voegen
                </button>

                <h1>Alle posts</h1>
                {posts.map((post) => {
                    const postDate = new Date(post.createdAt)
                    return (
                        <div key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.message}</p>
                            <p><strong>Datum:</strong> {postDate?.toLocaleDateString() ?? "Onbekend"}</p>
                            <p><strong>Tijd:</strong> {postDate?.toLocaleTimeString() ?? "Onbekend"}</p>
                            <button onClick={() => deletePost(post.id)}>
                                Verwijder post
                            </button>
                        </div>
                    );
                })}
            </>
        )
}
    export default App
