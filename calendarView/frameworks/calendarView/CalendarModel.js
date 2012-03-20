M.CalendarModel = M.Object.extend({

    startLabel:'',
    endLabel:'',
    description:'',
    guestLabel:'',
    typeLabel:'',
    wholeDay:'',
    actStatus:'',
    eventid:'',
    start:'',
    end:'',

    init:function (descr, start, end) {
        return this.extend({
            start:start,
            end:end,
            description:descr
        });
    }

});

/*
 {

 startLabel      : 'startLabel',
 endLabel        : 'endLabel',
 descriptionLabel: 'descriptionLabel',
 guestLabel      : 'guestLabel',
 typeLabel       : 'typeLabel',
 wholeDay        : 'wholeDay',
 actStatus       : 'actStatus',
 eventid         : 'eventid',
 start           : 'start',
 end             : 'end'

 }

 */