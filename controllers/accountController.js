const utilities = require("../utilities/")
const acctModel = require("../models/account-model")
const accountController = {}


/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    let login = await utilities.loginPage()
    res.render("./account/login", {
        title: "Login",
        nav,
        login
    })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
// Process Registration
accountController.registerAccount = async function (req, res) {

    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const regResult = await acctModel.registerAccount(account_firstname, account_lastname, account_email, account_password)
    let login = await utilities.loginPage()
    if (regResult) {
        // req.flash("notice", `Congratulations, you have successfully registered as ${account_firstname} ${account_lastname}. Please Login.`)


        res.status(201).render("account/login", {
            title: "Login",
            nav,
            login
        })
    }   else {
        // req.flash("notice", "Sorry, the registration failed.")
        req.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null
        })
    }
    console.log(req.body)
}
  
module.exports = accountController