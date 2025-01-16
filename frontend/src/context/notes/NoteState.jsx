import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:8080";
  const [notes, setNotes] = useState([]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'auth-token': localStorage.getItem('token'),
  });

  // Get all notes
  const getnotes = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token is missing. Redirecting to login...');
      return; // or redirect to login
    }
  
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'auth-token': token,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized access. Token might be expired.');
          // Handle expired token: redirect to login or refresh the token
        }
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }
  
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error('Error fetching notes:', error.message);
    }
  };
  

  // Add a note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, description, tag }),
      });
      if (!response.ok) throw new Error('Failed to add note');
      const note = await response.json();
      setNotes((prevNotes) => [...prevNotes, note]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete note');
      console.log(await response.json());
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ title, description, tag }),
      });
      if (!response.ok) throw new Error('Failed to update note');
      console.log(await response.json());
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? { ...note, title, description, tag } : note
        )
      );
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getnotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
