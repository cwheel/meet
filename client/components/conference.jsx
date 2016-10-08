import React from 'react';

class Conference extends React.Component {
    constructor(props) {
        super(props);

        console.log('loaded')

        this.dispatch = this.props.dispatch;
    }

    render() {
        return (
			<div>conference page</div>
		);
    }
}

export default Conference;
