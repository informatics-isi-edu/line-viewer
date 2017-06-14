
/* event/message linkup with chaise */

/*********************************************************/
// An event listener to capture incoming messages from Chaise
/*********************************************************/
window.addEventListener('message', function(event) {
    if (event.origin === window.location.origin) {
        var messageType = event.data.messageType;
        var data = event.data.content;
        switch (messageType) {
// this is just a placeholder for example
            case 'togglePlot':
                togglePlot(0,'somePlot'); // plot_idx, plotname
                break;
            default:
                console.log('No action performed from event handler. Received message event: ', messageType);
        }
    } else {
        console.log('Invalid event origin. Event origin: ', origin, '. Expected origin: ', window.location.origin);
    }
});

