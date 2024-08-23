const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")


const registerUser = asyncHandler(
    async(req, res) => {
        const {name, email, password} = req.body

        // validation
        if(!name || !email || !password) {
            res.status(400)
            throw new Error ("Please fill all required fields")
        }

        if(password.length < 6) {
            res.status(400)
            throw new Error ("Password must be up to 6 characters ")
        }

        // check if user email already exist
       const userExist = await User.findOne({email})

       if(userExist) {
         res.status(400)
         throw new Error ("Email has been used")
       }
           

        //    create new user
        const user = await User.create({
            name,
            email,
            password,
        })

        if(user) {
            const {_id, name, email, photo, phone, bio} = user
            res.status(201).json({
                _id, name, email, photo, phone, bio
            })
        }

        else {
            res.status(400)
            throw new Error("Invalid User data")
        }
     }
) 

module.exports =  {
    registerUser
}