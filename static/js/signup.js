$(document).ready(function () {
  $('#signupForm').on('submit', function () {
    $this = $(this);
    if(!$this.find($('#name')).val()){
      $this.find($('#name')).focus();
      sw_alert('error', '아따 이름을 입력 안했자너 !!!');
    }
    else if(!$this.find($('#id')).val()){
      $this.find($('#id')).focus();
      sw_alert('error', '아따 아이디를 입력 안했자너 !!!');
    }
    else if(!$this.find($('#pw')).val()){
      $this.find($('#pw')).focus();
      sw_alert('error', '아따 비밀번호를 입력 안했자너 !!!');
    }
    else if($this.find($('#pw')).val().length < 6 || $this.find($('#pw')).val().length > 12){
      $this.find($('#pw')).focus();
      sw_alert('error', '아따 비밀번호 범위가 다르다 !!!');
    }
    else if(!$this.find($('#pwCheck')).val()){
      $this.find($('#pwCheck')).focus();
      sw_alert('error', '아따 비밀번호 확인을 입력 안했자너 !!!');
    }
    else if($this.find($('#pw')).val() !== $this.find($('#pwCheck')).val()){
      $this.find($('#pwCheck')).focus();
      sw_alert('error', '아따 비밀번호 확인 입력 다시해 !!!');
    }
    else {
      $.ajax({
        url: '/signup',
        data: $this.serialize(),
        type: 'POST',
        success: function (req) {
          if(req.status === 200){
            sw_alert('success', '가입완료');
            return true
          }
          else if(req.status === 204) {
            sw_alert('error', req.message);
          }
          // return window.location = '/';
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