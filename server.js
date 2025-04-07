/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/



app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
// Inventory routes
app.use("/inv", inventoryRoute)

// Index route
app.get("/", baseController.buildHome)



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


// Global error handler (500 errors)
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  let nav = await utilities.getNav()
  res.status(500).render("errors/error", {
    title: "500 Server Error",
    message: err.message || "Something went wrong on our end. Please try again later.",
    nav,
    layout: "./layouts/layout"
  });
});



