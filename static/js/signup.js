$(document).ready(function () {
  $('#signupForm').on('submit', function () {
    $this = $(this);
    if(!$this.find($('#name')).val()){
      $this.find($('#name')).focus();
      sw_alert('error', '이름을 입력해주세요.');
    }
    else if(!$this.find($('#id')).val()){
      $this.find($('#id')).focus();
      sw_alert('error', '아이디를 입력해주세요.');
    }
    else if(!$this.find($('#pw')).val()){
      $this.find($('#pw')).focus();
      sw_alert('error', '비밀번호를 입력해주세요.');
    }
    else if($this.find($('#pw')).val().length < 6 || $this.find($('#pw')).val().length > 20){
      $this.find($('#pw')).focus();
      sw_alert('error', '비밀번호 범위를 확인해주세요.');
    }
    else if(!$this.find($('#pwCheck')).val()){
      $this.find($('#pwCheck')).focus();
      sw_alert('error', '비밀번호 확인을 입력해주세요.');
    }
    else if($this.find($('#pw')).val() !== $this.find($('#pwCheck')).val()){
      $this.find($('#pwCheck')).focus();
      sw_alert('error', '비밀번호 확인이 다릅니다.');
    }
    else {
      $.ajax({
        url: '/signup',
        data: $this.serialize(),
        type: 'POST',
        dataType: 'json',
        success: function (req) {
          if(req.status === 200){
            sw_alert('success', '가입완료');
            // return true
            return window.location = '/login';
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