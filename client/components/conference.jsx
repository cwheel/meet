import React from 'react';

import SwRTC from './swrtc';

import { connect } from 'react-redux';

class Conference extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
    }

    render() {
        return (
			<div>
                <div className='topbar'>
                    <i className='fa fa-bars' aria-hidden='true'></i>
                    <div className='title'>Meet</div>
                    <div className='tools'>tools here</div>
                </div>

                <SwRTC />
            </div>
		);
    }
}

export default connect()(Conference);
