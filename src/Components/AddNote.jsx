import React, {useContext,useState} from 'react'
import noteContext from "../context/notes/noteContext"

const AddNote = () => {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note,setNote] = useState({title:"",description:"",tag:""})
    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title:"",description:"",tag:""})
    }

    const onchange = (e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }
  return (
    <div className='container'>
        <form className='my-4'>
                <h3>Add a Note</h3>
                <div className="mb-3 my-4">
                    <label htmlFor="title" className="form-label">Note Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="title" value={note.title} onChange={onchange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" aria-describedby="description" value={note.description} onChange={onchange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label" >Give it a Tag ! e.g : Urgent,Personal etc</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onchange} minLength={5} required/>
                </div>
                <button disabled={note.title.length<5 || note.description.length<5}type="submit" className="btn btn-success"  onClick={handleClick}>Add Note</button>
            </form>

      
    </div>
  )
}

export default AddNote
