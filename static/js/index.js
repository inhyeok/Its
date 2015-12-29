$(document).ready(function () {
  $('#calendar').fullCalendar({
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
                    var title = moment(start).format('HH:mm') + '~' + moment(end).format('HH:mm') + '  ' + req.items[i].title;
                  }
                  else {
                    var title = moment(start).format('YYYY-MM-DD') + '~' + moment(end).format('YYYY-MM-DD') + '  ' + req.items[i].title;
                  }
                  events.push({
                    title: title,
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
    }
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