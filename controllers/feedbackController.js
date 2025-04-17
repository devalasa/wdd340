const feedbackModel = require("../models/feedbackModel");
const utilities = require("../utilities/");

async function addFeedback(req, res) {
  const { inv_id, feedback_text } = req.body;
  const account_id = res.locals.accountData.account_id;

  if (!feedback_text.trim()) {
    // req.flash("error", "Feedback cannot be empty.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  try {
    await feedbackModel.insertFeedback(account_id, inv_id, feedback_text);
    // req.flash("notice", "Feedback posted successfully.");
  } catch (error) {
    // req.flash("error", "Failed to post feedback.");
  }

  res.redirect(`/inv/detail/${inv_id}`);
}

module.exports = { addFeedback };
