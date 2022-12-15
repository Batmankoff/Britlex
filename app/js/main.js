$(function () {

  $('.menu-open, .menu__close , .menu a').on('click', function () {
    $('.menu').toggleClass('menu--active');
    $('.dimming').toggleClass('dimming--active');
  });

  $(".menu a").on("click", function (event) {
    event.preventDefault();

    var id = $(this).attr("href"),
      top = $(id).offset().top;

    $("body,html").animate({
      scrollTop: top
    }, 1000);
  });
});