// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Marco
// Date:      03.03.11
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('calendar.js');

M.CalendarEventView = M.View.extend({

    type: 'M.CalendarEventView',

     /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['tap'],

    /**
     * saves reference to parent view (a calendarview)
     */
    calendarView: null,

    //that.scale, that.timeLineStart, that.timeLineStop, that.id
    render: function(scale, timeLineStart, timeLineStop, mId) {
        var _this = this.calendarView.aktEvent;
        var ident = '#date_'+this.id;
        var width = 95 / _this.level;
        var fontsize = '11px';
        var start_hour = this.calendarView.getHours(_this.start);
        var end_hour = this.calendarView.getHours(_this.end);
        var start_minute = this.calendarView.getMinutes(_this.start);
        var end_minute = this.calendarView.getMinutes(_this.end);
        var borderTopHeight = 1;
        if (M.DeviceSwitch.device == 'sp') {
            var hourHeight = (($('.calendar .half').outerHeight())*2);
            var minuteHeight = (($('.calendar .half').outerHeight())/30);
        }else{
            var hourHeight = 66;//(($('.calendar .half').outerHeight()+borderTopHeight)*2);
            var minuteHeight = (($('.calendar .half').outerHeight()+borderTopHeight)/30);
        }

        var milHour = 3600000;
        if(_this.wholeDay){

            
        }else{

            var top = 0;

            var height = 0;
            var diff = 0;

            if(start_hour >= timeLineStart){
                top = (start_hour-timeLineStart) * hourHeight;
                top += start_minute * minuteHeight;
            }else{
                diff = ((timeLineStart - start_hour) * milHour);
            }

            var halfHourHeight  = this.getTotalHeight($('.calendar .half'));
            var seconds         = Math.round(((_this.end - _this.start)-diff) / 1000);
            height = (seconds*(halfHourHeight) / (30*60))-1;

            top += 10;

            var left = $('.timeline').outerWidth() + $('.calendar').width()/_this.level * _this.pos;
            left = 95/_this.level * _this.pos + 5;
            
            var css = 'data-theme="c" style="';
            css += 'top:'   +top+'px; ';
            css += 'height:'+height+'px; ';
            css += 'width:' +width+'%; ';
            css += 'left:'  +left+'%; ';
            css += 'font-size:'+fontsize;
            css += '"';

        }

        this.html = '' +
        '<li id="' + this.id + '"' + css + this.style() + "" + '>';
        if(this.childViews) {
            this.html += '<a href="#">';
            this.renderChildViews();
            this.html += '</a>';
        }
        if(_this.severalDay) {
            this.html += '<span class="several-day"></span>';
        }
        this.html += '</li>';

        return this.html;
    },

    style: function() {
        var status = String(this.calendarView.aktEvent.actStatus) ? ' status_' + this.calendarView.aktEvent.actStatus : '';
        var html = ' class="' + this.calendarView.aktEvent.eventType + status + ' date';
        if(this.cssClass) {
            html += this.cssClass;
        }
        html += '"';
        return html;
    },

    // This is a helper because
    // jQuery outerHeight() is nor always working
    getTotalHeight: function(obj) {
        var totalHeight  = obj.height();
        var borderTop    = parseInt(obj.css('border-top-width'));
        var borderBottom = parseInt(obj.css('border-bottom-width'));
        if (borderTop)    totalHeight += borderTop;
        if (borderBottom) totalHeight += borderBottom;
        return totalHeight;
    },
    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for list item views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            tap: {
                target: this.calendarView,
                action: 'calendarEventSelected'
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    }
});