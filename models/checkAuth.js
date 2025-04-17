// middleware/checkAuth.js

const jwt = require("jsonwebtoken")
require("dotenv").config()

function checkLogin(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    // req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = decoded
    next()
  } catch (err) {
    // req.flash("notice", "Invalid session. Please log in again.")
    return res.redirect("/account/login")
  }
}

function checkEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    // req.flash("notice", "Access restricted. Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.accountData = decoded
      next()
    } else {
    //   req.flash("notice", "You do not have permission to access this resource.")
      return res.redirect("/account/login")
    }
  } catch (err) {
    // req.flash("notice", "Invalid session.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkLogin, checkEmployeeOrAdmin }
