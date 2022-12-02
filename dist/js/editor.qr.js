/**
 *
 * @name Instascan
 * @summary QR Reader for HTML5
 * @requires [Instascan](https://github.com/schmich/instascan)
 * 
 * @depjs //rawgit.com/schmich/instascan-builds/master/instascan.min.js
 *
 * @example
 *
 * new $.fn.dataTable.Editor( {
 *   "ajax": "/api/documents",
 *   "table": "#documents",
 *   "fields": [ {
 *       "label": "Description:",
 *       "name": "description",
 *       "type": "qr"
 *     }, 
 *     // additional fields...
 *   ]
 * } );
 */


(function( factory ){
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( ['jquery', 'datatables', 'datatables-editor'], factory );
    }
    else if ( typeof exports === 'object' ) {
        // Node / CommonJS
        module.exports = function ($, dt) {
            if ( ! $ ) { $ = require('jquery'); }
            factory( $, dt || $.fn.dataTable || require('datatables') );
        };
    }
    else if ( jQuery ) {
        // Browser standard
        factory( jQuery, jQuery.fn.dataTable );
    }
}(function( $, DataTable ) {
'use strict';


if ( ! DataTable.ext.editorFields ) {
    DataTable.ext.editorFields = {};
}

var _fieldTypes = DataTable.Editor ?
    DataTable.Editor.fieldTypes :
    DataTable.ext.editorFields;



_fieldTypes.qr = {
    create: function ( conf ) {
        var safeId = DataTable.Editor.safeId( conf.id ); // Get an ID to use with the input tag as this is where our value will be stored
		var input = $('<input id="'+safeId+'"/>'); // Declare the input element with the safe ID
        var video = $('<video/>').css({display:'none', "max-width":"100%", "padding": "2% 0%"}); // Declare the video element
		var scan = $('<button>Scan</button>').css({"margin": "0% 1%"}); // Declare the button to start/stop scanning
		var container = $('<div/>').append(input).append(scan).append(video); // Declare a container to hold the above

        conf.qr = new Instascan.Scanner({video: video[0]}); // Initialise Instascan sending the video feed to our video element
		conf.qrInput = input; // Add a reference to the input element so that we can access it in other methods
		conf.qrScan = scan; // Add a reference to the start/stop button so that we can access it in other methods

        // Add the scan listener to extract and set the value
        // Also add and remove a border to show that a scan has taken place
        conf.qr.addListener('scan', function ( content ) {
			$(input).val(content).css({"border": "blue 2px solid"});
            $(video).css({"border": "blue 2px solid"});

			setTimeout(() => {
				$(input).css({"border": "none"});
				$(video).css({"border": "none"});
			}, 500);
		});

        // When the form is closed, stop the webcam from running
		this.on('close', function(){
			conf.qr.stop();
		})

        return container;
    },
 
    get: function ( conf ) {
        return conf.qrInput.val(); // The value to be displayed in the table should be taken from the input element
    },
 
    set: function ( conf, val ) {
        // If val is passed in then it needs to be set
        if (val !== null) {
            conf.qrInput.val(val);
        }

		conf.qrScan
			.unbind('click') // If there are multiple QR fields in the form then we don't want to run the listener too many times 
			.on('click', function() {
                // When the video needs to start scanning
				if(this.innerHTML === 'Scan'){
					Instascan.Camera.getCameras().then(function (cameras) {
						if (cameras.length > 0) {
							$(conf.qr.video).css({display:'block'}) // Make the video feed line up nicely in the form
							conf.qr.start(cameras[0]); // Start scanning for QR codes
						} else {
							console.error('No cameras found.');
						}
					}).catch(function (e) {
						console.error(e);
                    });

					this.innerHTML = "Stop"; // Change the text in the button as next time it will need to stop
					return;
                }
                // When the video needs to stop scanning
				else if(this.innerHTML === "Stop") {
					$(conf.qr.video).css({display:'none'}) // Hide the video feed
					conf.qr.stop(); // Stop scanning and turn off the camera
					this.innerHTML = "Scan"; // Change the text in the button as next time it will need to scan
					return;
				}
			})
    },
 
    enable: function ( conf ) {},
 
    disable: function ( conf ) {},
};


}));