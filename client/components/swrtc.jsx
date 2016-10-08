import React from 'react';
import { connect } from 'react-redux';
import hark from 'hark';
import attachmediastream from 'attachmediastream';

import { connect as connectMeta, speechEvent } from '../actions/metaChannel';

function mapStateToProps(state) {
    return {
        socket: state.metaChannel.get('socket'),
    };
}

class SwRTC extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;

        if (!window.SimpleWebRTC) throw new Error('SimpleWebRTC is not loaded!');
    }

    componentWillReceiveProps(nextProps) {
        // Make sure we never bound before
        if (!this.props.socket && nextProps.socket) {
            // Bind on the event
            let curSpeaker = '';

            nextProps.socket.on('speakerChanged', (speaker) => {
                // Make sure the speaker isn't us
                if (speaker.peerId != window.swrtcCall.connection.getSessionid()) {
                    console.log('remote speaker', speaker)

                    let peers = swrtcCall.getPeers();
                    let speakerStream = 0;

                    for (let i = 0; i < peers.length; i++) {
                        if (peers[i].id == speaker.peerId) {
                            speakerStream = peers[i].stream;
                        }
                    }

                    if (speaker.peerId != curSpeaker) {
                        attachmediastream(speakerStream, document.getElementById('speakerVideo'), { muted: true });
                        curSpeaker = speaker.peerId;
                    }
                }
            });
        }
    }

    componentDidMount() {
        let dispatch = this.dispatch;

        // Configure new call
        window.swrtcCall = new SimpleWebRTC({
          localVideoEl: 'localVideo',
          remoteVideosEl: 'remoteVideos',
          autoRequestMedia: true
        });

        // Join room when the call object is ready
        window.swrtcCall.on('readyToCall', () => {
            window.swrtcCall.joinRoom('562i8dfhfe3fu39f4');
            dispatch(connectMeta());
        });

        // Watch the stream for speaking stop/start events
        window.swrtcCall.on('localStream', (stream) => {
            var speechEvents = hark(stream, {});

            speechEvents.on('speaking', () => {
                dispatch(speechEvent(true));
            });

            speechEvents.on('stopped_speaking', () => {
                dispatch(speechEvent(false));
            });
        });
    }

    render() {
        return (
			<div>
                <video id='speakerVideo'></video>
                <div id='localVideo'></div>
                <div id='remoteVideos'></div>
            </div>
		);
    }
}

export default connect(mapStateToProps)(SwRTC);
