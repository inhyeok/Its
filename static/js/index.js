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
                    label: label,
                    title: req.items[i].title,
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
      $('#eventTitle').val(e.title);
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
    $.ajax({
      url: '/events',
      type: 'PUT',
      data: $this.serialize(),
      success: function (req) {
        console.log(req);
        swal({
          title: '성공',
          type: 'success'
        })
      },
      error: function (err) {
        console.log(err);
      }
    })
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
});