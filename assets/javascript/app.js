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
        this.trainName = $('#name-input').val().trim();
        this.destination = $('#destination-input').val().trim();
        this.frequency = $('#frequency-input').val();
        this.nextArrival = $('#nextArrival-input').val();
    },
    uploadData: function() {
        return database.ref().push({
            name: this.trainName,
            destination: this.destination,
            frequency: this.frequency,
            arrival: this.nextArrival
        });
    },
    clearTextBoxes: function() {
        // varArray = Object.keys( window );
        // for (let i = 0; i < varArray.length; i++) {
        //     idName = '#' + varArray[i] + '-input';
        //     console.log(varArray[i]);
        //     console.log($(idName).val(''));
        // };
        $('#name-input').val('');
        $('#destination-input').val('');
        $('#frequency-input').val('');
        $('#nextArrival-input').val('');
    },
    storeChildSnapShot: function(childSnapshot) {
        this.trainName = childSnapshot.val().name;
        this.destination = childSnapshot.val().destination;
        this.frequency = childSnapshot.val().frequency;
        this.nextArrival = childSnapshot.val().nextArrival;
        return;
    },
    convertTime: function(time) {
        return moment(time, 'hh:mm').format('HH:mm');
    },
    calculateMinutesAway: function() {
        return moment.duration(this.frequency).as('minutes', true);
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
        console.log(childSnapshot.val());
        actions.storeChildSnapShot(childSnapshot);
    console.log(trainName = childSnapshot.val().name);
    console.log(destination = childSnapshot.val().destination);
    console.log(frequency = childSnapshot.val().frequency);
    console.log(nextArrival = childSnapshot.val().nextArrival);
    console.log(trainName = childSnapshot.val().name);

        actions.createRowData();
    }),

    scrollAccordianContent: $('.collapse').on('shown.bs.collapse', function() {
        $('html,body').animate({
            scrollTop: $('.card-body').offset().top
        });
    }),
};

