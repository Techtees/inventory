const express = require("express")
const router = express.Router()
const { registerUser, loginUser,logOutUser, getUser, loginStatus, updateUser } = require("../controllers/userController")
const protect = require("../middleWare/authMiddleware")




router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logOutUser)
router.get("/getuser", protect, getUser)
router.get("/loginstatus", loginStatus)
router.patch("/updateuser", protect, updateUser)


module.exports = router
