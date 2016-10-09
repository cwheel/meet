import React from 'react';

class SpeechToText extends React.Component {
    constructor(props) {
        super(props);
        console.log("Test");
    }

    componentDidMount() {
	    var final_transcript = '';
	    var recognizing = false;
	    var ignore_onend;
	    var start_timestamp;
	    var last_timestamp;
	    if (!window || !('webkitSpeechRecognition' in window)) {

	    } else {
	      var recognition = new webkitSpeechRecognition();
	      recognition.continuous = false;
	      recognition.interimResults = true;

	      recognition.onstart = function() {
	        recognizing = true;
	      };

	      recognition.onerror = function(event) {
	        console.log(event);
	      };

	      recognition.onend = function() {
	        recognizing = false;
	        //Send Data
	        console.log("The end");

 	        startRecognition();
	      };

	      recognition.onresult = function(event) {
	        var interim_transcript = '';
	        if (typeof(event.results) == 'undefined') {
	          recognition.onend = null;
	          recognition.stop();
	          return;
	        }
	        for (var i = event.resultIndex; i < event.results.length; ++i) {
	          if (event.results[i].isFinal) {
	            final_transcript += event.results[i][0].transcript;
	          } else {
	            interim_transcript += event.results[i][0].transcript;
	          }
	        }
	        console.log(final_transcript);
	        console.log(interim_transcript);
	   		last_timestamp = Date.now();
	        if (final_transcript || interim_transcript) {
	        	console.log("onResult");
	        }
	      };
	    

	    var two_line = /\n\n/g;
	    var one_line = /\n/g;
	    function linebreak(s) {
	      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	    }

	    var first_char = /\S/;
	    function capitalize(s) {
	      return s.replace(first_char, function(m) { return m.toUpperCase(); });
	    }

	    function startRecognition() {
    		recognition.start();
	    	recognizing = true;
	    }

	    function stopRecognition() {
	    	recognizing = false;
	    	recognition.stop();
	    }

	    function monitorRecognition() {
			console.log("Happening");
	    	if(recognizing) {
	    		console.log(Date.now());
	    		console.log(last_timestamp + (1000 * 5));
	    		if (last_timestamp + (1000 * 5) < Date.now()) {
	    			stopRecognition();
	    			//startRecognition();
	    			last_timestamp = NaN;
	    			console.log("Stopped");
	    		} 
	    	} else {
	    		//startRecognition();
	    	}
	    	setTimeout(monitorRecognition, 1000)
	    }

		startRecognition();
		//monitorRecognition();
	    var current_style;
	    console.log("Test");
    }
}

    render() {
        return (<div></div>);
    }
}

export default SpeechToText;
