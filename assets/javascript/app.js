//firebase configuration
const config = {
    apiKey: "AIzaSyAK39CFKgh3QpnZpLQ2bt-ndHxH-9tVPVk",
    authDomain: "choochoo-schedge.firebaseapp.com",
    databaseURL: "https://choochoo-schedge.firebaseio.com",
    projectId: "choochoo-schedge",
    storageBucket: '',
    messagingSenderId: "253718659298"
};
firebase.initializeApp(config);
const database = firebase.database();

var trainName   = '';
var destination = ''; 
var boarding    = '';
var nextArrival = '';

var capture = {
    uploadData: function() {
        return database.ref().push({
            name        : trainName,
            destination : destination,
            boarding    : boarding,
            arrival     : nextArrival
        });
    },
    userInputs: function() {
        trainName   = $('#name-input').val().trim();
        destination = $('#destination-input').val().trim();
        boarding    = $('#boarding-input').val().trim();
        nextArrival = $('#nextArrival-input').val().trim();
        return;
    },
    childSnapShots: function(childSnapshot) {
        trainName   = childSnapshot.val().name;
        destination = childSnapshot.val().destination;
        boarding    = childSnapshot.val().boarding;
        nextArrival = childSnapshot.val().arrival;
        return;
    },
};

var actions = {
    clearTextBoxes: function() {
        $('#name-input').val('');
        $('#destination-input').val('');
        $('#boarding-input').val('');
        $('#nextArrival-input').val('');
    },
    convertTime: function(time) {
        return moment(time, 'hh:mm a').format('HH:mm');
    },
    calculateMinutesAway: function() {
        var now  = moment.utc(boarding, "HH:mm");
        var then = moment.utc(nextArrival, "HH:mm");
        var eta  =  moment.duration(then.diff(now));
        if (then.isBefore(now))then.add(1, 'day');
        return moment.duration(eta).as('minutes');
    },
    populateRowData: function() {
        var tableData = $('<tr>').append(
            $('<td>').text(trainName),
            $('<td>').text(destination),
            $('<td>').text(this.convertTime(boarding)),
            $('<td>').text(this.convertTime(nextArrival)),
            $('<td>').text(this.calculateMinutesAway()),
        );
        $('#train-table > tbody').append(tableData);
    },
};

var handlers = {
    getUserInput: $('#add-train-btn').on('click', function(event) {
        event.preventDefault();
        capture.userInputs();
        capture.uploadData();
        console.log('train successfully added');
        actions.clearTextBoxes();
    }),
    logEntry: database.ref().on('child_added', function(childSnapshot) {
        capture.childSnapShots(childSnapshot);
        actions.populateRowData();
    }),
    scrollToAccordianContent: $('.collapse').on('shown.bs.collapse', function() {
        $('html,body').animate({
            scrollTop: $('.card-body').offset().top
        });
    }),
};