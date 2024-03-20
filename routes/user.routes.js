const express = require("express")
const { UserModel } = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userRouter = express.Router()

userRouter.post("/register", (req,res) => {
	const { username, email, pass } = req.body
	try {
		bcrypt.hash(pass, 5, async(err, hash) => {
			if (err) {
				res.json({err})
			} else {
				const user = new UserModel({username, email, pass:hash})
				await user.save()
				res.json({msg:"A new user has been resgistered!"})
			} 
		})
	} catch(err) {
		res.json({err})
	}
})

userRouter.post("/login", async(req,res) => {
	const { email, pass } = req.body
	try {
		const user = await UserModel.findOne({email})
		bcrypt.compare(pass, user.pass, (err, result) => {
			if (result) {
				const token = jwt.sign({userID:user._id, username:user.username},"masai")
				res.json({msg:"Login Successful",token})
			} else {
				res.json({err})
			}
		})
	} catch(err) {
		res.json({err})
	}
})

module.exports = {
	userRouter
}

