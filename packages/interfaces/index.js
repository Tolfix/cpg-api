// module.exports = require("./Types/PaymentMethod");
// module.exports = require("./Types/PaymentTypes");

exports.A_RecurringMethod = [
    "monthly",
    "yearly",
    "quarterly",
    "semi_annually",
    "biennially",
    "triennially"
];
exports.A_CC_Payments = [
    "credit_card",
    "paypal",
    "swish",
    "none",
    "manual",
    "bank"
];
exports.A_PaymentTypes = ["one_time", "recurring", "free"];