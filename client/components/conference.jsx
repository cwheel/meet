import React from 'react';

import SwRTC from './swrtc';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

import { vidCapture, micCapture } from '../actions/camera';
import { showSidebar, showInvite, inviteEmail, inviteName } from '../actions/conference';
import { invite } from '../actions/metaChannel';

import Sidebar from './sidebar';

function mapStateToProps(state) {
    return {
        vid: state.camera.get('video'),
        mic: state.camera.get('microphone'),
        sidebarVisible: state.conference.get('sidebarVisible'),
        showInvite: state.conference.get('showInvite'),
        inviteEmail: state.conference.get('inviteEmail'),
        inviteName: state.conference.get('inviteName')
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
        this.toggleInvite = this.toggleInvite.bind(this);
        this.sendInvite = this.sendInvite.bind(this);

        this.inviteEmailChanged = this.inviteEmailChanged.bind(this);
        this.inviteNameChanged = this.inviteNameChanged.bind(this);
    }

    inviteEmailChanged(e) {
        this.dispatch(inviteEmail(e.target.value));
    }

    inviteNameChanged(e) {
        this.dispatch(inviteName(e.target.value));
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
                        <i className="fa fa-user-plus" aria-hidden="true" id="invite" onClick={() => this.dispatch(showInvite()) }></i>
                    </div>
                </div>

                {
                    this.props.showInvite &&
                    <ModalContainer onClose={this.toggleInvite}>
                      <ModalDialog onClose={this.toggleInvite}>
                        <div className='dialogTitle'>Who should we invite?</div>

                        <div>
                            <input type='email' className='dialogInput' placeholder='Email Address' onChange={ this.inviteEmailChanged } />
                        </div>

                        <div>
                            <input type='text' className='dialogInput' placeholder='Name' onChange={ this.inviteNameChanged }/>
                        </div>

                        <div className='startButton' onClick={ this.sendInvite }>Invite</div>
                      </ModalDialog>
                    </ModalContainer>
                  }

                <SwRTC room={ this.props.params.room } nick={ this.props.params.nick } />

                <Sidebar />
            </div>
		);
    }

    sendInvite() {
        this.props.dispatch(invite(this.props.inviteEmail, this.props.inviteName, this.props.params.nick, this.props.params.room));
        this.toggleInvite();
    }

    toggleInvite() {
        this.dispatch(showInvite());
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
