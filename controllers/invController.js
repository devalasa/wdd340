const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async (req, res, next) => {
  const inv_id = req.params.inv_id;  // Access the inv_id parameter
  try {
    const vehicleData = await invModel.getVehicleById(inv_id);  // Fetch vehicle data
    const html = await utilities.buildVehicleDetail(vehicleData);  // Generate vehicle detail HTML
    let nav = await utilities.getNav();  // Get navigation (if needed)
    res.render("inventory/vehicle-detail", {
      title: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHtml: html,
    });
  } catch (error) {
    next(error);  // Pass the error to the error-handling middleware
  }
};

// At the bottom of invController.js

invCont.throwError = async function (req, res, next) {
  throw new Error("Sorry the vehicle you're looking for is unavailable");
}







module.exports = invCont