const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Token =  require("../models/tokenModel")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

// Register User

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
        
        //Generate Token
        const  token = generateToken(user._id)

        //Send HTTP-only cookie 
        res.cookie("token", token, {
            path:"/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),  // 1 day
            secure: true,
            sameSite: "none"
        })
        if(user) {
            const {_id, name, email, photo, phone, bio} = 
            res.status(201).json({
                _id, name, email, photo, phone, bio, token
            })
        }

        else {
            res.status(400)
            throw new Error("Invalid User data")
        }
     }
) 


// Login User

const  loginUser = asyncHandler(
    async(req, res ) => {
        const {email, password} = req.body

        // validate Request
        if(!email  || !password) {
            res.status(400)
            throw new Error("Please Add email and pasword")
        }

        // check if user exists

        const user = await User.findOne({email})
        if (!user) {
            throw new Error("User not found, Please sign up")
        }
        
        //  User exists check if password is correct
        
        const passwordIsCorrect = await bcrypt.compare(password, user.password)
        
        //Send HTTP-only cookie 
        
        const  token = generateToken(user._id)
        if(passwordIsCorrect) {
            
            res.cookie("token", token, {
                path:"/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400),  // 1 day
                secure: true,
                sameSite: "none"
            })
        }


        if ( user && passwordIsCorrect) {
            const {_id, name, email, photo, phone, bio} = user
            res.status(201).json({
                _id, name, email, photo, phone, bio, token
            })
        }
        else {
            throw new Error("Invalid Credentials")
        }
    }
)

const logOutUser = asyncHandler(
    async( req, res) => {
        // expire the cookie time
        res.cookie("token", "", {
            path:"/",
            httpOnly: true,
            expires: new Date(0),  // 1 day
            secure: true,
            sameSite: "none"
        })

        return res.status(200).json({message: "Successfully Logged Out"})
    }
)

const getUser = asyncHandler(
    async(req, res) => {
        const user = await User.findById(req.user._id)

        if(user) {
            const {_id, name, email, photo, phone, bio} = user
            res.status(201).json({
                _id, name, email, photo, phone, bio,
            })
        } else {
            res.status(400);
            throw new Error("User not found")
        }
    }
)

const loginStatus = asyncHandler(
    async (req, res) => {
        const token = req.cookies.token;

        if(!token) {
            return res.json(false)
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)

        if(verified) {
            return res.json(true)
        }
        return res.json(false)


    }
)

const updateUser = asyncHandler(
    async(req, res) => {
        const user = await User.findById(req.user._id)

        if(user) {
            const { name, email, photo, phone, bio} = user

            user.email = email;
            user.name = req.body.name || name;
            user.phone = req.body.phone || phone;
            user.bio = req.body.bio || bio;
            user.photo = req.body.photo || photo;

            const updatedUser = await user.save()

            res.status(200).json({
                _id: updatedUser._id, 
                name: updatedUser.name,
                email: updatedUser.email,
                photo: updatedUser.photo, 
                phone: updatedUser.phone,
                bio: updatedUser.bio,
            })

        } else {
            res.status(404)
            throw new Error("User not found")
        }
    }
)

const changePassword = asyncHandler(
    async(req,res) => {

        const user = await User.findById(req.user._id)

        const {oldPassword, password} = req.body

        if(!user) {
            res.status(400)
            throw new Error( "User not found, please sign up")
        }

        // validate
        if(!oldPassword || !password){
            res.status(400)
            throw new Error("Please add old and new password")
        }

        // Check if passowrd matches password in DB

        const passwordisCorrect = await bcrypt.compare(oldPassword,user.password)

        // save new password
        if(user && passwordisCorrect) {
            user.password = password
            await user.save()
            res.status(200).send("password change successful")
        } else {
            res.status(400)
            throw new Error("Olp password is not correct")
        }

        
    }
)

const forgotPassword = asyncHandler(
    async (req,res) => {
         const {email} = req.body

         const user = await User.findOne({ email })

         if(!user) {
            res.status(404)
            throw new Error("User does not exist")
         }

        //  delete token if it exist in the db
        let token = await Token.findOne({userId: user._id})
        if(token) {
            await token.deleteOne()
        }
        //  Ceate Reset  Token
        let resetToken = crypto.randomBytes(32).toString("hex") + user._id

        // hash token before saving to DB
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // save to db

        await new Token({
            userId: user._id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 + (60 * 1000) //thirty minutes
        }).save()

        // construct  Reset URL
        const resetURL = `${process.env.WEB_URL}/resetpassword/${resetToken}`

        //  Reset Email 
        const message = ` 
        <h2>${user.name} </h2>
        <p> Please use the url below to reset your password</p>
        <a href=${resetURL} clicktracking=off> ${resetURL}</a>
        <p> Regards </p>
        `

        const subject = "Passsword Reset Request"
        const send_to = user.email
        const sent_from = process.env.EMAIL_USER

        try {
            await sendEmail(subject,message,send_to, sent_from)
            res.status(200).json({sucess:true, message:"Reser email snet"})
        } catch (error) {
            res.status(500)
            console.log(error)
            throw new Error("Email not sent")

        }
        
     res.send("forgot password")
        

    }
)

const resetPassword = asyncHandler(
    async(req, res ) => {
    const {password} = req.body;
    const {resetToken} = req.params

    // hash token, then compare token in the DB

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // find token in Db
    const userToken = await Token.findOne({
        token:hashedToken,
        expiresAt: {$gt: Date.now()}

    })

    if(!userToken) {
        res.status(404)
        throw new Error("invalid or expired token")
    }
    
    // find user

    const user = await User.findOne({_id: userToken.userId})

    user.password = password

    await user.save()

    res.status(200)
    .json({message: "Password reset successful please login"})

    }
)

module.exports =  {
    registerUser,
    loginUser,
    logOutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
}
