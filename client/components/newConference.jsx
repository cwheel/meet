import React from 'react';
import { connect } from 'react-redux';

import { push } from 'react-router-redux';
import randomstring from 'randomstring';
import { newConferenceName } from '../actions/conference';

function mapStateToProps(state) {
    return {
        newConferenceName: state.conference.get('newConferenceName')
    };
}

class NewConference extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
        this.start = this.start.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (window.location.hash) {
            let redirect = window.location.hash.substring(1);
            this.dispatch(push(redirect));
        }
    }

    onChange(e) {
        this.dispatch(newConferenceName(e.target.value));
    }

    render() {
        return (
			<div className='centeredContainer'>
                <div className='appTitle'>meet</div>
                <div className='appSubTitle'>intelligent video conferencing</div>

                <input type='text' className='nameInput' onChange={ this.onChange } placeholder='Your Name'/>
                <div className='startButton' onClick={ this.start }>Start Talking</div>
            </div>
		);
    }

    start() {
        this.dispatch(push(`/r/${randomstring.generate(10)}/${encodeURIComponent(this.props.newConferenceName)}`));
    }
}

export default connect(mapStateToProps)(NewConference);
