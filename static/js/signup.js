$(function () {
  $('#signupForm').on('submit', function () {
    var $this = $(this);
    var phone_re = /^01[016789]{1}-?[0-9]{3,4}-?[0-9]{4}$/;

    var user = {
      name: $this.find('#name'),
      id: $this.find('#id'),
      pw: $this.find('#pw'),
      pw_check: $this.find('#pwCheck'),
      phone: $this.find('#phone'),
      group_code: $this.find('#groupCode')
    }

    var data = {
      name: user.name.val(),
      id: user.id.val(),
      pw: user.pw.val(),
      pw_check: user.pw_check.val(),
      phone: user.phone.val(),
      group_code: user.group_code.val()
    }

    if(phone_re.test(data.phone)){
      data.phone = data.phone.replace('-', '');
    }
    else {
      user.phone.focus();
      sw_alert('error', '휴대번호를 다시 입력해주세요.');
      return false;
    }

    if(!data.name){
      user.name.focus();
      sw_alert('error', '이름을 입력해주세요.');
    }
    else if(!data.id){
      user.id.focus();
      sw_alert('error', '아이디를 입력해주세요.');
    }
    else if(!data.pw){
      user.pw.focus();
      sw_alert('error', '비밀번호를 입력해주세요.');
    }
    else if(data.pw.length < 6 || data.pw.length > 20){
      user.pw.focus();
      sw_alert('error', '비밀번호 범위를 확인해주세요.');
    }
    else if(!data.pw_check){
      user.pw_check.focus();
      sw_alert('error', '비밀번호 확인을 입력해주세요.');
    }
    else if(data.pw !== data.pw_check){
      user.pw_check.focus();
      sw_alert('error', '비밀번호 확인이 다릅니다.');
    }
    else {
      $.ajax({
        url: '/signup',
        data: data,
        type: 'POST',
        success: function (req) {
          if(req.status === 200){
            sw_alert('success', '가입완료');
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