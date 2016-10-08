import React from 'react';
import { connect } from 'react-redux';
import hark from 'hark';
import attachmediastream from 'attachmediastream';
import SpeechToText from './speechToText';

import { connect as connectMeta, speechEvent } from '../actions/metaChannel';
import { conferenceStarted } from '../actions/conference';

function mapStateToProps(state) {
    return {
        socket: state.metaChannel.get('socket'),
        vid: state.camera.get('video'),
        mic: state.camera.get('microphone'),
        conferenceStarted: state.conference.get('conferenceStarted')
    };
}

class SwRTC extends React.Component {
    constructor(props) {
        super(props);
        this.dispatch = this.props.dispatch;
        console.log(SpeechToText);
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
                    console.log('remote speaker', speaker);

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
        let hasBeenAttatched = false;

        // Configure new call
        window.swrtcCall = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: 'remoteVideos',
            autoRequestMedia: true,
            nick: this.props.nick
        });

        // Join room when the call object is ready
        window.swrtcCall.on('readyToCall', () => {
            window.swrtcCall.joinRoom(this.props.room);
            dispatch(connectMeta());
        });

        window.swrtcCall.on('videoAdded', (video, peer) => {
            if (!hasBeenAttatched) {
                attachmediastream(peer.stream, document.getElementById('speakerVideo'), { muted: true });
                hasBeenAttatched = true;

                dispatch(conferenceStarted());
            }
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

                <div id='localVideo'>
                    <div className={ this.props.mic ? 'overlayHidden' : 'mutedOverlay' }>
                        <i className="fa fa-microphone-slash" aria-hidden="true"></i>
                    </div>
                </div>

                <SpeechToText />
                <div id='remoteVideos'></div>
                {!this.props.conferenceStarted ? <div className='waitingMessage'>Hang tight, we're waiting for others to join.</div> : null}
            </div>
		);
    }
}

export default connect(mapStateToProps)(SwRTC);
