var socket = io();

socket.on('connect', function () {
  var user_id = $("#user_id").val();
  socket.emit('msg update', {
    id: user_id
  });
});

// chatというイベントを受信したらHTML要素に追加する
socket.on('chat', function (chat) {
  console.log(chat);
  var messages = $("#messages");
  // 新しいメッセージは既にある要素より上に表示させる
  var newMessage = $("<li>");
  var p1 = $("<p>");
  var p2 = $("<small>");
  p1.html(chat.name + '&nbsp:&nbsp' + chat.message);
  p1.addClass("");
  var date1 = new Date(chat.date);
  p2.html(date1.getHours() + " : " + date1.getMinutes());
  newMessage.addClass("list-group-item");
  p2.addClass("text-right");
  newMessage.append(p1, p2);
  messages.append(newMessage);
});

socket.on('open_chats', function (msg) {
  if (msg.chats.length == 0) {
    console.log("chat is nothing");
    return;
  } else {
    var mes = $("#messages");
    mes.empty();
    $.each(msg.chats, function (index, value) {
      var li1 = $('<li>');
      var p1 = $("<p>");
      p1.html(value.name + '&nbsp:&nbsp' + value.log);
      var p2 = $("<small>");
      var date1 = new Date(value.createDate);
      p2.html(date1.getHours() + " : " + date1.getMinutes());
      p2.addClass("text-right");
      li1.addClass("list-group-item");
      li1.append(p1, p2);
      mes.append(li1);
    });
  }
});

//送信ボタンにイベントを定義
var sendButton = $("#send");
sendButton.on('click', sendMessage);

// メッセージを送信する
function sendMessage() {
  // 名前と内容を取得する
  var id = $("#user_id").val();
  var name = $("#userName").val();
  var message = $("#text");

  // chatイベントを送信する
  socket.emit('chat', {
    id: id,
    name: name,
    message: message.val(),
    date: Date.now()
  });

  // 内容をリセットする
  message.val('');
}