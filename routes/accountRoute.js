// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const { checkLogin } = require("../models/checkAuth")
const { updateRules, passwordRules, checkUpdateData, checkPasswordData } = require("../utilities/accountUpdateRules")


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the reqisteration data
router.post('/register', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))


// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
)


// Default account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagementView))

// Deliver update account form
router.get("/update/:account_id", checkLogin, accountController.buildUpdateForm)

// GET - Show update form
router.get("/update/:account_id", checkLogin, accountController.buildUpdateForm)

// POST - Handle update info
router.post("/update", checkLogin, accountController.updateAccount)

// POST - Handle password change
router.post("/change-password", checkLogin, accountController.changePassword)

// GET - show update form (already done)
router.get("/update/:account_id", checkLogin, accountController.buildUpdateForm)

// POST - update account info
router.post("/update", updateRules(), checkUpdateData, checkLogin, accountController.updateAccount)

// POST - update password
router.post("/change-password", passwordRules(), checkPasswordData, checkLogin, accountController.changePassword)

// GET - Logout route
router.get("/logout", accountController.logoutAccount)



module.exports = router;