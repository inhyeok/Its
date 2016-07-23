$(function () {
  __ = $('.side-label')
  __.on('click', function () {
    $side = $('.side')
    open = $side.hasClass('open')
    if(open == false) {
      $('.side').addClass('open')
    }
    else if(open == true) {
      $('.side').removeClass('open')
    }
  })
});