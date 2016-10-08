import React from 'react';

import SwRTC from './swrtc';

import { connect } from 'react-redux';
import { vidCapture, micCapture } from '../actions/camera';

function mapStateToProps(state) {
    return {
        vid: state.camera.get('video'),
        mic: state.camera.get('microphone'),
    };
}

class Conference extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
        this.mute = this.mute.bind(this);
        this.pause = this.pause.bind(this);
    }

    render() {
        return (
			<div>
                <div className='topbar'>
                    <i className='fa fa-bars' aria-hidden='true'></i>
                    <div className='title'>Meet</div>
                    <div className='tools'>
                        <i className={this.props.mic ? "fa fa-microphone-slash" : "fa fa-microphone"} aria-hidden="true" onClick={ this.mute }></i>
                        <i className="fa fa-video-camera" aria-hidden="true" onClick={ this.pause }></i>
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
                    </div>
                </div>

                <SwRTC />

                <div className='waitingMessage'>Hang tight, we're waiting for others to join.</div>
            </div>
		);
    }

    mute() {
        this.dispatch(micCapture(!this.props.mic));
    }

    pause() {
        this.dispatch(vidCapture(!this.props.vid));
    }
}

export default connect(mapStateToProps)(Conference);
