// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: calendarView
// Controller: AppController
// ==========================================================================

calendarView.AppController = M.Controller.extend({

    events: [],

    init: function(isFirstLoad) {
        if(isFirstLoad) {

            var dates = [];
            dates.push(M.CalendarModel.init('Oh look this event its from 10:00 till 11:00', 1332234000000, 1332234000000 + 1000*60*60*1));
            dates.push(M.CalendarModel.init('event description', M.Date.now().date.getTime() - 1000*60*60*1, M.Date.now().date.getTime() + 1000*60*60*1));
            var wholeDayEvent = M.CalendarModel.init('Whole day events are also supported', M.Date.now().date.getTime(), M.Date.now().date.getTime() + 1000*60*60*2);
            wholeDayEvent.wholeDay = true;
            dates.push(wholeDayEvent);

            var api = [{
                events : dates,
                selectedDate: M.Date.now()
            }]



           calendarView.AppController.set('events', api);
        }
    }

});
