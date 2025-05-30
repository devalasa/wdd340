// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")
const { checkEmployeeOrAdmin } = require("../models/checkAuth")

// Route to get a specific vehicle by ID
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInvId));

// Route to build inventory by classification view
router.get("/type/:classificationId", checkEmployeeOrAdmin, invController.buildByClassificationId);

// Intentional error route for testing 500 error handling
router.get("/error-test", utilities.handleErrors(invController.throwError));

// Inventory Management View Route
router.get("/", utilities.handleErrors(invController.buildManagementView));

// GET form for add-classification
router.get("/add-classification",
    checkEmployeeOrAdmin,
    utilities.handleErrors(invController.buildAddClassification)
)

// POST form
router.post(
    "/add-classification",
    checkEmployeeOrAdmin,
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

router.get("/add-inventory", checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddInventory))

router.post("/add-inventory", checkEmployeeOrAdmin, utilities.handleErrors(invController.addInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to return the edit inventory view
router.get("/edit/:inv_id", checkEmployeeOrAdmin, utilities.handleErrors(invController.editInventoryView))

// A route handler to watch for and direct the incoming request to the controller for processing
router.post("/update/", checkEmployeeOrAdmin, invController.updateInventory)


// Route to devliver delete confirmation view
router.get("/delete/:inv_id", checkEmployeeOrAdmin, invController.buildDeleteInventory)

// Route to carry out the delete operation
router.post("/delete/", checkEmployeeOrAdmin, invController.deleteInventory)


module.exports = router;