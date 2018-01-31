var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function (req, res, next) {
  if (req.session.user_id) {
    var user_id = mongoose.Types.ObjectId(req.session.user_id);
    var accounts = mongoose.model('Account');
    accounts.findById(user_id, function (err, account) {
      res.render('search', {
        title: '検索',
        account: account
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/:id', function (req, res, next) {
  if (req.session.user_id) {
    var user_id = mongoose.Types.ObjectId(req.session.user_id);
    var accounts = mongoose.model('Account');
    var param = req.params.id;
    accounts.findById(user_id, function (err, account) {
      res.render('search', {
        title: '検索',
        account: account,
        param: param
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', function (req, res, next) {
  console.log(req.body.searchName);
  var Lists = mongoose.model('List');
  Lists.find({
    $or: [{
      title: new RegExp('.*' + req.body.searchName + '.*', 'i')
    }, {
      tags: new RegExp('.*' + req.body.searchName + '.*', 'i')
    }, {
      author: new RegExp('.*' + req.body.searchName + '.*', 'i')
    }]
  }).sort({
    createDate: -1
  }).limit(30).exec(function (err, docs) {
    res.send(docs);
  });
});


module.exports = router;