const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountByEmail(email)
        if (account && account.account_id != req.body.account_id) {
          throw new Error("Email already exists. Please use a different email.")
        }
      }),
  ]
}

const passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const accountData = {
      account_id: req.body.account_id,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    }
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData,
      message: null,
    })
  }
  next()
}

const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(req.body.account_id)
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData,
      message: null,
    })
  }
  next()
}

module.exports = {updateRules, passwordRules, checkUpdateData, checkPasswordData}

