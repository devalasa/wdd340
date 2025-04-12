const invModel = require("../models/inventory-model")
const Util = {}

// Util.buildVehicleDetail = async function (vehicle) {
//   const vehicleV = await vehicle 
//   let html = `<div id="vehicle-view">
//     <h1>${vehicleV.inv_make} ${vehicleData.inv_make}
//     </div>`
//   return html
//   } 
 

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }
  







/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
    let list = '<ul class="links">'
    list += '<li><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}



Util.buildVehicleDetail = async function (vehicle) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD"
  }).format(vehicle.inv_price);

  const mileage = new Intl.NumberFormat().format(vehicle.inv_miles);

  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
         <p class="price"><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
}

//Login page created
Util.loginPage = async function (req, res, next) {
  return `
  <div id="form-l">
  <form action="/account/login" method="post">
  <div class="email">
  <label for="account_email">Email</label>
  <input type="email" name="account_email" id="account_email" required>
  </div>
  <div class="password">
    <span>Passwords must be at leaset 12 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character</span>
    <input type="password" name="account_password" id="account_password" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z](?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$)">
  </div>
  <button type="submit">Login</button>
  </form>

  <p>No account? <a href="/account/register">Sign-up</a></p>
  </div>
  `
}



//Handle Errors created
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)





module.exports = Util;