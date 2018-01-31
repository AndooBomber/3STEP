var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function (req, res, next) {
  if (req.session.user_id) {
    var user_id = mongoose.Types.ObjectId(req.session.user_id);
    var accounts = mongoose.model('Account');
    accounts.findById(user_id, function (err, account) {
      res.render('createList', {
        title: '新規作成',
        account: account
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', function (req, res, next) {
  var title = escapeText(req.body.title);
  var message = escapeText(req.body.message);
  var tags = req.body.tags;
  if (title && message) {
    var user_id = mongoose.Types.ObjectId(req.body.user_id);
    var Accounts = mongoose.model('Account');
    Accounts.findById(user_id, function (err, account) {
      var Lists = mongoose.model('List');
      var schema = new Lists();
      schema.author = account.user;
      schema.title = title;
      schema.message = message;
      if (tags === "") {
        schema.tags = [];
      } else {
        var tag = tags.split(',');
        schema.tags = tag;
      }
      schema.chats = [];
      schema.save();
      account.lists.push(schema);
      account.save();
    });
    res.redirect('/');
  }
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