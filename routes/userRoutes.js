const express = require("express")
const { userSignUp, userLogin,refreshToken, userLogout, getAllUsers,
        getLoggedInDetails, updateDetails, 
        deleteUser, changePassword, 
        forgotPassword, resetPassword } = require("../controllers/userController")
const { validateSignUp } = require("../utils/validate")
const { userAuth } = require("../middleware/auth")
const {requireRole} = require("../middleware/role")

const router = express.Router()

router.post("/register",validateSignUp,userSignUp)

router.post("/login",userLogin)

router.post("/refresh-token", refreshToken)

router.put("/change-password", userAuth, changePassword)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password", resetPassword)

router.post("/logout", userLogout)

router.get("/get-all-users",
    userAuth,
    requireRole("admin"),
    getAllUsers)

router.get("/get-loggedin-details", userAuth, getLoggedInDetails)

router.patch("/update-details", userAuth, updateDetails)

router.delete("/delete-user", userAuth, requireRole("admin"), deleteUser)

module.exports = router