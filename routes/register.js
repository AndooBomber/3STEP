var express = require('express');
var router = express.Router();
var moment = require('moment');
var mongoose = require('mongoose');

router.get('/', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect('/');
  } else {
    res.render('register', {
      title: '新規会員登録'
    });
  }
});

router.post('/', function (req, res, next) {
  var userName = escapeText(req.body.user_name);
  var id = escapeText(req.body.id);
  var password = escapeText(req.body.password);
  if (!userName || !id || !password) {
    res.redirect('/register');
  }
  var Account = mongoose.model('Account');
  var account = new Account();
  account.user = userName;
  account.id = id;
  account.pwd = password;
  account.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

function escapeText(text) {
  var TABLE_FOR_ESCAPE_HTML = {
    "&": "&amp;",
    "\"": "&quot;",
    "<": "&lt;",
    ">": "&gt;"
  };
  return text.replace(/[&"<>]/g, function (match) {
    return TABLE_FOR_ESCAPE_HTML[match];
  });
}

module.exports = router;