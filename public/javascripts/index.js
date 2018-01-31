$(function () {
  getList();
});

function getList() {
  var $list = $('#list');
  $.post('/', function (lists) {
    if (lists) {
      $.each(lists, function (index, list) {
        var li1 = $("<li>");
        var a1 = $("<a>").text(list.title);
        a1.addClass("link");
        a1.attr('href', "/showDetails/" + list._id);
        var author = $("<p>").text('作成者: ' + list.author);
        var date1 = new Date(list.createDate);
        var date2 = $("<small>").text('作成日: ' + date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日');
        li1.append(a1, author, date2);
        li1.addClass("list-group-item border-info");
        $list.append(li1);
      });
    }
  });
}