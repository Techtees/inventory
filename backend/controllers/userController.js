const registerUser = (req, res) => {
    // check if user has an email
    if(!req.body.email) {
        res.status(400)
        throw new Error("Please add an email")
    }
     res.send("Register user")
};

module.exports =  {
    registerUser
}