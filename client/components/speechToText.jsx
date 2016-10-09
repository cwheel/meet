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
	    if (!window || !('webkitSpeechRecognition' in window)) {

	    } else {
	      var recognition = new webkitSpeechRecognition();
	      recognition.continuous = true;
	      recognition.interimResults = true;

	      recognition.onstart = function() {
	        recognizing = true;
	      };

	      recognition.onerror = function(event) {
	        console.log(event)
	      };

	      recognition.onend = function() {
	        recognizing = false;
	        if (ignore_onend) {
	          return;
	        }
	        if (!final_transcript) {
	          return;
	        }
	        if (window.getSelection) {
	          window.getSelection().removeAllRanges();
	          var range = document.createRange();
	          range.selectNode(document.getElementById('final_span'));
	          window.getSelection().addRange(range);
	        }
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
	        if (final_transcript || interim_transcript) {
	        }
	      };
	    }

	    var two_line = /\n\n/g;
	    var one_line = /\n/g;
	    function linebreak(s) {
	      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	    }

	    var first_char = /\S/;
	    function capitalize(s) {
	      return s.replace(first_char, function(m) { return m.toUpperCase(); });
	    }

	    function startButton(event) {
	      if (recognizing) {
	        recognition.stop();
	        return;
	      }
	      final_transcript = '';
	      recognition.lang = 'en-US'
	      recognition.start();
	      ignore_onend = false;
	    }

	    var current_style;
	    startButton();
	    console.log("Test");
    }

    render() {
        return (<div></div>);
    }
}

export default SpeechToText;
