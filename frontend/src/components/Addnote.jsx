
import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext'

const Addnote = (props) => {
    const context= useContext(noteContext);
    const {addNote}=context;

    const [note,setNotes]=useState({title:"",description:"", tag:""})
    const handleClick=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNotes({title:"",description:"", tag:""});
        props.showAlert("Upadated succesfully","success")
    }

    const onChange=(e)=>{
         setNotes({...note,[e.target.name]:e.target.value})
    }
  return (
    <div className='container my-4'>
    <h1>Add a note</h1>
    <form className='my-3'>
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChange} value={note.title} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" id="description" name='description' onChange={onChange} value={note.description} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="tag" className="form-label">Tag</label>
    <input type="text" className="form-control" id="tag" name='tag' onChange={onChange} value={note.tag} minLength={3} required/>
  </div>
  <button type="submit" disabled={note.title.length<5 || note.description.length<5} onClick={handleClick}className="btn btn-primary">Add note</button>
</form>
</div>
  )
}

export default Addnote
