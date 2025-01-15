import React,{useContext} from 'react'
import noteContext from '../context/notes/noteContext'

const NoteItem = (props) => {
    const context= useContext(noteContext);
    const {deleteNote}=context;
    const {note,updateNote}=props;
  return (
    <div className='col-md-3'>
      <div className="card my-3">
  <div className="card-body">
    <div className='d-flex mb-3 bd-highlight'>
   <div className='me-auto p-2 bd-highlight'> <h5 className="card-title">{note.title}</h5></div>
    < div className='p-2 bd-highlight' ><i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id); props.showAlert("Deleted successfully","success")}}></i></div>
    <div className='p-2 bd-highlight'><i className="fa-regular fa-pen-to-square mx-2" onClick={()=>{updateNote(note);}}></i></div>
    </div>
    <p className="card-text">{note.description}</p>
   
  </div>
</div>
    </div>
  )
}

export default NoteItem
