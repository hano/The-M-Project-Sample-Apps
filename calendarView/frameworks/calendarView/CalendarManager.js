    // ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 0.0.9
//
// Project: mobileCRM
// Controller: CalendarManager
M.CalendarManager = M.Controller.extend({

    dispDay: null,
    weekRange: null,
    weekButtonGroup: null,
    weeknum: '',
    weeknumTxt: '',
    year: '',

    init: function(isFirstLoad) {

    }

    ,hilightDayButtonOnTerminePage: function(position){

    var buttonGroup = M.ViewManager.getView('CalendarPage', 'dayButtonGroup');

       var childViews = $.trim(buttonGroup.childViews).split(' ');
       for(var i in childViews) {
           var button = M.ViewManager.getView(buttonGroup, childViews[i]);
           if(button){
               if(position == this.getDayIndexofButtonGroup(button.id)){
                   buttonGroup.setActiveButton(button);
               }
           }
       }

    }

    ,clickOnEvent:function(viewId, objectId){
        //request GET_ACTIVITY
        var that = this;
        var onSuccess = function(data) {
            if(data && data.Activity)
            {
                //TODO: -- mobileCRM.ActivityController.set('businessPartner', []);
                //TODO: -- mobileCRM.ActivityController.set('contactList', []);
                //TODO: -- mobileCRM.ActivityController.set('actActivity', data.Activity);
                //redirect Page
                //M.Logger.log('switch to activity: ' + objectId, M.INFO);
                //TODO: -- mobileCRM.PageController.gotoTerminDetailsPage();
            }
        }
        //TODO: -- mobileCRM.StorageController.getActivity({objectID: objectId, onSuccess: onSuccess});
    }

    ,getDayIndexofButtonGroup : function(viewId){

        var dayIndex = null;
        $('#' + viewId).parent().children().each( function(index,el) {
            if($(el).attr('id') === viewId) {
                dayIndex = index; // +1 because in Date obj, monday is 1 not 0
            }
        });
        return dayIndex;
    }

    ,switchToNextWeek: function(viewId){
        //getWeeknumm
        var wn = this.weeknum;
        //increment weeknum and set properties
        this.updateWeekProperties(wn+=1);
    }

    ,switchToPrevWeek: function(viewId){
        //getWeeknumm
        var wn = this.weeknum;
        //decrement weeknum and set properties
        this.updateWeekProperties(wn-=1);
    }

    ,updateWeekProperties: function(weeknum){
        //set weeknum
        this.setWeeknum(weeknum);
        //setMonday
        this.hilightDayButtonOnTerminePage(1);

        var date = M.Date.getDateByWeekdayAndCalendarWeek(this.weeknum, 1, this.year);

        this.setSelectedDay(date);
    }

    ,switchToTodayAndCalendarView: function(){
        this.switchToToday();
        //TODO: -- mobileCRM.PageController.gotoTerminePage();
    }

    ,switchToToday: function(){
        //TODO:
        var thisDayFromServer = M.UtilityManager.aktDate.date;
        //set current weeknumber
       //TODO:
       this.setSelectedDay(M.UtilityManager.aktDate);
    }

    ,getWeekRange: function(date){
        //Freitag = 5 - currentDay
        //Montag = 1 - currentDay

        var _date = '';

        if(!date){
            var tmp
                    //TODO:
            if(M.UtilityManager.aktDate){
                tmp = M.UtilityManager.aktDate;
            }else{
                tmp = M.Date.now();
            }
            _date = tmp;
        }else{
            _date = date;
        }

        var currentDay = _date.date.getDay();

        var obj = {
            sun : _date.daysFromDate(0 - currentDay),
            mon : _date.daysFromDate(1 - currentDay),
            tue : _date.daysFromDate(2 - currentDay),
            wed : _date.daysFromDate(3 - currentDay),
            thu : _date.daysFromDate(4 - currentDay),
            fri : _date.daysFromDate(5 - currentDay),
            sat : _date.daysFromDate(6 - currentDay)
        }

        //weekrange must be array
        var x = [];
        x[0] = obj;

        this.set('weekRange', x);

        return obj;
    }


    ,doRequestForSingleDay: function(dateToShow){
        var obj = {
            date: dateToShow
        }
        //TODO: -- mobileCRM.ActivityController.getActivitiesSingleDay(obj);
    }

    ,clickAddActivity: function(){
        //TODO: -- mobileCRM.ActivityController.newActivityReset();
        //TODO: -- mobileCRM.PageController.gotoActivityCreatePage();
    }

    ,clickDatePicker: function(viewId){
        this.toggleDatePickerPopup();
    }

    ,toggleDatePickerPopup: function(viewId) {
        M.ViewManager.getView('CalendarPage', 'datePickerPopUp').toggle();
    }

    ,setValueAndToggleDatePicker: function(date){
        M.ViewManager.getView('CalendarPage', 'datePickerPopUp').toggle();

        if(M.DeviceSwitch.device === 'tablet') {
            this.setSelectedDay(date);
        } else if(M.DeviceSwitch.device === 'sp') {
            //TODO:
            M.UtilityManager.getSetSelectedDate(date);
            this.sp_setDate();
            this.setWeeknum(date.getWeeknum());
            this.doRequestForSingleDay(date);
        }
    }

    //DIRTY

    ,toggleDatePickerPopupForJubilee: function(viewId) {
        M.ViewManager.getView('ContactPersonCreatePage', 'datePickerPopUpJubilee').toggle();
    }

    ,setValueAndToggleDatePickerJubilee: function(val){
        var input = M.ViewManager.getView('ContactPersonCreatePage', 'inputJubilee');
        input.setValue(val.format('dd.mm.yyyy'));
        M.ViewManager.getView('ContactPersonCreatePage', 'datePickerPopUpJubilee').toggle();
    }

    ,toggleDatePickerPopupForGpSearch: function(viewId) {
        M.ViewManager.getView('BusinessPartnerSearchPage', 'datePickerPopUpLastContact').toggle();
    }

    ,setValueAndToggleDatePickerGpSearch: function(val){
        var input = M.ViewManager.getView('BusinessPartnerSearchPage', 'lastContactInput');
        input.setValue(val.format('dd.mm.yyyy'));
        M.ViewManager.getView('BusinessPartnerSearchPage', 'datePickerPopUpLastContact').toggle();
    }

    ,toggleDatePickerPopupForNeuerTerminBeginDate: function(viewId) {
        M.ViewManager.getView('ActivityCreatePage', 'datePickerPopUpBeginDate').toggle();
    }

    ,setValueAndToggleDatePickerBeginDate: function(val){
        var input = M.ViewManager.getView('ActivityCreatePage', 'inputBeginDate');
        input.setValue(val.format('dd.mm.yyyy'));
        // Check EndDate
        var inputEndDate = M.ViewManager.getView('ActivityCreatePage', 'inputEndDate');
        var endDate = inputEndDate.value ? M.Date.create(inputEndDate.value) : '';
        if (!endDate || endDate.date.getTime() < val.date.getTime()) {
            inputEndDate.setValue(val.format('dd.mm.yyyy'));
        }
        M.ViewManager.getView('ActivityCreatePage', 'datePickerPopUpBeginDate').toggle();
    }

    ,toggleDatePickerPopupForNeuerTerminEndDate: function(viewId) {
        M.ViewManager.getView('ActivityCreatePage', 'datePickerPopUpEndDate').toggle();
    }

    ,setValueAndToggleDatePickerEndDate: function(val){
        var input = M.ViewManager.getView('ActivityCreatePage', 'inputEndDate');
        input.setValue(val.format('dd.mm.yyyy'));
        // Check BeginDate
        var inputBeginDate = M.ViewManager.getView('ActivityCreatePage', 'inputBeginDate');
        var beginDate = inputBeginDate.value ? M.Date.create(inputBeginDate.value) : '';
        if (!beginDate || beginDate.date.getTime() > val.date.getTime()) {
            inputBeginDate.setValue(val.format('dd.mm.yyyy'));
        }
        M.ViewManager.getView('ActivityCreatePage', 'datePickerPopUpEndDate').toggle();
    }

    ,checkTimeForNeuerTermin: function(beginTimeHasChanged) {
        //TODO:
        var startDate   = M.UtilityManager.getViewValue('ActivityCreatePage', 'inputBeginDate');
        //TODO:
        var startTime   = M.UtilityManager.getSelection('ActivityCreatePage', 'beginTimeInput');
        //TODO:
        var stopDate    = M.UtilityManager.getViewValue('ActivityCreatePage', 'inputEndDate');
        //TODO:
        var stopTime    = M.UtilityManager.getSelection('ActivityCreatePage', 'endTimeInput');

        if (!startDate || !stopDate || !M.Date.create(startDate) || !M.Date.create(endDate)){
            startDate = endDate = '01.01.2000';
        }

        //TODO: var beginDate   = mobileCRM.RemoteController.getDateTime(startDate, startTime);
        //TODO: var endDate     = mobileCRM.RemoteController.getDateTime(stopDate,  stopTime);
        if (beginDate >= endDate) {
            if (beginTimeHasChanged) {
                endDate  = beginDate + 30 * 60 * 1000;
                //TODO: mobileCRM.UtilityController.setSelection('ActivityCreatePage', 'endTimeInput', M.Date.create(endDate).format('HH:MM:00'));
            } else {
                beginDate = endDate  - 30 * 60 * 1000;
                //TODO: mobileCRM.UtilityController.setSelection('ActivityCreatePage', 'beginTimeInput', M.Date.create(beginDate).format('HH:MM:00'));
            }
        }
    }

    ,beginTimeForNeuerTerminChanged: function() {
        this.checkTimeForNeuerTermin(true);
    }

    ,endTimeForNeuerTerminChanged: function() {
        this.checkTimeForNeuerTermin(false);
    }

    ,setWeekRange: function(){
        //TODO:
        this.set('weekRange', M.CalendarManager.getWeekRange(M.UtilityManager.aktDate));
    }

    /**
     * Set the given weeknumber, default is the weeknum of today
     */
    ,setWeeknum: function(weeknum){
        var wn = weeknum;
        if(!wn && wn !== 0){
            //TODO
            wn = M.UtilityManager.aktDate.getWeeknum();
        }
        if(wn > 52){

            wn = 1;
            this.set('year', parseInt(this.year)+1);
        }else if(wn < 1){
            wn = 52;
            this.set('year', parseInt(this.year)-1);
        }

        this.set('weeknum', wn);
        this.set('weeknumTxt', 'KW' + wn);
    }


    ,buildWeekButtonGroupValues: function(date){

        var week = M.CalendarManager.getWeekRange(date);
        var weekButtonGroup = {
            mo : M.I18N.l(week.mon.format('ddd')) + week.mon.format('dd.mm'),
            tu : M.I18N.l(week.tue.format('ddd')) + week.tue.format('dd.mm'),
            we : M.I18N.l(week.wed.format('ddd')) + week.wed.format('dd.mm'),
            th : M.I18N.l(week.thu.format('ddd')) + week.thu.format('dd.mm'),
            fr : M.I18N.l(week.fri.format('ddd')) + week.fri.format('dd.mm'),
            sa : M.I18N.l(week.sat.format('ddd')) + week.sat.format('dd.mm'),
            su : M.I18N.l(week.sun.format('ddd')) + week.sun.format('dd.mm')
        }
        return weekButtonGroup;
    }

    ,switchToDatepage: function(viewId){


        this.initializeDatePage(viewId);
        //TODO: -- mobileCRM.PageController.gotoCalendarPage();
    }

    ,initializeDatePage: function(viewId, weeknum, buttonPosition){
        var clickedId = 0;
        if(viewId != null){
            clickedId = this.getDayIndexofButtonGroup(viewId);
            //+1 because the < and > button is also in the buttongroupview
            if(buttonPosition == 0 || buttonPosition){
                clickedId++;
            }
        }else if(clickedId){
            //M.Logger.log('initializeDatePage: no id is set');
        }

        this.initDate(weeknum);

        var buttonPosition = buttonPosition ? buttonPosition : 1;
        this.hilightDayButtonOnTerminePage(clickedId);
        var dateToShow = M.Date.getDateByWeekdayAndCalendarWeek(this.weeknum, clickedId, this.year);
        this.setSelectedDay(dateToShow);
        /*
        this.set('weekButtonGroup', this.buildWeekButtonGroupValues(dateToShow));
        this.doRequestForSingleDay(dateToShow);
        */
    }

    ,initDate: function(weeknum, year){
        if(weeknum){
            this.setWeeknum(weeknum);
        } else if(!this.weeknum){
            //TODO:
            this.setWeeknum(M.UtilityManager.aktDate.getWeeknum());
        }
        if(year){
            this.set('year', year);
        } else if(!this.year){
             //TODO:
             this.set('year', M.UtilityManager.year);
        }
    },


    prepareGetActivitiesSingleDay: function(viewId) {
    },

    setSelectedDay: function(date) {
        //TODO:
        M.UtilityManager.getSetSelectedDate(date);
        if(M.DeviceSwitch.device === 'sp') {
            this.sp_setDates();
        } else {
            this.set('year', date.date.getFullYear());
            this.setWeeknum( date.getWeeknum());
            this.hilightDayButtonOnTerminePage(date.date.getDay());
            this.set('weekButtonGroup', this.buildWeekButtonGroupValues(date));
        }
        this.doRequestForSingleDay(date);
    },


    /**
     * Smartphone properties and methods
     *
     */
    sp_currentDateString: '',

    sp_init: function(isFirstLoad) {
        /* set today as current date and then set all the views using this date */
        if(isFirstLoad){
            this.sp_today();
        }
    },

    /**
     * set currentDate to today's date and set date string and KW
     * then make request to get all activities for today (and the week)
     */
    sp_today: function() {
        this.setSelectedDay(M.Date.now());
    },

    /**
     * set currentDate, date string and KW to date on day after the currently set
     * then make request to get all activities for this date (and the week) if necessary
     */
    sp_dayNext: function() {
        //TODO:
        var currentDate = M.UtilityManager.getSetSelectedDate();
        this.setSelectedDay(currentDate.daysFromDate(1));
    },

    /**
     * set currentDate, date string and KW to date on day before the currently set
     * then make request to get all activities for this date (and the week) if necessary
     */
    sp_dayBefore: function() {
        //TODO:
        var currentDate = M.UtilityManager.getSetSelectedDate();
        this.setSelectedDay(currentDate.daysFromDate(-1));
    },

    sp_setDate: function() {
        //TODO:
        var currentDate = M.UtilityManager.getSetSelectedDate();
        var todayString = M.I18N.l(currentDate.format('ddd')) + ' ' + currentDate.format('d.m.yyyy');
        this.set('sp_currentDateString', todayString);
    },

    sp_setCalendarWeek: function() {
        //TODO:
        var currentDate = M.UtilityManager.getSetSelectedDate();
        this.setWeeknum(currentDate.getWeeknum());
    },

    /**
     * Builds currentDateString and sets it. Calculates KW and sets it.
     */
    sp_setDates: function() {
        this.sp_setDate();
        this.sp_setCalendarWeek();
    }
});
