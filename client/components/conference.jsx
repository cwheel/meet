import React from 'react';

import SwRTC from './swrtc';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { vidCapture, micCapture } from '../actions/camera';
import { showSidebar } from '../actions/conference';

import Sidebar from './sidebar';

function mapStateToProps(state) {
    return {
        vid: state.camera.get('video'),
        mic: state.camera.get('microphone'),
        sidebarVisible: state.conference.get('sidebarVisible')
    };
}

class Conference extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
        this.mute = this.mute.bind(this);
        this.pause = this.pause.bind(this);
        this.sidebar = this.sidebar.bind(this);
        this.leave = this.leave.bind(this);
    }

    render() {
        return (
			<div className='page'>
                <div className='topbar'>
                    <i className={ this.props.sidebarVisible ? 'fa fa-bars bars-selected' : 'fa fa-bars' } aria-hidden='true' onClick={ this.sidebar }></i>
                    <div className='title'>Meet</div>
                    <div className='tools'>
                        <div className='leaveCall' onClick={ this.leave }>Leave Call</div>
                        <i className={this.props.mic ? "fa fa-microphone-slash" : "fa fa-microphone"} aria-hidden="true" onClick={ this.mute }></i>
                        <i className="fa fa-video-camera" aria-hidden="true" onClick={ this.pause }></i>
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
                    </div>
                </div>

                <SwRTC room={ this.props.params.room } nick={ this.props.params.nick } />

                <Sidebar />
            </div>
		);
    }

    mute() {
        this.dispatch(micCapture(!this.props.mic));
    }

    pause() {
        this.dispatch(vidCapture(!this.props.vid));
    }

    sidebar() {
        this.dispatch(showSidebar(!this.props.sidebarVisible));
    }

    leave() {
        this.dispatch(push('/'));
    }
}

export default connect(mapStateToProps)(Conference);
