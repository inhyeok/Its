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
                // $(req).find('items').each(function (item) {
                // $.each(req.items, function (item) {
                for(i in req.items) {
                  events.push({
                    title: req.items[i].title,
                    content: req.items[i].content,
                    start: moment(req.items[i].started_at).format('YYYY-MM-DD'),
                    end: moment(req.items[i].finished_at).format('YYYY-MM-DD')
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