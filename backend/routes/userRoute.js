const express = require("express")
const router = express.Router()
const { registerUser, loginUser,logOutUser, getUser, loginStatus, updateUser, changePassword, forgotPassword, resetPassword } = require("../controllers/userController")
const protect = require("../middleWare/authMiddleware")




router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logOutUser)
router.get("/getuser", protect, getUser)
router.get("/loginstatus", loginStatus)
router.patch("/updateuser", protect, updateUser)
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword)


module.exports = router
