var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function (req, res, next) {
  if (req.session.user_id) {
    var userId = mongoose.Types.ObjectId(req.session.user_id);
    var accounts = mongoose.model('Account');
    accounts.findById(userId, function (err, account) {
      res.render('setAccount', {
        title: 'アカウント管理',
        account: account
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', function (req, res, next) {
  var userName = req.body.userName;
  var id = req.body.id;
  var password = req.body.password;
  var accounts = mongoose.model("Account");
  if (!userName || !id || !password) {
    var userId = mongoose.Types.ObjectId(req.session.user_id);
    accounts.findById(userId, function (err, account) {
      res.render('setAccount', {
        title: 'アカウント管理',
        account: account,
        noneIDPW: 'ユーザー名またはパスワードを入力してください'
      });
    });
  }
  var query = {
    id: id
  };
  accounts.findOneAndUpdate(query, {
      $set: {
        user: userName,
        pwd: password
      }
    },
    function (err, docs) {
      var userId = mongoose.Types.ObjectId(req.session.user_id);
      accounts.findById(userId, function (err, account) {
        res.render('setAccount', {
          title: 'アカウント管理',
          account: account,
          accept: '変更しました'
        });
      });
    });
});

module.exports = router;