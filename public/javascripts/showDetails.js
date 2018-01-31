$(function () {
  getDetail();
});

$("#member_button").click(function () {
  var $id = $("#user_id").val();
  var $user_id = $("#a_id").val();
  $.post("/showDetails/member", {
      id: $id,
      user_id: $user_id
    },
    function (data) {
      if (data) {
        $("#member_button").prop("disabled", true);
        $("#member_button").text("メンバーです");
        var $member = $("#member");
        var li1 = $("<li>");
        li1.text($("#userName").val());
        li1.addClass("list-group-item");
        $member.append(li1);
      }
    }
  );
});

function getDetail() {
  var $author = $("#author");
  var $title = $("#titleDetail");
  var $message = $("#message");
  var $tags = $("#tags");
  var $id = $("#user_id").val();
  var $user_id = $("#a_id").val();
  var $member = $("#member");
  console.log($id);
  $.post("/showDetails", {
      id: $id
    },
    function (detail) {
      $author.text("作成者: " + detail.author);
      $title.text(detail.title);
      var str = nl2br(detail.message);
      $message.html(str);
      $.each(detail.tags, function (index, tag) {
        var a1 = $("<a>").text(tag);
        a1.attr("href", "/search/" + tag);
        a1.addClass("badge badge-primary");
        a1.addClass("m-2");
        $tags.append(a1);
      });
      $.each(detail.member, function (index, member) {
        var li1 = $("<li>");
        li1.text(member.user);
        li1.addClass("list-group-item");
        $member.append(li1);
        if (member._id === $user_id) {
          $("#member_button").prop("disabled", true);
          $("#member_button").text("メンバーです");
        }
      });
    });
}

function nl2br(str) {
  str = str.replace(/\r\n/g, "<br>");
  str = str.replace(/(\n|\r)/g, "<br>");
  return str;
}