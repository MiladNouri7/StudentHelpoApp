import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./notestyle.css";
import Note from "./Note";
import Sidebar from "./Sidebar";
import { addNotesToFs, deleteNotesFromFs, saveNotesIntoFs } from "../../application/firebase/firestoreService";
import { toast } from "react-toastify";
import firebase from '../../application/configuration/firebase'

const Main = () => {

    const database = firebase.firestore();

    const [notes, setNotes] = useState([]);
    
    useEffect(() => {
        database.collection("notes").orderBy("lastModified", "desc").onSnapshot(snapshot => (
            setNotes(snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    title: doc.data().title,
                    body: doc.data().body,
                    ownerId: doc.data().ownerId,
                    lastModified: doc.data().lastModified,
                }
            )))
        ));
    }, [database])


  const [activeNote, setActiveNote] = useState(false);

  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);

    try{
        addNotesToFs(newNote);
    }catch(error){
        toast.error(error.message);
    }
  };


  const saveNote = (noteId) => {
    try{
        notes.forEach(function(note){
            if(note.id === noteId){
                saveNotesIntoFs(note);
                toast.success("Saved Succcessfully");
            }
        });
    }catch(error){
        toast.error(error.message);
    }
  };

  const onDeleteNote = (noteId) => {
    try{
        deleteNotesFromFs(noteId);
    }catch(error){
        toast.error(error.message);
    }
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }
      return note;
    });

    setNotes(updatedNotesArr);
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <div className="App">
      <Sidebar
        saveNote={saveNote}
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Note activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default Main;
