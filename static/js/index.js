$(document).ready(function () {
  $('#calendar').fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    eventSources: [
      {
        events: function (s,e,t,c) {
          $.ajax({
            url: '/events',
            type: 'GET',
            success: function (req) {
              if(req.status === 200) {
                var events = [];
                for(i in req.items) {
                  var start = moment(req.items[i].started_at).format('YYYY-MM-DD');
                  var end = moment(req.items[i].finished_at).format('YYYY-MM-DD');

                  if(start === end) {
                    var label = moment(start).format('HH:mm') + '~' + moment(end).format('HH:mm') + '  ' + req.items[i].title;
                  }
                  else {
                    var label = moment(start).format('YYYY-MM-DD') + '~' + moment(end).format('YYYY-MM-DD') + '  ' + req.items[i].title;
                  }
                  events.push({
                    id: req.items[i].id,
                    title: label,
                    title_basic: req.items[i].title,
                    content: req.items[i].content,
                    start: start,
                    end: end,
                    color: req.items[i].color
                  })
                }
                return c(events);
              }
            },
            error: function (err) {
              console.log(err);
            }
          });
        }
      }
    ],
    dayClick: function (date) {
      alert(moment(date).format('YYYY-MM-DD'));
    },
    eventClick: function (e) {
      console.log(JSON.stringify(e));
      $('#eventId').val(e.id);
      $('#eventTitle').val(e.title_basic);
      $('#eventContent').val(e.content);
      $('#eventStart').val(moment(e.start).format('YYYY-MM-DD HH:mm'));
      $('#eventFinish').val(moment(e.end).format('YYYY-MM-DD HH:mm'));
      $('#eventColor').val(e.color);
      // console.log($('#eventTitle'));
      $('#myModal').modal('show');
    }
  });

  $('#eventUpdate').on('submit', function () {
    $this = $(this);
    // console.log(moment($this.find($('#eventStart')).val(), 'YYYY-MM-DD HH:mm', true).isValid(), moment($this.find($('#eventFinish')).val(), 'YYYY-MM-DD HH:mm', true).isValid());
    if(!moment($this.find($('#eventStart')).val(), 'YYYY-MM-DD HH:mm', true).isValid() || !moment($this.find($('#eventFinish')).val(), 'YYYY-MM-DD HH:mm', true).isValid()){
      sw_alert('error', '시간 입력 형식을 다시 확인해주세요.');
      return false
    }
    $.ajax({
      url: '/events',
      type: 'PUT',
      data: $this.serialize(),
      success: function (req) {
        console.log(req);
        if(req.status === 200){
          sw_alert('success', req.message);
          $('#myModal').modal('hide');
          return true
        }
        else {
          sw_alert('error', req.message);
        }
      },
      error: function (err) {
        console.log(err);
      }
    })
    return false
  });

  $('#getEvents').on('click', function () {
    $.ajax({
      url: '/events',
      type: 'GET',
      success: function (req) {
        if(req.status === 200){
          // return true
          return console.log(req);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  });

  sw_alert = function (type, message) {
    swal({
      title: type,
      type: type,
      text: message
    });
  }

});