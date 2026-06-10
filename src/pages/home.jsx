import {useEffect, useState} from 'react'
import '../App.css'
import {auth, db} from "../../config/firebase.js";
import {collection, deleteDoc, doc, onSnapshot, orderBy, query} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';

export default function Home() {

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);


    async function deletePost(id) {
        try {
            await deleteDoc(doc(db, "posts", id));
        } catch (e) {
            console.error("Fout bij verwijderen: ", e);
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        return onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });
    }, []);

    return <>
        {user && <h2>Hallo {user.displayName}</h2>}
        <h1>Alle posts</h1>
        {posts.map((post) => {
            const postDate = new Date(post.createdAt)
            return (
                <div key={post.id}>
                    <h3>{post.beer}</h3>
                    <p>{"⭐".repeat(post.rating || 0)}</p>
                    <p>{post.message}</p>
                    <p><strong>Datum:</strong> {postDate?.toLocaleDateString() ?? "Onbekend"}</p>
                    <p><strong>Tijd:</strong> {postDate?.toLocaleTimeString() ?? "Onbekend"}</p>
                    {user && user.uid === post.user && (
                        <button onClick={() => deletePost(post.id)}>
                            Verwijder post
                        </button>
                    )}
                </div>
            );
        })}
    </>
}
