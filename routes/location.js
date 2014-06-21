var locationSvc = {};
var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */

locationSvc.getLines = function (req, res) {
    var v = db.collection('veebibi');

    v.find({ "stations.loc": {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [ 13.58 , 52.66 ] },
            $maxDistance: 1000
        }
    }
    }).limit(100).toArray(function (err, items) {
        res.json({ items: items});

    });
};

locationSvc.getDataForRoute = function (req, res) {

};

router.get('/getLinesForLoc', locationSvc.getLines);


    module.exports = router;

