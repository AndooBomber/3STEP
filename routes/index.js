var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user_id) {
    var user_id = mongoose.Types.ObjectId(req.session.user_id);
    var accounts = mongoose.model('Account');
    accounts.findById(user_id, function (err, account) {
      res.render('index', {
        title: '募集',
        account: account
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', function (req, res, next) {
  var Lists = mongoose.model('List');
  Lists.find().sort({
    createDate: -1
  }).limit(30).exec(function (err, lists) {
    if (err) {
      console.log(err);
    } else {
      res.send(lists);
    }
  });
});

module.exports = router;