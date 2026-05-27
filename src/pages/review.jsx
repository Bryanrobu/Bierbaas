import {useState} from 'react'
import '../App.css'
import {db} from "../../config/firebase.js";
import { collection, addDoc} from 'firebase/firestore';

export default function Review() {

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

  return <>
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
  </>
}