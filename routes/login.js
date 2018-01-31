var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'ログイン'
    });
  }
});

router.post('/', function (req, res, next) { //部品を共有化・~としてログインなどログイン状態とログアウト機能の作成。
  var id = escapeText(req.body.id);
  var password = escapeText(req.body.password);
  if (!id || !password) {
    res.render('login', {
      title: 'ログイン',
      noneIDPW: 'IDまたはPWを入力してください'
    });
  }
  var query = {
    id: id,
    pwd: password
  };
  var Account = mongoose.model('Account');
  Account.find(query, function (err, account) {
    if (err) {
      console.log(err);
      res.redirect('/login');
    }
    if (account.length > 0) {
      req.session.user_id = account[0]._id;
      res.redirect('/');
    } else {
      res.render('login', {
        title: 'ログイン',
        cantFind: 'IDもしくはパスワードが違います'
      });
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