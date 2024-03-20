const express = require("express")
const { NoteModel } = require("../model/note.model")
const { auth } = require("../middlewares/auth.middleware")

const noteRouter = express.Router()

//1 /  method: POST
noteRouter.post("/", auth, async(req,res) => {
	try {
		const note = new NoteModel(req.body)
		await note.save()
		res.json({msg: "New Note has been added"})
	} catch(err) {
		res.json({err})
	}
})
//2 /  method: GET
noteRouter.get("/", auth, async(req,res) => {
	try {
		//userid of the user who is making the request (req.body.userID) === userID in the note (userID)
		const notes = await NoteModel.find({userID:req.body.userID})
		res.json({notes})
	} catch(err) {
		res.json({err})
	}
})
//3 /:noteID method: PATCH
noteRouter.patch("/:noteID", auth, async(req,res) => {
	const payload = req.body
	const {noteID} = req.params
	try {
		//userid of the user who is making the request (req.body.userID) === userID in the note (userID)
		const note = await NoteModel.findOne({_id:noteID})
		if (req.body.userID === note.userID) {
			await NoteModel.findByIdAndUpdate({_id:noteID}, payload)
			res.json({msg:`The note with ID:${noteID} has been updated`})
		} else {
			res.json({msg: "You don't have access to update someone else's note"})
		}
	} catch(err) {
		res.json({err})
	}
})
//4 /:noteID method: Delete
noteRouter.delete("/:noteID", auth, async(req,res) => {
	const {noteID} = req.params
	try {
		//userid of the user who is making the request (req.body.userID) === userID in the note (userID)
		const note = await NoteModel.findOne({_id:noteID})
		if (req.body.userID === note.userID) {
			await NoteModel.findByIdAndDelete({_id:noteID})
			res.json({msg:`The note with ID:${noteID} has been deleted`})
		} else {
			res.json({msg: "You don't have access to delete someone else's note"})
		}
	} catch(err) {
		res.json({err})
	}
})


module.exports = {
	noteRouter
}
