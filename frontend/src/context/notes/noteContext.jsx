import React, { createContext, useState } from 'react';

const noteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const getnotes = async () => {
    // Simulate fetching notes
    const fetchedNotes = await fetch('http://localhost:8080/api/notes/fetchallnotes'); // Replace with your actual API call
    const json = await fetchedNotes.json();
    setNotes(json);
  };

  return (
    <noteContext.Provider value={{ notes, getnotes }}>
      {children}
    </noteContext.Provider>
  );
};

export default noteContext;
