var locationSvc = {};
var express = require('express');
var router = express.Router();
var db = require('../db.js');
var UND = require('underscore');
/* GET home page. */

locationSvc.getLines = function (req, res) {
    var lat = parseFloat(req.param("lat")); //52.66
    var lon = parseFloat(req.param("lon")); //13.58
    var distance = parseInt(req.param("radius"));//1000

    var v = db.collection('veebibi');

    v.find({ "stations.loc": {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [ lon , lat] },
            $maxDistance: distance
            }
        }
    },{target:1, line:1}).limit(100).toArray(function (err, items) {
        res.json({ items: items});
    });
};


locationSvc.getDataForRoute = function (req, res) {
    var line = req.param("line");

    db.collection('veebibi').find({"line": line}).toArray(function (err, items) {
        var x = 0;
        var val = 0;
        if (items)
            for (var i = 0; i < items.length; i++) {
                if (items[i].stations.length > val) {
                    val = items[i].stations.length;
                    x = i;
                }
            }
        else
        {res.json({ items: "error"});
        return;}
        res.json({ items: items[x].stations});


    });

};

router.get('/getLinesForLoc', locationSvc.getLines);
router.get('/getDataForRoute', locationSvc.getDataForRoute);


module.exports = router;

