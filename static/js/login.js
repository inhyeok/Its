$(function () {
  $('#loginForm').on('submit', function () {
    $this = $(this);
    if(!$this.find($('#id')).val()){
      $this.find($('#id')).focus();
      sw_alert('error', '아이디를 입력해주세요.');
    }
    else if(!$this.find($('#pw')).val()){
      $this.find($('#pw')).focus();
      sw_alert('error', '비밀번호를 입력해주세요.');
    }
    else {
      $.ajax({
        url: '/login',
        data: $this.serialize(),
        type: 'POST',
        success: function (req) {
          if(req.status === 200){
            // return true
            return window.location = '/';
          }
          else if(req.status === 204) {
            sw_alert('error', req.message);
          }
        },
        error: function (err) {
          sw_alert('error', err);
          console.log(err);
        }
      });
    }
    return false;
  });

  sw_alert = function (type, message) {
    swal({
      title: type,
      type: type,
      text: message
    });
  }
});