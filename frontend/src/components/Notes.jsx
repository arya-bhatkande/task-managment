
import React, { useContext,useEffect,useRef,useState} from 'react'
import noteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem';
import Addnote from "./Addnote"
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context= useContext(noteContext);
    let history = useNavigate();
    const {notes,getnotes,editNote}=context;
    useEffect(()=>{
      if(localStorage.getItem('token')){
        getnotes()
      }
      else{
       history("/login")
      }
      
        // eslint-disable-next-line
    },[])
    const ref =useRef(null);
    const refClose =useRef(null);

    
    const [note,setNotes]=useState({id:"",etitle:"",edescription:"",etag:""})

    const updateNote=(currentNote)=>{
           ref.current.click();
           setNotes({id:currentNote._id,etitle:currentNote.title , edescription:currentNote.description,etag:currentNote.tag })
    }
   
    const handleClick=(e)=>{
        editNote(note.id, note.etitle , note.edescription, note.etag)
        refClose.current.click();
        props.showAlert("Upadated succesfully","success")
    }

    const onChange=(e)=>{
         setNotes({...note,[e.target.name]:e.target.value})
    }
  return (
    <>
    <Addnote showAlert={props.showAlert}/>
    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>
<div className="modal fade" id="exampleModal" tabIndex="-1"  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <form className='my-3'>
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="tag" className="form-label">Tag</label>
    <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange}/>
  </div>
</form>
      </div>
      <div className="modal-footer">
        <button ref={refClose}reftype="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
      </div>
    </div>
  </div>
</div>
    <div className='row my-3'>
    <h1>your notes</h1>
    <div className='container'>
     {notes.length===0 && 'No notes to display '}
    </div>
    {notes.map((note)=>{
      return <NoteItem key ={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert}/>
    })}
    </div>
    </>
  )
}

export default Notes
