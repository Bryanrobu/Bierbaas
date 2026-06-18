import {useEffect, useState} from 'react'
import '../App.css'
import './css/home.css'
import {auth, db} from "../../config/firebase.js";
import {arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, addDoc} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import {useLocation} from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const [onlyMine, setonlyMine] = useState(location.state?.onlyMine || false);

  const [openComments, setOpenComments] = useState({});
  const [comments, setComments]= useState({});
  const [commentText, setCommentsText] = useState({});

  async function deletePost(id) {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (e) {
      console.error("Fout bij verwijderen: ", e);
    }
  }

  async function toggleLike(post){
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    const heeftGeliked = post.likes?.includes(user.uid);

    await updateDoc(postRef, {
      likes: heeftGeliked ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  }

  function toggleComments(postId){
    setOpenComments(prev => {
      const gaatOpen = !prev[postId];

      if (gaatOpen) {
        const q = query(
          collection(db, "posts", postId, "comments"),
          orderBy("createdAt", "asc")
        );
        onSnapshot(q, (snapshot) => { //onsnapshot zorgt dat alleen de comments worden geladen als je ze openklapt zodat niet alles geladen hooft te worden
          setComments(prev => ({
            ...prev,
            [postId]: snapshot.docs.map(d => ({id: d.id, ...d.data()}))
          }));
        });
      }
      return {...prev, [postId]: gaatOpen};
    });
  }

  async function addComment(postId) {
    const tekst = commentText[postId].trim(); //.trim haalt alle spaties aan het begin en eind weg
    if (!tekst || !user) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: tekst,
      user: user.uid,
      displayName: user.displayName,
      createdAt: new Date().toISOString()
    });

    setCommentsText(prev => ({...prev, [postId]: ""}));
  }

  async function deleteComment(postId, commentId) {
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
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

              <button onClick = {() => toggleLike(post)} disabled = {!user}>
                {post.likes?.includes(user?.uid) ? "❤️" : "🤍"} {post.likes?.length ?? 0}
              </button>

              <button onClick={() => toggleComments(post.id)}>
                🗨️ {openComments[post.id] ? "Verberg" : "Comments"}
              </button>

              {openComments[post.id] && (
                <div className='comments-section'>
                  {comments[post.id]?.length == 0 && (
                    <p>Nog geen reacties</p>
                  )}
                  {comments[post.id]?.map(comment => (
                    <div key = {comment.id} className='comment'>
                      <span><strong>{comment.displayName}</strong>: {comment.text}</span>
                      {user?.uid == comment.user && (
                        <button onClick={() => deleteComment(post.id, comment.id)}>🗑️</button>
                      )}
                    </div>
                  ))}

                  {user && (
                    <div className='comment-form'>
                      <input 
                        type="text"
                        placeholder='Laat een reactie achter...'
                        value={commentText[post.id] ?? ""}
                        onChange={(e) => setCommentsText(prev => ({...prev, [post.id]: e.target.value}))}
                      />
                      <button onClick={() => addComment(post.id)}>Verstuur</button>
                    </div>
                  )}
                </div>
              )}
                
            </div>
          );
        })}
    </div>
  )
}
