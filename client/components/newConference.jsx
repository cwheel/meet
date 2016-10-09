import React from 'react';
import { connect } from 'react-redux';

import { push } from 'react-router-redux';
import randomstring from 'randomstring';
import { newConferenceName, newConferenceEmail } from '../actions/conference';

function mapStateToProps(state) {
    return {
        newConferenceName: state.conference.get('newConferenceName'),
        newConferenceEmail: state.conference.get('newConferenceEmail')
    };
}

class NewConference extends React.Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
        this.start = this.start.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.enterKey = this.enterKey.bind(this);
    }

    componentDidMount() {
        if (window.location.hash) {
            let redirect = window.location.hash.substring(1);
            this.dispatch(push(redirect));
        }
    }

    onChangeName(e) {
        this.dispatch(newConferenceName(e.target.value));
    }

    onChangeEmail(e) {
        this.dispatch(newConferenceEmail(e.target.value));
    }

    enterKey(e) {
        if (e.key == 'Enter') this.start()
    }

    render() {
        return (
			<div className='centeredContainer'>
                <div className='appTitle'>meet</div>
                <div className='appSubTitle'>intelligent video conferencing</div>

                <input type='text' className='nameInput' onChange={ this.onChangeName } placeholder='Your Name'/>
                <input type='text' className='nameInput' onChange={ this.onChangeEmail } placeholder='Your Email' style={{marginTop: '10px'}} onKeyDown={ this.enterKey }/>

                <div className='startButton' onClick={ this.start }>Start Talking</div>
            </div>
		);
    }

    start() {
        this.dispatch(push(`/r/${randomstring.generate(10)}/${encodeURIComponent(this.props.newConferenceName)}/${btoa(this.props.newConferenceEmail)}`));
    }
}

export default connect(mapStateToProps)(NewConference);
