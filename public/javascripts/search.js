$(function () {
  if ($("#text").val()) {
    postSearch($("#text").val());
  }
});

$("#form").submit(function () {
  var searchName = $("#text").val();
  console.log(searchName);
  if (searchName.length == 0) {
    console.log(1);
    $("#error").text("名称は1文字以上にしてください");
    $("#error").css({
      'display': 'inline'
    });
  } else if (searchName.length > 31) {
    console.log(2);
    $("#error").text("名称は30文字以上にしてください");
    $("#error").css({
      'display': 'inline'
    });
  } else {
    console.log(3);
    $("#error").css({
      'display': 'none'
    });
    postSearch($("#text").val());
  }
  return false;
});

function postSearch(searchName) {
  var $list = $("#list");
  console.log(searchName);
  $list.children().remove();
  $.post("/search", {
      searchName: searchName
    },
    function (lists) {
      if (lists) {
        $.each(lists, function (index, list) {
          var li1 = $("<li>");
          var a1 = $("<a>").text(list.title);
          a1.attr('href', "/showDetails/" + list._id);
          var author = $("<p>").text('作成者: ' + list.author);
          var date1 = new Date(list.createDate);
          var date2 = $("<p>").text('作成日: ' + date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日');
          li1.append(a1, author, date2);
          li1.addClass("list-group-item border-info");
          $list.append(li1);
        });
      } else {
        $list.append('<p style="color: #ff0000" class="alert alert-danger" role="alert">検索結果 : 見つかりませんでした。</p>');
      }
    }
  );
}