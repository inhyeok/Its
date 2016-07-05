$(function () {
  $('#calendar').fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    // googleCalendarApiKey: 'AIzaSyCxuLEwSrp8wC4y5uu6qm-L_mXeouAPWgs',
    // events: {
    //   googleCalendarId: 'm8relal0t9dsp6nrhjcpgpojc0@group.calendar.google.com'
    // },
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    lang: 'ko',
    editable: true,
    resizeable: true,
    eventStartEditable: true,
    eventDurationEditable: true,
    slotEventOverlap: false,
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
                    allDay: req.items[i].all_day,
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
      $('#myModal .form-control').val('');
      $('#eventStart').val(moment(date).format('YYYY-MM-DD HH:mm'));
      $('#eventMethod').val('POST');
      $('#myModal').modal('show');
    },
    eventClick: function (e) {
      $('#eventId').val(e.id);
      $('#eventTitle').val(e.title);
      $('#eventContent').val(e.content);
      $('#eventStart').val(moment(e.start).format('YYYY-MM-DD HH:mm'));
      $('#eventFinish').val(moment(e.end).format('YYYY-MM-DD HH:mm'));
      $('#eventColor').val(e.color);
      $('#eventMethod').val('PUT');
      $('#myModal').modal('show');
      // for(var i = 0; i < $('#eventUpdateColors > svg > rect').length; i++){
      //   console.log($('#eventUpdateColors > svg > rect')[i]);
      //   if($('#eventColor').val() === ){
      //     console.log('dddd');
      //     break;
      //   }
      // }
    },
    eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
      item = {
        event_id: event.id,
        event_title: event.title,
        event_content: event.content,
        event_started_at: moment(event.start).format('YYYY-MM-DD HH:mm'),
        event_finished_at: moment(event.end).format('YYYY-MM-DD HH:mm'),
        event_color: event.color
      }
      $.ajax({
        url: '/events',
        type: 'PUT',
        data: item,
        success: function (req) {
          console.log(req);
          if(req.status === 200){
            sw_alert('success', req.message);
            return true
          }
          else {
            sw_alert('error', req.message);
          }
        },
        error: function (err) {
          console.log(err);
        }
      });
    },
    eventResize: function (event, delta, revertFunc) {
      item = {
        event_id: event.id,
        event_title: event.title,
        event_content: event.content,
        event_started_at: moment(event.start).format('YYYY-MM-DD HH:mm'),
        event_finished_at: moment(event.end).format('YYYY-MM-DD HH:mm'),
        event_color: event.color
      }
      $.ajax({
        url: '/events',
        type: 'PUT',
        data: item,
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
      });
    }
  });

  $('#eventUpdate').on('submit', function () {
    $this = $(this);
    if(!moment($this.find($('#eventStart')).val(), 'YYYY-MM-DD HH:mm', true).isValid() || !moment($this.find($('#eventFinish')).val(), 'YYYY-MM-DD HH:mm', true).isValid()){
      sw_alert('error', '시간 입력 형식을 다시 확인해주세요.');
      return false
    }
    if(moment($this.find($('#eventStart')).val()).format('YYYY-MM-DD HH:mm') >= moment($this.find($('#eventFinish')).val()).format('YYYY-MM-DD HH:mm')){
      sw_alert('error', '끝 날짜는 시작 날짜보다 늦을 수 없습니다.');
      return false
    }
    $.ajax({
      url: '/events',
      type: $('#eventMethod').val(),
      data: $this.serialize(),
      dataType: 'json',
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

  __ = $('input[data-datetimepicker]')
  __.datetimepicker({
    format: "YYYY-MM-DD HH:mm"
  });

  sw_alert = function (type, message) {
    swal({
      title: type,
      type: type,
      text: message,
      timer: 700
    });
  }

});