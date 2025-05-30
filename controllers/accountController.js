const utilities = require("../utilities/")
const acctModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountController = {}


/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
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
accountController.registerAccount = async function(req, res) {

    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        res.status(500).render("account/register", {
           title: "Registeration",
           nav,
           errors: null,
        })
    }
    const regResult = await acctModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)
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
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null
        })
    }
    console.log(req.body)
}

/* ****************************************
 *  Process login request
 * ************************************ */

accountController.accountLogin = async function(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await acctModel.getAccountByEmail(account_email)
    if (!accountData) {
    //   req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }     
    
    try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
      }
      else {
        // req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden')
    }
}

/* ****************************************
 *  Account Management View
 * ************************************ */
accountController.accountManagementView = async function(req, res) {
    const nav = await utilities.getNav()
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        // message: null
    })
}


accountController.buildUpdateForm = async function(req, res) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await acctModel.getAccountById(account_id)

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    errors: null,
    message: null,
  })
}


accountController.updateAccount = async function(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await acctModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    const accountData = await acctModel.getAccountById(account_id)
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData,
      message: "Account updated successfully.",
      errors: null,
    })
  } else {
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: { account_id, account_firstname, account_lastname, account_email },
      errors: null,
      message: "Update failed. Try again.",
    })
  }
}



 accountController.changePassword = async function(req, res) {
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await acctModel.updatePassword(account_id, hashedPassword)

    const accountData = await acctModel.getAccountById(account_id)
    const message = updateResult ? "Password updated successfully." : "Failed to update password."

    res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData,
      errors: null,
      message,
    })
  } catch (error) {
    console.error("Password change error:", error)
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: { account_id },
      errors: [{ msg: "Something went wrong. Try again." }],
      message: null,
    })
  }
}

/* Process Logout */
accountController.logoutAccount = async function(req, res) {
  res.clearCookie("jwt") // remove JWT token cookie
  // req.flash("notice", "You have successfully logged out.")
  res.redirect("/")
}




module.exports = accountController