var express = require('express');
var Db = require('../db.js');

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

module.exports = router;
