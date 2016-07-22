$(function () {
  $('#signupForm').on('submit', function () {
    $this = $(this);
    if(!$this.find($('#groupName')).val()){
      $this.find($('#groupName')).focus();
      sw_alert('error', '이름을 입력해주세요.');
    }
    else if(!$this.find($('#groupCode')).val()){
      $this.find($('#groupCode')).focus();
      sw_alert('error', '코드를 입력해주세요.');
    }
    else {
      $.ajax({
        url: '/group',
        data: $this.serialize(),
        type: 'POST',
        success: function (req) {
          if(req.status === 200){
            sw_alert('success', '성공');
            return window.location = '/';
          }
          else if(req.status === 204) {
            sw_alert('error', req.message);
          }
        },
        error: function (err) {
          sw_alert('error', err);
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