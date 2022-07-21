ngApp.service("notificationservice", function ($http) {
    //Function to call return notification

    this.Notification =  (data, matchData, message) => {
        if (data == matchData) {
             new PNotify({
                title: 'Notification',
                 text: message,
                type: 'custom',
                addclass: 'alert-success',
                icon: 'fa fa-check'
            });
        }
        else {
           new PNotify({
                title: 'Notification',
                text: '!! Failure : ' + data,
                type: 'custom',
                addclass: 'alert-danger',
                icon: 'fa fa-exclamation-triangle'
            });
        }
    }
});  