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
        this.curSpeaker = '';

        if (!window.SimpleWebRTC) throw new Error('SimpleWebRTC is not loaded!');
    }

    componentWillReceiveProps(nextProps) {
        // Make sure we never bound before
        if (!this.props.socket && nextProps.socket) {
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

                    if (speaker.peerId != this.curSpeaker) {
                        attachmediastream(speakerStream, document.getElementById('speakerVideo'), { muted: true });
                        this.curSpeaker = speaker.peerId;
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
            autoRequestMedia: true,
            nick: this.props.nick
        });

        window.swrtcCall.on('videoAdded', (video, peer) => {
            if (!hasBeenAttatched) {
                attachmediastream(peer.stream, document.getElementById('speakerVideo'), { muted: true });
                hasBeenAttatched = true;

                dispatch(conferenceStarted());
            }

            let remotes = document.getElementById('remoteVideos');
            if (remotes) {
                let container = document.createElement('div');
                container.className = 'videoContainer';
                container.id = 'container_' + window.swrtcCall.getDomId(peer);


                let nickname = document.createElement('span');
                nickname.textContent = peer.nick;
                nickname.className = 'videoNickname';

                container.appendChild(nickname);
                container.appendChild(video);

                // suppress contextmenu
                video.oncontextmenu = function () { return false; };

                remotes.appendChild(container);
            }
        });

        window.swrtcCall.on('videoRemoved', (video, peer) => {
            let remotes = document.getElementById('remoteVideos');
            let el = document.getElementById(peer ? 'container_' + window.swrtcCall.getDomId(peer) : 'localScreenContainer');

            if (remotes && el) {
                remotes.removeChild(el);
            }

            if (this.curSpeaker == peer.id) {
                attachmediastream(window.swrtcCall.getPeers()[0].stream, document.getElementById('speakerVideo'), { muted: true });
            }
        });

        // Join room when the call object is ready
        window.swrtcCall.on('readyToCall', () => {
            window.swrtcCall.joinRoom(this.props.room);
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

                <div id='localVideo'>
                    <div className={ this.props.mic ? 'overlayHidden' : 'mutedOverlay' }>
                        <i className="fa fa-microphone-slash" aria-hidden="true"></i>
                    </div>
                </div>

                <SpeechToText nick={this.props.nick} />
                <div id='remoteVideos'></div>
                {!this.props.conferenceStarted ? <div className='waitingMessage'>Hang tight, we're waiting for others to join.</div> : null}
            </div>
		);
    }
}

export default connect(mapStateToProps)(SwRTC);
