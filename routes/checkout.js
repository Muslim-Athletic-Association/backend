
// Modules
const router = require('express').Router();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const square = require('square-connect');
const checkout = require('../model/checkout');

// Variables
var url = "https://connect.squareup.com/oauth2/authorize?client_id=sq0idp-sLlmPJAM_ROoAdLGUlNNjA&scope=CUSTOMERS_WRITE+CUSTOMERS_READ+ORDERS_WRITE+ORDERS_READ+ITEMS_READ+ITEMS_WRITE+ORDERS_WRITE+PAYMENTS_WRITE+PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS+PAYMENTS_WRITE+PAYMENTS_READ&state=82201dd8d83d23cc8a48caf52ba4f4fb"

router.get("/oauth-redirect", (req, res) => {
    var code = req.params.code;
    console.log("\n\n********* OUR SUPER SECRET CODE: " + code + " *********\n\n");
    res.status(200);
    res.json({
        code: code,
        msg: "********* OUR SUPER SECRET CODE: " + code + " *********"
    });
    return code;
})

module.exports = router;
