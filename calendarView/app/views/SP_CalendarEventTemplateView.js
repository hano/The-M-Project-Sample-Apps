// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 0.0.9
//
// Project: CalenderViewTest
// Page: SP_CalendarEventTemplateView
// ==========================================================================

M.SP_CalendarEventTemplateView = M.CalendarEventView.design({
    /* describes how a calendar event looks in calendar */

    normal: M.CalendarEventView.design({

        childViews: 'startLabel endLabel descriptionLabel guestLabel typeLabel',

        target: M.CalendarManager,
        action: 'clickOnEvent',

        startLabel: M.LabelView.design({
            isInline: YES,
            computedValue: {
                valuePattern: '<%= start %>',
                operation: function(v) {
                    var date = M.Date.create(v)
                    return date.format('HH') + ":" + date.format('MM') + '-';
                }
            },
            cssClass: 'calendar_event_start'

        }),

        endLabel: M.LabelView.design({
            isInline: YES,
            computedValue: {
                valuePattern: '<%= end %>',
                operation: function(v) {
                    var date = M.Date.create(v)
                    return date.format('HH') + ":" + date.format('MM');
                }
            },
            cssClass: 'calendar_event_end'
        }),

        descriptionLabel: M.LabelView.design({
            valuePattern: '<%= description  %>',
            cssClass: 'calendar_event_descr'
        }),

        guestLabel: M.LabelView.design({
            valuePattern: '<%= guest  %>',
            cssClass: 'hide'
        }),

        typeLabel: M.LabelView.design({
            valuePattern: '<%= type  %>',
            cssClass: 'hide'
        })
    }),

    wholeDay: M.CalendarEventView.design({

        childViews: 'descriptionLabel',

        target: M.CalendarManager,
        action: 'clickOnEvent',

        descriptionLabel: M.LabelView.design({
            valuePattern: '<%= description  %>',
            cssClass: 'calendar_event_descr'
        })
    })

});
