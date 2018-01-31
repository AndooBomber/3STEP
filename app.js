var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var showDetails = require('./routes/showDetails');
var createList = require('./routes/createList');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var setAccount = require('./routes/setAccount');
var search = require('./routes/search');

const mongoose = require('mongoose');
var moment = require('moment');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://heroku_0pd0mzz3:dpa5uf3ecri6kjgg5iv5up28ui@ds255347.mlab.com:55347/heroku_0pd0mzz3');

var app = express();

var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'foo',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    clear_interval: 60 * 60
  })
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var Schema = mongoose.Schema;
var chatSchema = new Schema({
  name: String,
  log: String,
  createDate: {
    type: Date,
    default: Date.now()
  }
});
var listSchema = new Schema({
  author: String,
  title: String,
  message: String,
  tags: [],
  chats: [chatSchema],
  member: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }],
  createDate: {
    type: Date,
    default: Date.now()
  }
});
var accountSchema = new Schema({
  user: String,
  id: String,
  pwd: String,
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'List'
  }]
});
mongoose.model('List', listSchema);
mongoose.model('Account', accountSchema);

app.use('/', index);
app.use('/showDetails', showDetails);
app.use('/createList', createList);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/setAccount', setAccount);
app.use('/search', search);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  //接続のidを確認
  console.log('connected', socket.id);

  // chatというイベントを受信したとき、送られた内容をすべてのクライアントに送信する
  socket.on('chat', function (chat) {
    var lists = mongoose.model("List");
    var user_id = mongoose.Types.ObjectId(chat.id);
    lists.findById(user_id, function (err, list) {
      var chats = {};
      chats.name = chat.name;
      chats.log = chat.message;
      list.chats.push(chats);
      list.save();
    });
    io.to(chat.id).emit('chat', chat);
  });

  socket.on('msg update', function (msg) {
    socket.join('' + msg.id);
    var lists = mongoose.model("List");
    var list_id = mongoose.Types.ObjectId(msg.id);
    lists.findById(list_id, {
      'chats': 1
    }).exec(function (err, docs) {
      io.to(socket.id).emit('open_chats', docs);
    });
  });

  // 接続が切断したとき
  socket.on('disconnect', function () {
    console.log('disconnect');
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;