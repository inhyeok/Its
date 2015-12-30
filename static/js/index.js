$(document).ready(function () {
  $('#calendar').fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    // googleCalendarApiKey: 'AIzaSyCxuLEwSrp8wC4y5uu6qm-L_mXeouAPWgs',
    // events: {
    //   googleCalendarId: 'm8relal0t9dsp6nrhjcpgpojc0@group.calendar.google.com'
    // },
    editable: true,
    eventStartEditable: true,
    eventDurationEditable: true,
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
                  events.push({
                    id: req.items[i].id,
                    title: req.items[i].title,
                    content: req.items[i].content,
                    start: req.items[i].started_at,
                    end: req.items[i].finished_at,
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
      console.log(e);
      $('#eventId').val(e.id);
      $('#eventTitle').val(e.title);
      $('#eventContent').val(e.content);
      $('#eventStart').val(moment(e.start).format('YYYY-MM-DD HH:mm'));
      $('#eventFinish').val(moment(e.end).format('YYYY-MM-DD HH:mm'));
      $('#eventColor').val(e.color);
      $('#myModal').modal('show');
    }
  });

  $('#eventUpdate').on('submit', function () {
    $this = $(this);
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

  $('#eventUpdateColors > svg > rect').on('click', function () {
    $this = $(this);
    $('#eventUpdateColors > svg > rect').css('opacity', 0.3);
    $this.css('opacity', 1);
    $('#eventColor').val($this.attr('color'));
  });

  sw_alert = function (type, message) {
    swal({
      title: type,
      type: type,
      text: message
    });
  }

});