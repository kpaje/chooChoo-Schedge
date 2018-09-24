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

var actions = {
    trainName   : '',
    destination : '', 
    frequency   : '',
    nextArrival : '',

    getUserInput: function() {
        this.trainName   = $('#name-input').val().trim();
        this.destination = $('#destination-input').val().trim();
        this.frequency   = $('#frequency-input').val().trim();
        this.nextArrival = $('#nextArrival-input').val().trim();
    },
    uploadData: function() {
        return database.ref().push({
            name:        this.trainName,
            destination: this.destination,
            frequency:   this.frequency,
            arrival: this.nextArrival
        });
    },
    clearTextBoxes: function() {
        $('#name-input').val('');
        $('#destination-input').val('');
        $('#frequency-input').val('');
        $('#nextArrival-input').val('');
    },
    storeChildSnapShot: function(childSnapshot) {
        this.trainName   = childSnapshot.val().name;
        this.destination = childSnapshot.val().destination;
        this.frequency   = childSnapshot.val().frequency;
        this.nextArrival = childSnapshot.val().arrival;
        return;
    },
    convertTime: function(time) {
        return moment(time, 'hh:mm a').format('HH:mm');
    },
    calculateMinutesAway: function() {
        var now  = moment.utc(this.frequency, "HH:mm");
        var then = moment.utc(this.nextArrival, "HH:mm");
        if (then.isBefore(now)) then.add(1, 'day');
        var eta  =  moment.duration(then.diff(now));
        return moment.duration(eta).as('minutes');
    },
    createRowData: function() {
        var tableData = $('<tr>').append(
            $('<td>').text(this.trainName),
            $('<td>').text(this.destination),
            $('<td>').text(this.convertTime(this.frequency)),
            $('<td>').text(this.convertTime(this.nextArrival)),
            $('<td>').text(this.calculateMinutesAway()),
        );
        $('#train-table > tbody').append(tableData);
    },
};

var handlers = {
    getUserInput: $('#add-train-btn').on('click', function(event) {
        event.preventDefault();
        actions.getUserInput();
        actions.uploadData();
        console.log('train successfully added');
        actions.clearTextBoxes();
    }),
    
    logEntry: database.ref().on('child_added', function(childSnapshot) {
        actions.storeChildSnapShot(childSnapshot);
        actions.createRowData();
    }),

    scrollToAccordianContent: $('.collapse').on('shown.bs.collapse', function() {
        $('html,body').animate({
            scrollTop: $('.card-body').offset().top
        });
    }),
};

