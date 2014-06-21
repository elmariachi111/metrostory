var Mongo = require('../db.js'),
    v = Mongo.collection('veebibi'),
    stations = Mongo.collection('stations'),
    und = require('underscore');

var aggToCol = function() {

    v.aggregate([
        { $project:
            {"stations.loc": 1, "stations.name":1,"stations.id":1}
        },
        { $unwind : "$stations"},
        { $group:
            {_id : "$stations.id", "name": {
                "$first":"$stations.name"},
                "loc": {
                    "$first":"$stations.loc"
                },
                "cnt": {$sum:1}
            }
        },
        {
            $sort : {
                "cnt" : -1
            }
        }], function (err, data){
            und.forEach(data, function(station){
                console.log(station._id);
                stations.save(station, function(err){

                });
            });
    });
}

aggToCol();