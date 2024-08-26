const express = require("express")
const router = express.Router()
const { registerUser, loginUser,logOutUser, getUser, loginStatus } = require("../controllers/userController")
const protect = require("../middleWare/authMiddleware")




router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logOutUser)
router.get("/getuser", protect, getUser)
router.get("/loginstatus", loginStatus)

module.exports = router
