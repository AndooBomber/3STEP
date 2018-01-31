function sendList() {
  var title = $('#text').val();
  var message = $('#message').val();
  var tags = $("#tags").tagsinput('items');
  if (title.length == 0) {
    errorAlert('タイトルは1文字以上にしてください', $('#visible'));
    return false;
  } else if (title.length > 31) {
    errorAlert('タイトルは30文字以下にしてください', $('#visible'));
    return false;
  } else if (tags.length > 5) {
    errorAlert('タグは5つまでにしてください', $('#visible'));
    return false;
  } else {
    $('form').submit();
  }
}

//赤文字でエラー表示をするための関数
function errorAlert(text, jqname) {
  jqname.text(text);
  jqname.css({
    'color': '#ff0000',
    'display': 'inline'
  });
}