import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const host ="http://localhost:8080"; // Use environment variable for host
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to handle API errors
    const handleError = (error) => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
    };

    // Get all notes
    const getNotes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || "",
                },
            });
            if (!response.ok) throw new Error("Failed to fetch notes");
            const json = await response.json();
            setNotes(json);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    // Add a note
    const addNote = async (title, description, tag) => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/api/notes/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || "",
                },
                body: JSON.stringify({ title, description, tag }),
            });
            if (!response.ok) throw new Error("Failed to add note");
            const note = await response.json();
            setNotes([...notes, note]);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    // Delete a note
    const deleteNote = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || "",
                },
            });
            if (!response.ok) throw new Error("Failed to delete note");
            await response.json(); // Consume response
            setNotes(notes.filter((note) => note._id !== id));
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    // Edit a note
    const editNote = async (id, title, description, tag) => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || "",
                },
                body: JSON.stringify({ title, description, tag }),
            });
            if (!response.ok) throw new Error("Failed to update note");
            const updatedNote = await response.json();

            // Update the note locally
            setNotes(notes.map(note => note._id === id ? updatedNote : note));
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <NoteContext.Provider value={{
            notes,
            addNote,
            deleteNote,
            editNote,
            getNotes,
            loading,
        }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
