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

    var v = db.collection('routes');

    v.find({ "stations.loc": {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [ lon , lat] },
            $maxDistance: distance
        }
    }
    }, {target: 1, line: 1}).toArray(function (err, items) {
        var x = [];
        UND.forEach(items, function (item) {
                x.push(item.line);
            }
        );
        x = UND.uniq(x, function (item, key, a) {
            return item;
        });
        res.json({ items: x});

    });
};


locationSvc.getDataForRoute = function (req, res) {
    var line = req.param("line");

    db.collection('routes').find({"line": line}).toArray(function (err, items) {
            var stations = [];
            if (items)
                for (var i = 0; i < items.length; i++)
                        stations = stations.concat(items[i].stations);

            var resp = UND.uniq(stations, function (item, key, a) {
                return item.id;
            });
            resp = UND.filter(resp, function(item) {
               return item.id != "9096310"; //drop Märkische Zeile
            });
            var in_param = [];
            for (i = 0; i < resp.length; i++) {
                    in_param.push(resp[i].id);
            }
            db.collection('content').find({
                "nearStations": {
                    "$elemMatch": {
                        "_id": {$in: in_param}
                    }
                }
            }, {"place": 0}).toArray(function (err, items2) {
                res.json({ stations: resp, contents: items2});
            });

        }
    )
    ;

};

router.get('/getLinesForLoc', locationSvc.getLines);
router.get('/getDataForRoute', locationSvc.getDataForRoute);


module.exports = router;

