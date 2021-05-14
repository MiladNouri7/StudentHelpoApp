import { Button } from "semantic-ui-react";
import firebase from '../../application/configuration/firebase'

const Sidebar = (props) => {

    const { saveNote, notes, onAddNote, onDeleteNote, activeNote, setActiveNote} = props;
    const user = firebase.auth().currentUser;
    const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);
  
    return (
      <div className="app-sidebar">
        <div className="app-sidebar-header">
          <h1 className="title">Notes</h1>
          <Button onClick={onAddNote} color="blue" floated="right" content="Add Note"/>
          <Button onClick={() => {saveNote(activeNote)}} color="green" floated="right" content="Save"/>
        </div>
        <div className="app-sidebar-notes">
          {sortedNotes.map(({ id, ownerId, title, body, lastModified }) => (
                ownerId === user.uid &&
                <div
                  key={id}
                  className={`app-sidebar-note ${id === activeNote && "active"}`}
                  onClick={() => setActiveNote(id)}
                >
                  <div className="sidebar-note-title">
                    <strong>{title}</strong>
                    <Button onClick={(e) => onDeleteNote(id)} color="red" floated="right" content="Delete"/>
                  </div>
      
                  <p>{body && body.substr(0, 100) + "..."}</p>
                  <small className="note-meta">
                    Last Modified{" "}
                    {new Date(lastModified).toLocaleDateString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  