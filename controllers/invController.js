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



// Deliver Imventory Management View
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}


// Deliver asdd-classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav, 
    errors: null
  })
}


invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    res.redirect("/inv")
  } else {
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav, 
      errors: null
    })
  }
}


// Handle Classification insertion
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav, 
    classificationList,
    errors: null,
    // sticky data
    inv_make: "", inv_model: "", inv_year: "", inv_description: "", 
    inv_image: "/images/vehicles/", inv_thumbnail: "/images/vehicles/",
    inv_price: "", inv_miles: "", inv_color: ""
  })
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  try {
    const result = await invModel.addInventoryItem({
      classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })

    if (result) {
      res.redirect("/inv")
    } else {
      res.status(500).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        ...req.body //sticky
      })
    }
  } catch (error) {
    console.error("Error adding vehicle:", error)
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vheicle",
      nav,
      classificationList,
      errors: error.message,
      ...req.body // sticky
    })
  }
}

// At the bottom of invController.js
invCont.throwError = async function (req, res, next) {
  throw new Error("Sorry the vehicle you're looking for is unavailable");
}






module.exports = invCont