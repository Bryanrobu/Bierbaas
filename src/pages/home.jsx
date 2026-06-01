import {useEffect, useState} from 'react'
import '../App.css'
import {db} from "../../config/firebase.js";
import {collection, deleteDoc, doc, onSnapshot, orderBy, query} from 'firebase/firestore';

export default function Home() {

    const [posts, setPosts] = useState([]);


    async function deletePost(id) {
        try {
            await deleteDoc(doc(db, "posts", id));
        } catch (e) {
            console.error("Fout bij verwijderen: ", e);
        }
    }

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        return onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });
    }, []);

    return <>
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
}
