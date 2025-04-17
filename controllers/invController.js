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
  const classificationSelect = await utilities.buildClassificationList()
  const accountData = res.locals.accountData
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
    accountData
  })
}


// Deliver add-classification view
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



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    // req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    // req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Process Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult.rowCount) {
    // req.flash("notice", "The item was successfully deleted.");
    res.redirect("/inv/");
  } else {
    // req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/inv/delete/" + inv_id);
  }
};



// At the bottom of invController.js
invCont.throwError = async function (req, res, next) {
  throw new Error("Sorry the vehicle you're looking for is unavailable");
}



module.exports = invCont