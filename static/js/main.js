$(function () {
  __ = $('.side-label')
  __.on('click', function () {
    $side = $('.side')
    open = $side.data('side-open')

    if(open == false) {
      $('.side').addClass('open')
    }
    else if(open == true) {
      $('.side').removeClass('open')
    }

    $side[0].setAttribute('data-side-open', !open)
  })
});