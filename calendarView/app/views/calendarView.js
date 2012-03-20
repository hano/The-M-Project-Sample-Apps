// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: calendarView
// View: calendarView
// ==========================================================================

calendarView.calendarView = M.PageView.design({

   // Use the 'events' property to bind events like 'pageshow'
    events: {
        pageshow: {
            target: calendarView.AppController,
            action: 'init'
        }
    },

    childViews: 'content',

    /*header: M.ToolbarView.design({
        value: 'HEADER',
        anchorLocation: M.TOP
    }),*/

    content: M.ScrollView.design({

            //childViews: 'calendarToolbar calendar datePickerPopUp',
            childViews: 'calendar',

            /*calendarToolbar: M.ToolbarView.design({

                cssClass: 'contentHeader customHeader',

                childViews: 'title dayButtonGroup today',

                title: M.LabelView.design({

                    value: '',

                    contentBinding: 'M.CalendarManager.weeknumTxt',

                    anchorLocation: M.LEFT

                }),

                dayButtonGroup: M.ButtonGroupView.design({

                    childViews: 'prev Monday Tuesday Wednesday Thursday Friday next',

                    anchorLocation: M.CENTER,

                    prev: M.ButtonView.design({
                        value: '<'
                        ,target: M.CalendarManager
                        ,action: 'switchToPrevWeek'
                    }),
                    Monday: M.ButtonView.design({
                        value: M.I18N.l('monday'),
                        target: M.CalendarManager
                        ,action: 'initializeDatePage'
                        ,contentBinding: 'M.CalendarManager.weekButtonGroup.mo'
                        ,applyTheme: NO
                    }),
                    Tuesday: M.ButtonView.design({
                        value: M.I18N.l('tuesday')
                        ,target: M.CalendarManager
                        ,action: 'initializeDatePage'
                        ,contentBinding: 'M.CalendarManager.weekButtonGroup.tu'
                        ,applyTheme: NO
                    }),
                    Wednesday: M.ButtonView.design({
                        value: M.I18N.l('wednesday')
                        ,target: M.CalendarManager
                        ,action: 'initializeDatePage'
                        ,contentBinding: 'M.CalendarManager.weekButtonGroup.we'
                        ,applyTheme: NO
                    }),
                    Thursday: M.ButtonView.design({
                        value: M.I18N.l('thursday')
                        ,target: M.CalendarManager
                        ,action: 'initializeDatePage'
                        ,contentBinding: 'M.CalendarManager.weekButtonGroup.th'
                        ,applyTheme: NO
                    }),
                    Friday: M.ButtonView.design({
                        value: M.I18N.l('friday')
                        ,target: M.CalendarManager
                        ,action: 'initializeDatePage'
                        ,contentBinding: 'M.CalendarManager.weekButtonGroup.fr'
                        ,applyTheme: NO
                    }),
                    next: M.ButtonView.design({
                        value: '>'
                        ,target: M.CalendarManager
                        ,action: 'switchToNextWeek'
                    })
                }),

                today: M.ButtonView.design({
                    anchorLocation: M.RIGHT,
                    value: M.I18N.l('today'),
                    target: M.CalendarManager,
                    action: 'switchToToday'
                })
            }),*/

            calendar: M.CalendarView.design({

                contentBinding: {
                    target: calendarView.AppController,
                    property: 'events'
                },
                templateView: M.CalendarEventTemplateView,
                idName: 'eventid',
                scale: YES,
                timeLineStart : 8,
                timeLineStop : 14

            })

        })

});

