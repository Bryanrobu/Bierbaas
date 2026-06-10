import {useEffect, useState} from 'react'
import '../App.css'
import './css/home.css'
import {auth, db} from "../../config/firebase.js";
import {collection, deleteDoc, doc, onSnapshot, orderBy, query} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import {useLocation} from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const [onlyMine, setonlyMine] = useState(location.state?.onlyMine || false);

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
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.beer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="home-page">
      {user && <h2>Hallo {user.displayName}</h2>}

      <div className="home-header">
        <h1>{onlyMine ? "Mijn posts" : "Alle posts"}</h1>
        {user && (
          <button className="filter-button" onClick={() => setonlyMine(!onlyMine)}>
            {onlyMine ? "Toon alle posts" : "Toon mijn posts"}
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Zoek naar een biertje..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredPosts
        .filter((post) => post.publicity === "true" || post.user === user?.uid)
        .filter((post) => !onlyMine || post.user === user?.uid)
        .map((post) => {
          const postDate = new Date(post.createdAt)
          return (
            <div className="post-card" key={post.id}>
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
    </div>
  )
}
