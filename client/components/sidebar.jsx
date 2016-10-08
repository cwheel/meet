import React from 'react';

import SwRTC from './swrtc';

import { connect } from 'react-redux';
import { vidCapture, micCapture } from '../actions/camera';

function mapStateToProps(state) {
    return {
        sidebarVisible: state.conference.get('sidebarVisible')
    };
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
    }

    render() {
        return (
			<div id='sidebar' className={this.props.sidebarVisible ? '' : 'sidebarIn'}>
                <div className='sidebarHeader'>
                    <div>Participants</div>
                    <div>Knowledge</div>
                </div>

                <div id='remoteVideos'></div>
            </div>
		);
    }
}

export default connect(mapStateToProps)(Sidebar);
