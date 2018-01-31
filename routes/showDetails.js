var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/:id', function (req, res, next) {
  if (req.session.user_id) {
    var user_id = mongoose.Types.ObjectId(req.session.user_id);
    var accounts = mongoose.model('Account');
    var param = req.params.id;
    accounts.findById(user_id, function (err, account) {
      res.render('showDetails', {
        title: "詳細",
        param: param,
        account: account
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', function (req, res, next) {
  if (req.body.id) {
    var user_id = mongoose.Types.ObjectId(req.body.id);
    var lists = mongoose.model("List");
    lists.findById(user_id).populate('member').exec(function (err, docs) {
      res.send(docs);
    });
  }
});

router.post('/member', function (req, res, next) {
  if (req.body.id && req.body.user_id) {
    var id = mongoose.Types.ObjectId(req.body.id);
    var lists = mongoose.model("List");
    lists.findById(id, function (err, docs) {
      var user_id = mongoose.Types.ObjectId(req.body.user_id);
      if (docs.member.indexOf(user_id) == -1) {
        docs.member.push(user_id);
        docs.save();
        res.send(true);
      } else {
        res.send(false);
      }
    });
  }
});

module.exports = router;