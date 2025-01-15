const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes')

//ROUTE 1:Get all the notes:POST"/api/notes/fetchallnotes" login required
router.get('/fetchallnotes' ,fetchuser,async(req,res)=>{
    try {
        const notes= await Notes.find({user:req.user.id});
        res.json(notes)  
    } catch (error) {
            console.error(error.message)
            res.status(500).send("Internal serval error")
    }
   
})

//ROUTE 2:Add new note using post:POST"/api/notes/addnote" login required
router.post('/addnote' ,fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','description must be atleast 5 character').isLength({min:5})
],async(req,res)=>{
    try {
  
    const {title,description,tag,}=req.body;
    //If there are errors , retuen bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const note = new Notes({
  title,description,tag,user:req.user.id
    })
    const saveNote=await note.save()
  
    res.json(saveNote)  
          
} catch (error) {
        console.error(error.message)
        res.status(500).send("Internal serval error")
}
})

//ROUTE 3:update a note using :PUT"/api/notes/updatenote " login required
router.put('/updatenote/:id' ,fetchuser,async(req,res)=>{
 const {title,description,tag,}=req.body;
 try {
 //Create new note object
 const newNote={};
 if(title){newNote.title=title};
 if(description){newNote.description=description};
 if(tag){newNote.tag=tag};

 //Find a note to be updated
 let note =await Notes.findById(req.params.id)
 if(!note){return res.status(404).send("Not Found")}

 if(note.user.toString() !==req.user.id){
    return res.status(401).send("Not Allowed")
 }

 note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
 res.json({note})
}catch (error) {
    console.error(error.message)
    res.status(500).send("Internal serval error")
 }
})


//ROUTE 4:deleting a note using :DELETE"/api/notes/deletenote " login required
router.delete('/deletenote/:id' ,fetchuser,async(req,res)=>{ 
   try {
    //Find a note to be deleted
    let note =await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Not Found")}
   
    //allow deletion only if user owns this note
    if(note.user.toString() !==req.user.id){
       return res.status(401).send("Not Allowed")
    }
   
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({'success':'note has been deleted',note:note})

} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal serval error")
}
})
module.exports = router
