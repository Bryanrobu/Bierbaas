import {useState, useEffect} from 'react'
import './App.css'
import {db} from "../config/firebase.js";
import { collection, getDocs, addDoc, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
function App() {

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const allPosts = onSnapshot(collection(db, "posts"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setPosts(data);
        });

        return () => allPosts();
    }, []);

    async function getUsers() {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().isAdmin}`); // doc.data() returns the document's fields as an object
        });
    }

    async function addPost() {
        try {
            const newPost = {
                title: title,
                message: message,
                createdAt: serverTimestamp(),
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
                    const postDate = post.createdAt?.toDate
                        ? post.createdAt.toDate()
                        : post.createdAt ? new Date(post.createdAt) : null;

                    return (
                        <div key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.message}</p>
                            <p><strong>Datum:</strong> {postDate ? postDate.toLocaleDateString() : "Onbekend"}</p>
                            <p><strong>Tijd:</strong> {postDate ? postDate.toLocaleTimeString() : "Onbekend"}</p>
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
