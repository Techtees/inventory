const express = require("express")
const router = express.Router()
const { registerUser, loginUser,logOutUser } = require("../controllers/userController")



router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logOut", logOutUser)

module.exports = router
