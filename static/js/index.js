$(document).ready(function () {
  $('#calendar').fullCalendar({
    // googleCalendarApiKey: 'AIzaSyCxuLEwSrp8wC4y5uu6qm-L_mXeouAPWgs',
    // events: {
    //   googleCalendarId: 'm8relal0t9dsp6nrhjcpgpojc0@group.calendar.google.com'
    // }
    // defaultView: 'agendaDay'
    // events: [
    //   {title: 'event A', start: '2015-12-29', end: '2016-01-12' },
    //   {title: 'event B', start: '2015-12-30', end: '2016-01-02' },
    //   {title: 'event C', start: '2016-01-01', end: '2016-01-04' },
    //   {title: 'event D', start: '2016-01-20', end: '2016-01-29' }
    // ],
    // resources: [
    //   { id: 'a', title: 'Room A' },
    //   { id: 'b', title: 'Room B' },
    //   { id: 'c', title: 'Room C' },
    //   { id: 'd', title: 'Room D' }
    // ]
  });
  // get_events
  $('#getEvents').on('click', function () {
    $.ajax({
      url: '/events',
      // data: {a:'abs'},
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