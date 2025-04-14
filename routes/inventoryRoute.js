// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")


// Route to get a specific vehicle by ID
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInvId));

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Intentional error route for testing 500 error handling
router.get("/error-test", utilities.handleErrors(invController.throwError));

// Inventory Management View Route
router.get("/", utilities.handleErrors(invController.buildManagementView));

// GET form for add-classification
router.get("/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

// POST form
router.post(
    "/add-classification",
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)


module.exports = router;