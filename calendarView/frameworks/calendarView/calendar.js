// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Marco
// Date:      03.03.11
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('ui/label.js');

M.CalendarView = M.View.extend({

    type:'M.CalendarView',
    aktEvent:null,
    currentHour:null,
    currentMinute:null,
    idName:null,
    now:null,
    isLong:null,
    selectedDate:{},
    scale:null,
    timeLineStart:null,
    timeLineStop:null,


    render:function () {
        // check some time stuff
        if (!this.timeLineStart) {
            this.timeLineStart = 6;
        }
        if (!this.timeLineStop) {
            this.timeLineStop = 20;
        }
        if (this.timeLineStart < 0) {
            this.timeLineStart = 0;
        }
        if (this.timeLineStop > 23) {
            this.timeLineStop = 23;
        }
        if (this.timeLineStop < this.timeLineStart) {
            var temp = this.timeLineStart;
            this.timeLineStart = this.timeLineStop;
            this.timeLineStop = temp;
        }
        if (this.timeLineStop === this.timeLineStart) {
            this.timeLineStop += 1;
        }

        var diff = this.timeLineStop - this.timeLineStart;
        var timeline = '';
        var half = '';

        //prepare output
        for (var i = 0; i <= diff; i++) {
            timeline += '<p>' + this.pad(this.timeLineStart + i, 2) + ':00</p>';
            half += '<div class="half"></div><div class="half"></div>';
        }

        //build output
        this.html += '<div class="calendar_view long" id="' + this.id + '"' + this.style() + '>';
        this.html += this.buildWholeDayEventContainer();
        this.html += '<div class="eventContainer">' +
                '<div class="timeline">' + timeline +
                '</div>' +
                '<div class="calendar">' + half +
                '</div>' +
                '<div class="currentTime"><div class="currentTimeHeader"></div></div>' +
                '<div class="datesContainer">' +
                '<ul data-role="listview" class="dates"></ul>' +
                '</div>' +
                '</div>' +

                '</div>';
        return this.html;
    },

    findSeveralDaysEvents:function (_events) {

//        selectedDateStart
        var sds = M.Date.create(M.Date.create(this.selectedDate.getTimestamp()).format('dd.mm.yyyy 00:00:00')).getTimestamp();
//        selectedDateEnd
        var sde = M.Date.create(M.Date.create(this.selectedDate.getTimestamp()).format('dd.mm.yyyy 23:59:59')).getTimestamp();

        var severalDaysEvents = {};
        severalDaysEvents.start = [];
        severalDaysEvents.end = [];
        severalDaysEvents.wholeDay = [];

        for (var i = _events.length; i--;) {
//            event start
            var es = _events[i].start;
//            event end
            var ee = _events[i].end;

            _events[i].severalDay = true;

            if (es < sds && ee < sde) {
                //its a serveral days event that ends on the selected date
                _events[i].start = sds;
                sd = true;
            } else if (es > sds && ee > sde) {
                //its a serveral days event that starts on the selected date
                _events[i].end = sde;
                sd = true;
            } else if (es < sds && ee > sde) {
                //its a serveral days event that is a whole day event on the selected day
                _events[i].wholeDay = true;
            } else {
                delete _events[i].severalDay
            }

            if (_events[i].severalDay && _events[i].eventType === 'exchange' && _events[i].status === 0 && _events[i].status != '') {
                _events[i].wholeDay = true;
            }

        }
    },

    renderUpdate:function () {
        $('#' + this.id + ' .datesWholeDay').empty();
        $('#' + this.id + ' .dates').empty();
        var pos = 0;
        var _tmp = 0;
        var laufzeit = 0;

        var calendarData = [];
        var _events = [];
        /* Get the list view's content as an object from the assigned content binding */
        if (this.contentBinding && typeof(this.contentBinding.target) === 'object' && typeof(this.contentBinding.property) === 'string' && this.contentBinding.target[this.contentBinding.property]) {
            calendarData = this.contentBinding.target[this.contentBinding.property];
            if (calendarData && calendarData.length > 0) {
                _events = calendarData[0].events;
                this.selectedDate = calendarData[0].selectedDate;
            } else {
                this.selectedDate = {};
                _events = [];
            }

        } else {
            M.Logger.log('The specified content binding for the list view (' + this.id + ') is invalid!', M.WARN);
            return;
        }
//      stop running if there are no events
        if (!_events || _events.length <= 0) {
            return
        }

//        dates that span several days
        this.findSeveralDaysEvents(_events);

//        all single day events
        var events = [];
//        all whole day and several day events
        var eventsWholeDay = [];

        var template = this.templateView;

        if (!this.templateView.normal) {
            this.templateView.normal = this.templateView;
        }
        if (!this.templateView.wholeDay) {
            this.templateView.wholeDay = this.templateView;
        }
        for (var i = _events.length; i--;) {
//            FIS-260: remove all canceled appointments
            if (_events[i] && _events[i].actStatus != 'E0008') {
                if (_events[i].objectID) {
                    _events[i].eventid = _events[i].objectID;
                } else if (_events[i].itemid) {
                    _events[i].eventid = _events[i].itemid;
                }
                _events[i].start = _events[i].start;
                _events[i].end = _events[i].end;
                if (!_events[i].wholeDay) {
                    events.push(_events[i]);
                } else {
                    eventsWholeDay.push(_events[i]);
                }
            }
        }

        events = _.sortBy(events, function (e) {
            return e.start;
        });

        // find start position
        for (var i = 0; i < events.length; i++) {

            var event = events[i];
            var items = this.getAllOverlappingEvents(event, events);

            // search first free position
            var pos = 0;
            if (items.length > 0) {
                var p = pos;
                do {
                    pos = p;
                    for (var j in items) {
                        var item = items[j];
                        if (item['pos'] == p) p++;
                    }
                } while (p != pos)
            }
            event['level'] = 1;
            event['pos'] = pos;
        }

        // calculate level (number of appointments in a row)
        for (var i = 0; i < events.length; i++) {

            var event = events[i];
            var items = this.getAllOverlappingEvents(event, events);

            var level = event['pos'] + 1;
            if (items.length > 0) {
                // search highest position (level)
                for (var j in items) {
                    var item = items[j];
                    level = Math.max(level, item['pos'] + 1);
                    level = Math.max(level, item['level']);
                }
            }
            event['level'] = level;
        }

        this.now = M.Date.now();
        this.nowM = this.now.date.getTime();
        this.currentHour = this.now.format('HH');
        this.currentMinute = this.now.format('MM');
        var milliSecHeight = $('.calendar .half').outerHeight() / (30 * 60 * 1000);
        //current minute and current houre to milliseconds multiplied by the height of one millisecond plus upper padding of the calendar
        var curTimeTop = ((this.currentMinute * 1000 * 60) + ((this.currentHour - this.timeLineStart) * 1000 * 60 * 60)) * milliSecHeight + 20;
        $('#' + this.id + '.long .currentTime').css('top', curTimeTop + "px");

        //delete current events
        $('#' + this.id + ' .dates li').remove();

        if (events.length > 0) {
            this.renderCalendarEventViews(events, template.normal);
        }
        if (eventsWholeDay.length > 0) {
            this.renderCalendarEventViews(eventsWholeDay, template.wholeDay);
        }
    },

    renderCalendarEventViews:function (content, templateView) {
        /* Save this in variable that for later use within an other scope (e.g. _each()) */
        var that = this;

        _.each(content, function (item) {

            /*that.pos = item.pos;
             that.curID = item.eventid;
             that.level = item.level;*/

            that.aktEvent = item;

            /* Create a new object for the current template view */
            var obj = templateView.design({});

            /* If item is a model, assign the model's id to the view's modelId property */
            if (item.type === 'M.Model') {
                obj.modelId = item.m_id;
                /* Otherwise, if there is an id property, save this automatically to have a reference */
            } else if (item.id || !isNaN(item.id)) {
                obj.modelId = item.id;
            } else if (item[that.idName]) {
                obj.modelId = item[that.idName];
            }

            /* Get the child views as an array of strings */
            var childViewsArray = obj.childViews.split(' ');

            /* If the item is a model, read the values from the 'record' property instead */
            var record = item.type === 'M.Model' ? item.record : item;

            /* Iterate through all views defined in the template view */
            for (var i = childViewsArray.length; i--;) {
                /* Create a new object for the current view */
                obj[childViewsArray[i]] = obj[childViewsArray[i]].design({});

                var regexResult = null;
                if (obj[childViewsArray[i]].computedValue) {
                    /* This regex looks for a variable inside the template view (<%= ... %>) ... */
                    regexResult = /^<%=\s+([.|_|-|$|�|a-zA-Z]+[0-9]*[.|_|-|$|�|a-zA-Z]*)\s*%>$/.exec(obj[childViewsArray[i]].computedValue.valuePattern);
                } else {
                    regexResult = /^<%=\s+([.|_|-|$|�|a-zA-Z]+[0-9]*[.|_|-|$|�|a-zA-Z]*)\s*%>$/.exec(obj[childViewsArray[i]].valuePattern);
                }

                /* ... if a match was found, the variable is replaced by the corresponding value inside the record */
                if (regexResult) {
                    switch (obj[childViewsArray[i]].type) {
                        case 'M.LabelView':
                        case 'M.ButtonView':
                        case 'M.ImageView':
                            obj[childViewsArray[i]].value = record[regexResult[1]];
                            break;
                    }
                }
            }

            /* set the list view as 'parent' for the current list item view */
            obj.calendarView = that;

            /* Render calendar event view
             if (that.aktEvent.wholeDay) {
             $('#' + that.id + ' .datesWholeDay').append(obj.render(that.isLong, that.id));
             } else {
             $('#' + that.id + ' .dates').append(obj.render(that.isLong, that.id));
             }*/

            /* Render calendar event view */
            if (that.aktEvent.wholeDay) {
                //                $('#' + that.id + ' .datesWholeDay').append(obj.render(that.isLong, that.id));
                $('#' + that.id + ' .datesWholeDay').append(obj.render(that.scale, that.timeLineStart, that.timeLineStop, that.id));
            } else {
                //                $('#' + that.id + ' .dates').append(obj.render(that.isLong, that.id));
                $('#' + that.id + ' .dates').append(obj.render(that.scale, that.timeLineStart, that.timeLineStop, that.id));
            }

            obj.registerEvents();

            /* ... once it is in the DOM, make it look nice */
            for (var i = childViewsArray.length; i--;) {
                obj[childViewsArray[i]].theme();
            }
        });
        this.themeUpdate();
    },

    theme:function () {
        $('#' + this.id + ' .dates').listview();
        $('#' + this.id + ' .datesWholeDay').listview();
    },

    themeUpdate:function () {
        $('#' + this.id + ' .datesWholeDay').listview('refresh');
        $('#' + this.id + ' .dates').listview('refresh');

        //if there are wholeDay-events add the height of them to the calendar view height
        //BUGFIX: https://support.mwaysolutions.com/jira/browse/FIS-296
        var dwdHeight = $('#' + this.id + ' .datesWholeDay').outerHeight();
        var originator = $('#' + this.id + '.calendar_view.long').css('min-height');
        $('#' + this.id + '.calendar_view.long').css('height', (parseInt(originator) + dwdHeight) + 'px');
    },

    style:function () {
        var html = '';

        return html;
    },

    getAllOverlappingEvents:function (event, allEvents) {
        var childs = new Array();

        for (i in allEvents) {

            var cEvent = allEvents[i];
            if (cEvent === event) continue;

            //if(cEvent.end < event.start && cEvent.start > event.end)
            if ((event.start <= cEvent.start && event.end > cEvent.start) ||
                    (cEvent.start < event.start && cEvent.end > event.start)) {
                childs.push(cEvent);
            }
        }
        return childs;
    },

    setCurrentHour:function (hour) {
        //TODO: Format bestimmen
        if (hour)
            this.currentHour = hour;
    },

    getHours:function (date) {
        return new Date(date).getHours();
    },

    getMinutes:function (date) {
        return new Date(date).getMinutes();
    },

    buildWholeDayEventContainer:function () {
        var html = M.StringBuilder.create();
        html.append('<div class="datesWholeDayContainer">');
        html.append('<ul data-role="listview" class="datesWholeDay"></ul>');
        html.append('</div>');
        return html.toString();
    },

    calendarEventSelected:function (listItemId, event, nextEvent) {
        var calendarEvent = M.ViewManager.getViewById(listItemId);

        /* delegate event to external handler, if specified */
        if (nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [listItemId, calendarEvent.modelId]);
        }
    },

    /**
     * This method removes all of the list view's items by removing all of its content in the DOM. This
     * method is based on jQuery's empty().
     */
    removeAllItems:function () {
        $('#' + this.id + ' .datesWholeDay').empty();
        $('#' + this.id + ' .dates').empty();
    },
    
    pad:function (number, length) {

        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
});