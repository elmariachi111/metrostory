var express = require('express');
var Db = require('../db.js');
var R = require('request');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/testdb', function(req, res) {
    Db.collection("demotest").find({}).toArray( function(err, cnt) {
        res.json(cnt);
    });
});


router.get('/paypal/token', function(req,res ) {

    R.post({
            uri: "https://svcs.sandbox.paypal.com/AdaptivePayments/Pay",
            method: "POST",
            headers: {
                "X-PAYPAL-SECURITY-USERID":"rts-facilitator_api1.arcor.de",
                "X-PAYPAL-SECURITY-PASSWORD":"1403427249",
                "X-PAYPAL-SECURITY-SIGNATURE":"AXsQKJSyO5m-3olyae6I9arYTVsYAIag0FtlEZy8aNnS.wVTYtVCQDtU",
                "X-PAYPAL-APPLICATION-ID":"APP-80W284485P519543T",
                "X-PAYPAL-REQUEST-DATA-FORMAT":"JSON",
                "X-PAYPAL-RESPONSE-DATA-FORMAT":"JSON"
            },
            json:{ "returnUrl":"http://127.0.0.1:3000/paypal/return",
            "requestEnvelope":{
                "errorLanguage":"en_US"
            },"currencyCode":"EUR",
                "receiverList":{
                    "receiver":[{"email":"rts@arcor.de", "amount":"10.00"}]
                },
                "cancelUrl":"http://127.0.0.1:3000/paypal/cancel",
            "actionType":"PAY"

            }
    },
        function ( error, response, body ){
            if(!error && response.statusCode == 200){
                res.json(body);
            } else {
               res.send(500);
            }
        }
    );
});
router.get('/paypal/return', function(req, res) {
    console.log("return");
    console.dir(req.body);
    res.send("ok");
});

router.get('/paypal/cancel', function(req, res) {
    console.log("cancel");
    console.dir(req.body);
    res.send("ok");
});
module.exports = router;
