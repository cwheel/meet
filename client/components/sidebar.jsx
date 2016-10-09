import React from 'react';

import SwRTC from './swrtc';

import { connect } from 'react-redux';
import { vidCapture, micCapture } from '../actions/camera';
import { selectSidebarComponent } from '../actions/conference';

function mapStateToProps(state) {
    return {
        sidebarVisible: state.conference.get('sidebarVisible'),
        sidebarComponent: state.conference.get('sidebarComponent'),
    };
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
        this.selectComponent = this.selectComponent.bind(this);
    }

    render() {
        return (
			<div id='sidebar' className={this.props.sidebarVisible ? '' : 'sidebarIn'}>
                <div className='sidebarHeader'>
                    <div className={this.props.sidebarComponent == 'participants' ? 'selectedHeader' : '' } onClick={ () => this.selectComponent('participants') }>Participants</div>
                    <div className={this.props.sidebarComponent == 'knowledge' ? 'selectedHeader' : '' } onClick={ () => this.selectComponent('knowledge') }>Knowledge</div>
                </div>

                <div id='remoteVideos' className={this.props.sidebarComponent == 'participants' ? 'visible' : 'invisible'}></div>
                <div className={this.props.sidebarComponent == 'knowledge' ? 'visible' : 'invisible'}></div>
            </div>
		);
    }

    selectComponent(component) {
        this.dispatch(selectSidebarComponent(component));
    }
}

export default connect(mapStateToProps)(Sidebar);
